import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions, PLAN_LIMITS } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AppError, handleApiError, shouldResetUsage } from '@/lib/utils'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface GenerateCodeRequest {
  prompt: string
  framework?: string
  features?: string[]
}

export async function POST(
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
    const body: GenerateCodeRequest = await request.json()
    const { prompt, framework = 'nextjs', features = [] } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt je povinný' },
        { status: 400 }
      )
    }

    // Ověříme, že projekt patří uživateli
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Projekt nenalezen' },
        { status: 404 }
      )
    }

    // Získáme data uživatele a zkontrolujeme limity
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
        { error: 'Uživatel nenalezen' },
        { status: 404 }
      )
    }

    // Resetujeme usage pokud je potřeba
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

    // Zkontrolujeme limit AI volání
    const planLimits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS]
    const limit = planLimits.aiCallsPerMonth
    if (limit !== -1 && user.aiCallsUsed >= limit) {
      throw new AppError(
        'Dosáhli jste limitu AI volání. Prosím upgradujte váš plán.',
        'USAGE_LIMIT_REACHED',
        429
      )
    }

    // Vytvoříme systémový prompt
    const systemPrompt = `Jste expert na vývoj webových aplikací. Generujte kvalitní, produkční kód pro ${framework} aplikaci.

Pokyny:
- Používejte TypeScript
- Používejte moderní React patterns (hooks, functional components)
- Kód musí být čistý, čitelný a dobře strukturovaný
- Přidejte komentáře pro složitější logiku
- Používejte Tailwind CSS pro styling
- Implementujte error handling
- Kód musí být připraven k okamžitému použití

Funkce k implementaci: ${features.join(', ')}

Vygenerujte kompletní soubory s jejich cestami.`

    // Zavoláme OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    })

    const generatedCode = completion.choices[0]?.message?.content

    if (!generatedCode) {
      throw new AppError(
        'Nepodařilo se vygenerovat kód',
        'AI_GENERATION_FAILED',
        500
      )
    }

    // Aktualizujeme počet AI volání
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        aiCallsUsed: { increment: 1 },
      },
    })

    // Aktualizujeme status projektu (použít enum hodnotu z Prisma schema)
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date(),
      },
    })

    // Uložíme generovaný kód jako soubory projektu (zjednodušená verze)
    // V reálné aplikaci bychom parsovali generovaný kód a vytvořili jednotlivé soubory
    await prisma.projectFile.create({
      data: {
        projectId,
        filename: 'generated-code.md',
        path: '/generated-code.md',
        content: generatedCode,
      },
    })

    return NextResponse.json({
      success: true,
      generatedCode,
      tokensUsed: completion.usage?.total_tokens || 0,
      aiCallsRemaining: limit === -1 ? -1 : Math.max(0, limit - (user.aiCallsUsed + 1)),
    })
  } catch (error) {
    console.error('Generate code API error:', error)
    const { message, code, statusCode } = handleApiError(error)
    
    return NextResponse.json(
      { error: message, code },
      { status: statusCode }
    )
  }
}