'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Play, Download, FileText, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'

interface ProjectFile {
  id: string
  name: string
  path: string
  content: string
  type: string
  createdAt: string
}

interface Project {
  id: string
  name: string
  description: string
  slug: string
  status: 'DRAFT' | 'GENERATED' | 'PUBLISHED'
  template?: string
  config: Record<string, unknown>
  createdAt: string
  updatedAt: string
  files: ProjectFile[]
  _count: {
    files: number
  }
}

const statusLabels = {
  DRAFT: 'Koncept',
  GENERATED: 'Vygenerováno',
  PUBLISHED: 'Publikováno'
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  GENERATED: 'bg-blue-100 text-blue-800',
  PUBLISHED: 'bg-green-100 text-green-800'
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const projectId = params.id as string

  useEffect(() => {
    if (!session) return

    fetchProject()
  }, [session, projectId])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${projectId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Nepodařilo se načíst projekt')
      }

      const data = await response.json()
      setProject(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neočekávaná chyba')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Opravdu chcete smazat tento projekt? Tato akce je nevratná.')) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Nepodařilo se smazat projekt')
      }

      router.push('/dashboard/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neočekávaná chyba')
    } finally {
      setDeleting(false)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Pro zobrazení projektu se musíte přihlásit.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Načítám projekt...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button asChild>
            <Link href="/dashboard/projects">Zpět na projekty</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Projekt nenalezen.</p>
          <Button asChild>
            <Link href="/dashboard/projects">Zpět na projekty</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zpět na projekty
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Upravit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? 'Mazání...' : 'Smazat'}
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{project.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {project.description || 'Bez popisu'}
                  </CardDescription>
                </div>
                <Badge className={statusColors[project.status]}>
                  {statusLabels[project.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Vytvořeno: {format(new Date(project.createdAt), 'dd. MM. yyyy', { locale: cs })}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Aktualizováno: {format(new Date(project.updatedAt), 'dd. MM. yyyy', { locale: cs })}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Souborů: {project._count.files}</span>
                </div>
                {project.template && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Šablona: {project.template}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Files */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Soubory projektu</CardTitle>
              <CardDescription>
                Všechny soubory vygenerované pro tento projekt
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.files.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Zatím nebyly vygenerovány žádné soubory.</p>
                  <Button asChild>
                    <Link href={`/dashboard/projects/${project.id}/generate`}>
                      <Play className="h-4 w-4 mr-2" />
                      Generovat kód
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {project.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{file.path}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{file.type}</Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Akce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.status === 'DRAFT' && (
                <Button className="w-full" asChild>
                  <Link href={`/dashboard/projects/${project.id}/generate`}>
                    <Play className="h-4 w-4 mr-2" />
                    Generovat kód
                  </Link>
                </Button>
              )}
              
              {project.status === 'GENERATED' && (
                <>
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/projects/${project.id}/preview`}>
                      <Play className="h-4 w-4 mr-2" />
                      Náhled
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Stáhnout
                  </Button>
                </>
              )}
              
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/projects/${project.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Upravit projekt
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Project Config */}
          {project.config && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Konfigurace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {Object.entries(project.config).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}