import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, CreditCard, Settings, Shield } from 'lucide-react'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { usage: true }
  })

  if (!user) {
    redirect('/api/auth/signin')
  }

  const planLimitsMap = {
    FREE: { aiCallsPerMonth: 10, maxProjects: 3, exportsPerMonth: 5 },
    PRO: { aiCallsPerMonth: 500, maxProjects: 50, exportsPerMonth: 100 },
    ENTERPRISE: { aiCallsPerMonth: -1, maxProjects: -1, exportsPerMonth: -1 }
  } as const
  
  const planLimits = planLimitsMap[user.plan as keyof typeof planLimitsMap]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nastavení</h1>
        <p className="text-muted-foreground mt-2">
          Spravujte svůj účet a předplatné
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
            <CardDescription>
              Informace o vašem účtu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Jméno</label>
              <p className="text-sm text-muted-foreground">{user.name || 'Nenastaveno'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Registrace</label>
              <p className="text-sm text-muted-foreground">
                {format(user.createdAt, 'dd. MMMM yyyy', { locale: cs })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Předplatné */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Předplatné
            </CardTitle>
            <CardDescription>
              Váš aktuální plán a využití
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Aktuální plán</span>
              <Badge variant={user.plan === 'FREE' ? 'secondary' : user.plan === 'PRO' ? 'default' : 'destructive'}>
                {user.plan}
              </Badge>
            </div>
            
            {user.usage && (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>AI volání</span>
                    <span>
                      {user.usage.aiCallsUsed} / {planLimits.aiCallsPerMonth === -1 ? '∞' : planLimits.aiCallsPerMonth}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: planLimits.aiCallsPerMonth === -1 ? '0%' : 
                               `${Math.min((user.usage.aiCallsUsed / planLimits.aiCallsPerMonth) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Projekty</span>
                    <span>
                      {user.usage.projectsUsed} / {planLimits.maxProjects === -1 ? '∞' : planLimits.maxProjects}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: planLimits.maxProjects === -1 ? '0%' : 
                               `${Math.min((user.usage.projectsUsed / planLimits.maxProjects) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Exporty</span>
                    <span>
                      {user.usage.exportsUsed} / {planLimits.exportsPerMonth === -1 ? '∞' : planLimits.exportsPerMonth}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: planLimits.exportsPerMonth === -1 ? '0%' : 
                               `${Math.min((user.usage.exportsUsed / planLimits.exportsPerMonth) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Reset využití</label>
                  <p className="text-sm text-muted-foreground">
                    {format(user.usage.usageResetDate, 'dd. MMMM yyyy', { locale: cs })}
                  </p>
                </div>
              </>
            )}
            
            {user.plan === 'FREE' && (
              <Button className="w-full" variant="default">
                Upgradovat na PRO
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Bezpečnost */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Bezpečnost
            </CardTitle>
            <CardDescription>
              Nastavení zabezpečení účtu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Změnit heslo
            </Button>
            <Button variant="outline" className="w-full">
              Dvoufaktorové ověření
            </Button>
          </CardContent>
        </Card>

        {/* Obecné nastavení */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Obecné
            </CardTitle>
            <CardDescription>
              Obecná nastavení aplikace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Exportovat data
            </Button>
            <Button variant="destructive" className="w-full">
              Smazat účet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}