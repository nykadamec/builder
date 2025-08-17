"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewProjectPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError("")

    try {
      // Create project
      const projectResponse = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description,
        }),
      })

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json()
        throw new Error(errorData.error || "Chyba při vytváření projektu")
      }

      const project = await projectResponse.json()

      // Generate initial code
      const generateResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Vytvořte základní Next.js aplikaci s názvem "${projectName}". Popis: ${description}`,
          type: "app",
          projectId: project.id,
        }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(errorData.error || "Chyba při generování kódu")
      }

      // Redirect to project detail
      router.push(`/dashboard/projects/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neočekávaná chyba")
    } finally {
      setIsGenerating(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Přihlášení vyžadováno</h1>
          <Link href="/api/auth/signin">
            <Button>Přihlásit se</Button>
          </Link>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-slate-900">Nový Projekt</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              {session.user.plan}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <span>Vytvořte nový projekt s AI</span>
            </CardTitle>
            <CardDescription>
              Popište svou aplikaci a AI vygeneruje základní kód pro vás
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                  Název projektu
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Můj úžasný projekt"
                  required
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Popis aplikace
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Popište, jakou aplikaci chcete vytvořit. Například: 'E-commerce aplikace pro prodej knih s košíkem, uživatelskými účty a platbami.'"
                  required
                  disabled={isGenerating}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Link href="/dashboard">
                  <Button type="button" variant="outline" disabled={isGenerating}>
                    Zrušit
                  </Button>
                </Link>
                <Button type="submit" disabled={isGenerating || !projectName.trim() || !description.trim()}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generuji projekt...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Vytvořit projekt
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Usage Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Informace o využití</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">AI Volání</div>
                <div className="text-gray-600">
                  {session.user.usage?.aiCallsUsed || 0} / {session.user.plan === 'FREE' ? '10' : session.user.plan === 'PRO' ? '1000' : '∞'}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Projekty</div>
                <div className="text-gray-600">
                  {session.user.usage?.projectsUsed || 0} / {session.user.plan === 'FREE' ? '3' : session.user.plan === 'PRO' ? '50' : '∞'}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Plán</div>
                <div className="text-gray-600">{session.user.plan}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}