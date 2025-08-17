import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/utils'

// GET /api/projects/[id] - Get project details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projectId = params.id

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      },
      include: {
        files: {
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { files: true }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Projekt nenalezen' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Get project API error:', error)
    const { message, code, statusCode } = handleApiError(error)
    
    return NextResponse.json(
      { error: message, code },
      { status: statusCode }
    )
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projectId = params.id
    const body = await request.json()
    const { name, description } = body

    // Ověříme, že projekt patří uživateli
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Projekt nenalezen' },
        { status: 404 }
      )
    }

    // Aktualizujeme projekt
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: { files: true }
        }
      }
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Update project API error:', error)
    const { message, code, statusCode } = handleApiError(error)
    
    return NextResponse.json(
      { error: message, code },
      { status: statusCode }
    )
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projectId = params.id

    // Ověříme, že projekt patří uživateli
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Projekt nenalezen' },
        { status: 404 }
      )
    }

    // Smažeme všechny soubory projektu
    await prisma.projectFile.deleteMany({
      where: { projectId }
    })

    // Smažeme projekt
    await prisma.project.delete({
      where: { id: projectId }
    })

    // Snížíme počítadlo projektů uživatele
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        projectsUsed: { decrement: 1 }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete project API error:', error)
    const { message, code, statusCode } = handleApiError(error)
    
    return NextResponse.json(
      { error: message, code },
      { status: statusCode }
    )
  }
}