import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import { appBackground as AppBackground } from "@/components/ui/background";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI App Builder - Vytvářejte aplikace pomocí umělé inteligence",
  description: "Moderní platforma pro vytváření Next.js aplikací pomocí AI. Generujte komponenty, stránky a celé aplikace jednoduše pomocí chatu.",
  keywords: ["AI", "app builder", "Next.js", "React", "TypeScript", "Tailwind CSS", "umělá inteligence", "generování kódu"],
  authors: [{ name: "AI App Builder Team" }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs" className="h-full">
      
      <body
        className={`${inter.className} antialiased h-full text-foreground`}
      >
          <AppBackground />
        <AuthSessionProvider>
          <div className="flex h-full flex-col">
            {children}
          </div>
        </AuthSessionProvider>

      </body>
      
    </html>
  )
}
