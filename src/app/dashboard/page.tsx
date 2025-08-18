'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Code, Zap, Users } from "lucide-react"
import Link from "next/link"
import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

function DashboardContent() {
  const { user } = useAuth()

  if (!user) {
    return null; // This shouldn't happen due to ProtectedRoute, but TypeScript safety
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header variant="dashboard" user={{ name: user.name, plan: 'FREE' }} />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Volání</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                z 10 měsíčně (FREE plán)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projekty</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                z 3 celkem (FREE plán)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exporty</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                z 5 měsíčně (FREE plán)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Nový Projekt</span>
              </CardTitle>
              <CardDescription>
                Vytvořte nový projekt pomocí AI generátoru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/projects/new">
                <Button className="w-full">Začít nový projekt</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Moje Projekty</span>
              </CardTitle>
              <CardDescription>Spravujte a upravujte své existující projekty</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/projects">
                <Button variant="outline" className="w-full">Zobrazit projekty</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Nedávná aktivita</CardTitle>
            <CardDescription>Přehled vašich posledních akcí</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Zatím žádná aktivita</p>
              <p className="text-sm">Vytvořte svůj první projekt a začněte kódovat!</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}