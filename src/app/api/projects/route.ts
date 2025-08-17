import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions, PLAN_LIMITS } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AppError, handleApiError, generateProjectSlug, validateProjectName, shouldResetUsage } from '@/lib/utils'

// GET /api/projects - Get user's projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
  const status = (searchParams.get('status') || undefined) as any

    const skip = (page - 1) * limit

    const where = {
      userId: session.user.id,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
  ...(status ? { status } : {}),
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { files: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get projects API error:', error)
    const { message, code, statusCode } = handleApiError(error)
    
    return NextResponse.json(
      { error: message, code },
      { status: statusCode }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, template } = body

    // Validate project name
    const nameValidation = validateProjectName(name)
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      )
    }

    // Get user data and check usage limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        plan: true,
        projectsUsed: true,
        usageResetDate: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Reset usage if needed
    if (shouldResetUsage(user.usageResetDate)) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          aiCallsUsed: 0,
          projectsUsed: 0,
          exportsUsed: 0,
          usageResetDate: new Date(),
        },
      })
      user.projectsUsed = 0
    }

    // Check projects limit
    const planLimits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS]
    const limit = planLimits.maxProjects
    if (limit !== -1 && user.projectsUsed >= limit) {
      throw new AppError(
        'Projects limit reached. Please upgrade your plan.',
        'USAGE_LIMIT_REACHED',
        429
      )
    }

    // Create project (schema uses simple fields; config stored in framework/styling/database)
    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: session.user.id,
        framework: 'nextjs',
        styling: 'tailwind',
        database: 'postgresql',
      },
      include: {
        _count: {
          select: { files: true },
        },
      },
    })

    // Update user projects count
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        projectsUsed: { increment: 1 },
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Create project API error:', error)
    const { message, code, statusCode } = handleApiError(error)
    
    return NextResponse.json(
      { error: message, code },
      { status: statusCode }
    )
  }
}