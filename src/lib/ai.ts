import { GoogleGenerativeAI } from '@google/generative-ai'

// AI Provider types
export type AIProvider = 'gemini' | 'openai' | 'anthropic'

export interface AIConfig {
  provider: AIProvider
  model: string
  temperature?: number
  maxTokens?: number
}

// Default configurations for each provider
export const AI_CONFIGS: Record<AIProvider, AIConfig> = {
  gemini: {
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    temperature: 0.7,
    maxTokens: 8192,
  },
  openai: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4096,
  },
  anthropic: {
    provider: 'anthropic',
    model: 'claude-3-sonnet-20240229',
    temperature: 0.7,
    maxTokens: 4096,
  },
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export class AIService {
  private config: AIConfig

  constructor(config: AIConfig = AI_CONFIGS.gemini) {
    this.config = config
  }

  async generateCode(prompt: string, context?: string): Promise<string> {
    switch (this.config.provider) {
      case 'gemini':
        return this.generateWithGemini(prompt, context)
      case 'openai':
        return this.generateWithOpenAI(prompt, context)
      case 'anthropic':
        return this.generateWithAnthropic(prompt, context)
      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`)
    }
  }

  private async generateWithGemini(prompt: string, context?: string): Promise<string> {
    const model = genAI.getGenerativeModel({ 
      model: this.config.model,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      },
    })

    const fullPrompt = this.buildPrompt(prompt, context)
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    return response.text()
  }

  private async generateWithOpenAI(prompt: string, context?: string): Promise<string> {
    // TODO: Implement OpenAI integration
    throw new Error('OpenAI integration not implemented yet')
  }

  private async generateWithAnthropic(prompt: string, context?: string): Promise<string> {
    // TODO: Implement Anthropic integration
    throw new Error('Anthropic integration not implemented yet')
  }

  private buildPrompt(userPrompt: string, context?: string): string {
    const systemPrompt = `You are an expert Next.js 15 developer with deep knowledge of React, TypeScript, and Tailwind CSS. 
Your task is to generate high-quality, production-ready code based on user requirements.

Guidelines:
- Use Next.js 15 with App Router
- Write TypeScript with proper types
- Use Tailwind CSS for styling
- Follow React best practices
- Include proper error handling
- Write clean, readable code with comments
- Use modern React patterns (hooks, functional components)
- Ensure responsive design
- Include accessibility features

Generate only the requested code without explanations unless specifically asked.`

    let fullPrompt = systemPrompt + '\n\n'
    
    if (context) {
      fullPrompt += `Context: ${context}\n\n`
    }
    
    fullPrompt += `User Request: ${userPrompt}`
    
    return fullPrompt
  }

  // Estimate token count (rough approximation)
  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }

  // Calculate cost based on provider and tokens
  calculateCost(tokens: number): number {
    const costs = {
      gemini: 0.00025, // per 1K tokens (approximate)
      openai: 0.03, // per 1K tokens for GPT-4
      anthropic: 0.015, // per 1K tokens for Claude
    }
    
    return (tokens / 1000) * costs[this.config.provider]
  }
}

// Prompt templates for different types of applications
export const PROMPT_TEMPLATES = {
  component: `Create a React component with the following requirements:
{requirements}

The component should:
- Be a functional component with TypeScript
- Use Tailwind CSS for styling
- Include proper props interface
- Handle loading and error states if applicable
- Be responsive and accessible`,

  page: `Create a Next.js page component with the following requirements:
{requirements}

The page should:
- Use Next.js 15 App Router structure
- Include proper metadata
- Be responsive and accessible
- Use Tailwind CSS for styling
- Include proper TypeScript types`,

  api: `Create a Next.js API route with the following requirements:
{requirements}

The API should:
- Use Next.js 15 App Router API structure
- Include proper error handling
- Validate input data
- Return appropriate HTTP status codes
- Include TypeScript types for request/response`,

  fullApp: `Create a complete Next.js application with the following requirements:
{requirements}

The application should include:
- Proper folder structure
- Multiple pages and components
- API routes if needed
- Database integration with Prisma
- Responsive design with Tailwind CSS
- TypeScript throughout
- Error handling and loading states`,
}

export function formatPromptTemplate(template: string, requirements: string): string {
  return template.replace('{requirements}', requirements)
}