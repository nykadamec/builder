'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface Project {
  id: string
  name: string
  description: string
  status: 'DRAFT' | 'GENERATED' | 'PUBLISHED'
}

interface GenerateResponse {
  success: boolean
  generatedCode: string
  tokensUsed: number
  aiCallsRemaining: number
}

const availableFeatures = [
  { id: 'authentication', label: 'Autentifikace uživatelů', description: 'Přihlášení, registrace, správa uživatelů' },
  { id: 'database', label: 'Databázové operace', description: 'CRUD operace, modely, migrace' },
  { id: 'api', label: 'REST API', description: 'API endpointy, validace, error handling' },
  { id: 'ui-components', label: 'UI komponenty', description: 'Formuláře, tabulky, modály' },
  { id: 'routing', label: 'Routing', description: 'Navigace, protected routes' },
  { id: 'state-management', label: 'State management', description: 'Globální stav, context' },
  { id: 'file-upload', label: 'Upload souborů', description: 'Nahrávání a správa souborů' },
  { id: 'search', label: 'Vyhledávání', description: 'Fulltextové vyhledávání, filtry' },
  { id: 'notifications', label: 'Notifikace', description: 'Toast zprávy, email notifikace' },
  { id: 'analytics', label: 'Analytika', description: 'Tracking, metriky, reporty' }
]

export default function GenerateCodePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Form state
  const [prompt, setPrompt] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [framework, setFramework] = useState('nextjs')
  
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
      
      // Pre-fill prompt with project info
      if (data.description) {
        setPrompt(`Vytvořte ${framework} aplikaci pro: ${data.description}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neočekávaná chyba')
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Prosím zadejte popis toho, co chcete vytvořit')
      return
    }

    try {
      setGenerating(true)
      setError(null)
      
      const response = await fetch(`/api/projects/${projectId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          framework,
          features: selectedFeatures
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Nepodařilo se vygenerovat kód')
      }

      const data: GenerateResponse = await response.json()
      
      if (data.success) {
        setSuccess(true)
        // Redirect to project detail after 2 seconds
        setTimeout(() => {
          router.push(`/dashboard/projects/${projectId}`)
        }, 2000)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Neočekávaná chyba')
    } finally {
      setGenerating(false)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Pro generování kódu se musíte přihlásit.</p>
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

  if (error && !project) {
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

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Kód byl úspěšně vygenerován!</h1>
          <p className="text-muted-foreground mb-6">Přesměrováváme vás na detail projektu...</p>
          <Button asChild>
            <Link href={`/dashboard/projects/${projectId}`}>Zobrazit projekt</Link>
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
            <Link href={`/dashboard/projects/${projectId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zpět na projekt
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Generování kódu pomocí AI</h1>
          <p className="text-muted-foreground">
            Popište, co chcete vytvořit, a naše AI vygeneruje kvalitní kód pro váš projekt
          </p>
          {project && (
            <Badge variant="outline" className="mt-2">
              Projekt: {project.name}
            </Badge>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Prompt */}
            <Card>
              <CardHeader>
                <CardTitle>Popis aplikace</CardTitle>
                <CardDescription>
                  Detailně popište, co chcete vytvořit. Čím více informací poskytnete, tím lepší bude výsledek.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Co chcete vytvořit?</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Například: Vytvořte e-commerce aplikaci pro prodej knih s košíkem, platbami a správou objednávek..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={6}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Funkce k implementaci</CardTitle>
                <CardDescription>
                  Vyberte funkce, které chcete zahrnout do vaší aplikace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {availableFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={feature.id}
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={feature.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {feature.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Info */}
            <Card>
              <CardHeader>
                <CardTitle>Využití AI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plán:</span>
                    <Badge variant="outline">{session.user?.plan || 'FREE'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AI volání:</span>
                    <span>{session.user?.usage?.aiCallsUsed || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card>
              <CardHeader>
                <CardTitle>Generování</CardTitle>
                <CardDescription>
                  Klikněte pro spuštění AI generování kódu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleGenerate} 
                  disabled={generating || !prompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generuji kód...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generovat kód
                    </>
                  )}
                </Button>
                
                {generating && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Toto může trvat několik minut...
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tipy pro lepší výsledky</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Buďte konkrétní v popisu</li>
                  <li>• Uveďte cílovou skupinu uživatelů</li>
                  <li>• Popište hlavní funkce aplikace</li>
                  <li>• Zmíňte požadované technologie</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}