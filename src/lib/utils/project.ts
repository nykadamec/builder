export function generateProjectSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) return { valid: false, error: 'Project name is required' }
  if (name.length < 3) return { valid: false, error: 'Project name must be at least 3 characters long' }
  if (name.length > 50) return { valid: false, error: 'Project name must be less than 50 characters' }
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) return { valid: false, error: 'Project name can only contain letters, numbers, spaces, hyphens, and underscores' }
  return { valid: true }
}
