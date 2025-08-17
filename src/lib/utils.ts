import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// File system utilities
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function getFileType(filename: string): 'component' | 'page' | 'api' | 'style' | 'config' | 'other' {
  const ext = getFileExtension(filename)
  const path = filename.toLowerCase()
  
  if (path.includes('/api/')) return 'api'
  if (path.includes('/pages/') || path.includes('/app/') && (ext === 'tsx' || ext === 'jsx')) return 'page'
  if (ext === 'tsx' || ext === 'jsx') return 'component'
  if (ext === 'css' || ext === 'scss' || ext === 'sass') return 'style'
  if (filename.includes('config') || ext === 'json' || ext === 'js' && !path.includes('/src/')) return 'config'
  
  return 'other'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Project utilities
export function generateProjectSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Project name is required' }
  }
  
  if (name.length < 3) {
    return { valid: false, error: 'Project name must be at least 3 characters long' }
  }
  
  if (name.length > 50) {
    return { valid: false, error: 'Project name must be less than 50 characters' }
  }
  
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
    return { valid: false, error: 'Project name can only contain letters, numbers, spaces, hyphens, and underscores' }
  }
  
  return { valid: true }
}

// File tree utilities
export interface FileTreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileTreeNode[]
  size?: number
  content?: string
}

export function buildFileTree(files: { path: string; content: string }[]): FileTreeNode[] {
  const root: FileTreeNode[] = []
  const pathMap = new Map<string, FileTreeNode>()
  
  // Sort files by path to ensure proper tree structure
  const sortedFiles = files.sort((a, b) => a.path.localeCompare(b.path))
  
  for (const file of sortedFiles) {
    const pathParts = file.path.split('/')
    let currentPath = ''
    let currentLevel = root
    
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i]
      currentPath = currentPath ? `${currentPath}/${part}` : part
      
      let node = pathMap.get(currentPath)
      
      if (!node) {
        const isFile = i === pathParts.length - 1
        node = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          size: isFile ? file.content.length : undefined,
          content: isFile ? file.content : undefined,
        }
        
        pathMap.set(currentPath, node)
        currentLevel.push(node)
      }
      
      if (node.children) {
        currentLevel = node.children
      }
    }
  }
  
  return root
}

// Code generation utilities
export function extractImports(code: string): string[] {
  const importRegex = /^import\s+.*?from\s+['"]([^'"]+)['"];?$/gm
  const imports: string[] = []
  let match
  
  while ((match = importRegex.exec(code)) !== null) {
    imports.push(match[1])
  }
  
  return imports
}

export function extractExports(code: string): string[] {
  const exportRegex = /^export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/gm
  const exports: string[] = []
  let match
  
  while ((match = exportRegex.exec(code)) !== null) {
    exports.push(match[1])
  }
  
  return exports
}

// Date utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'právě teď'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `před ${diffInMinutes} min`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `před ${diffInHours} h`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `před ${diffInDays} dny`
  }
  
  return formatDate(date)
}

// Usage tracking utilities
export function isUsageLimitReached(used: number, limit: number): boolean {
  return limit !== -1 && used >= limit
}

export function getUsagePercentage(used: number, limit: number): number {
  if (limit === -1) return 0 // unlimited
  return Math.min((used / limit) * 100, 100)
}

export function shouldResetUsage(lastReset: Date): boolean {
  const now = new Date()
  const resetDate = new Date(lastReset)
  resetDate.setMonth(resetDate.getMonth() + 1)
  
  return now >= resetDate
}

// Error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleApiError(error: unknown): { message: string; code: string; statusCode: number } {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    }
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  }
}