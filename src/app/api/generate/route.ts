import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions, PLAN_LIMITS } from '@/lib/auth'
import { AIService, AI_CONFIGS, formatPromptTemplate, PROMPT_TEMPLATES } from '@/lib/ai'
import { prisma } from '@/lib/prisma'
import { AppError, handleApiError, shouldResetUsage } from '@/lib/utils'

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
    const { prompt, type = 'component', context, aiProvider = 'gemini' } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Get user data and check usage limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        plan: true,
        aiCallsUsed: true,
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
      user.aiCallsUsed = 0
    }

    // Check AI calls limit
    const planLimits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS]
    const limit = planLimits.aiCallsPerMonth
    if (limit !== -1 && user.aiCallsUsed >= limit) {
      throw new AppError(
        'AI calls limit reached. Please upgrade your plan.',
        'USAGE_LIMIT_REACHED',
        429
      )
    }

    // Initialize AI service
    const aiConfig = AI_CONFIGS[aiProvider as keyof typeof AI_CONFIGS] || AI_CONFIGS.gemini
    const aiService = new AIService(aiConfig)

    // Format prompt based on type
    let formattedPrompt = prompt
    if (type in PROMPT_TEMPLATES) {
      formattedPrompt = formatPromptTemplate(
        PROMPT_TEMPLATES[type as keyof typeof PROMPT_TEMPLATES],
        prompt
      )
    }

    // Generate code
    const generatedCode = await aiService.generateCode(formattedPrompt, context)
    
    // Estimate tokens and cost
    const estimatedTokens = aiService.estimateTokens(formattedPrompt + generatedCode)
    const estimatedCost = aiService.calculateCost(estimatedTokens)

    // Update user usage and log API usage
    await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          aiCallsUsed: { increment: 1 },
        },
      }),
      // Log API usage using the ApiUsage model fields defined in Prisma schema
      prisma.apiUsage.create({
        data: {
          userId: session.user.id,
          endpoint: '/api/generate',
          method: 'POST',
          tokens: estimatedTokens,
          cost: estimatedCost,
        },
      }),
    ])

    return NextResponse.json({
      code: generatedCode,
      metadata: {
        provider: aiProvider,
        model: aiConfig.model,
        tokensUsed: estimatedTokens,
        cost: estimatedCost,
        type,
      },
    })
  } catch (error) {
    console.error('Generate API error:', error)
    const { message, code, statusCode } = handleApiError(error)
    
    return NextResponse.json(
      { error: message, code },
      { status: statusCode }
    )
  }
}