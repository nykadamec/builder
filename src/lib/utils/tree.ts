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
      if (node.children) currentLevel = node.children
    }
  }
  return root
}
