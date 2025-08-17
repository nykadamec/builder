export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function getFileType(filename: string): 'component' | 'page' | 'api' | 'style' | 'config' | 'other' {
  const ext = getFileExtension(filename)
  const path = filename.toLowerCase()
  if (path.includes('/api/')) return 'api'
  if ((path.includes('/pages/') || path.includes('/app/')) && (ext === 'tsx' || ext === 'jsx')) return 'page'
  if (ext === 'tsx' || ext === 'jsx') return 'component'
  if (ext === 'css' || ext === 'scss' || ext === 'sass') return 'style'
  if (filename.includes('config') || (ext === 'json' || (ext === 'js' && !path.includes('/src/')))) return 'config'
  return 'other'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
