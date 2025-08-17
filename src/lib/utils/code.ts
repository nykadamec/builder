export function extractImports(code: string): string[] {
  const importRegex = /^import\s+.*?from\s+['"]([^'\"]+)['"];?$/gm
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
