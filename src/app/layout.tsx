import type { Metadata } from "next"
import { cookies } from "next/headers"
import en from "@/locales/en.json"
import cs from "@/locales/cs.json"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import { LocaleProvider } from "@/components/providers/locale-provider"
import { appBackground as AppBackground } from "@/components/ui/background";

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const locale = ((cookieStore as any).get?.('locale')?.value as 'cs' | 'en') || 'cs'
  const dict = locale === 'en' ? en : cs
  return {
    title: dict.app.title,
    description: dict.app.description,
    keywords: dict.app.keywords,
    authors: [{ name: "AI App Builder Team" }],
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const locale = ((cookieStore as any).get?.('locale')?.value as 'cs' | 'en') || 'cs'
  return (
    <html lang={locale} className="h-full">
      <head>
        {/* viewport meta managed by Next - keep the exported viewport object in this file */}
      </head>
      <body
        className={`${inter.className} antialiased min-h-screen text-foreground bg-transparent`}
      >
          <AppBackground />
        <AuthSessionProvider>
          <LocaleProvider initialLocale={locale}>
            <div className="flex min-h-screen flex-col">
              {/* content wrapper: ensures padding on small screens and centered max width on larger screens */}
              <div className="w-full flex-1">
                <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                  {children}
                </main>
              </div>
            </div>
          </LocaleProvider>
        </AuthSessionProvider>

      </body>
    </html>
  )
}
