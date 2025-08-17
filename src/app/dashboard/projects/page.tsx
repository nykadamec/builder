import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Code, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { cs } from "date-fns/locale"

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  // Fetch user's projects
  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      _count: {
        select: {
          files: true,
        },
      },
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Aktivní'
      case 'DRAFT':
        return 'Koncept'
      case 'ARCHIVED':
        return 'Archivováno'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zpět na dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">Moje Projekty</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-xs">
                {session.user.plan}
              </Badge>
              <Link href="/dashboard/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nový projekt
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Code className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <CardTitle className="mb-2">Zatím žádné projekty</CardTitle>
              <CardDescription className="mb-6">
                Vytvořte svůj první projekt pomocí AI generátoru
              </CardDescription>
              <Link href="/dashboard/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Vytvořit první projekt
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Badge className={`ml-2 ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Code className="h-4 w-4" />
                        <span>{project._count.files} souborů</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(project.updatedAt), {
                            addSuffix: true,
                            locale: cs,
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Otevřít
                        </Button>
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}/edit`} className="flex-1">
                        <Button size="sm" className="w-full">
                          Upravit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Usage Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Přehled využití</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
                <div className="text-sm text-gray-600">Celkem projektů</div>
              </div>
              <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                  {projects.filter(p => p.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-600">Aktivních projektů</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {projects.reduce((sum, p) => sum + p._count.files, 0)}
                </div>
                <div className="text-sm text-gray-600">Celkem souborů</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}