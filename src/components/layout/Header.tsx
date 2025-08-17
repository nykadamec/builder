"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Menu, X, Sparkles, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/components/providers/locale-provider'
import { useElementSize } from '@/lib/useElementSize'
import { MobileMenuPanel } from './MobileMenuPanel'
import { UserSummary } from '@/types/user'
import { AnimatePresence, motion } from 'framer-motion'

export default function Header({ user, variant = 'landing' }: { user?: UserSummary; variant?: 'landing' | 'dashboard' }) {
  const { t, locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const headerEl = useRef<HTMLElement | null>(null)
  const { ref: sizeRef, size } = useElementSize<HTMLElement>()

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // note: keep body scroll enabled for static mobile panel

  const isDashboard = variant === 'dashboard'

  return (
    <>
  <header ref={(el) => { headerEl.current = el; (sizeRef as any).current = el }} className={isDashboard ? 'border-b bg-white/80 z-50 relative' : 'relative z-50'}>
        <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-4 sm:px-6">
        <Link href="#" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight">{t('app.brand')}</span>
        </Link>

        {!isDashboard && (
          <nav className="hidden md:flex ml-8 items-center gap-6 text-sm text-white/80">
            <Link href="/builder" className="hover:text-white">{t('landing.nav.builder')}</Link>
            <a href="#" className="hover:text-white">{t('landing.nav.features')}</a>
            <a href="#" className="hover:text-white">{t('landing.nav.pricing')}</a>
            <a href="#" className="hover:text-white">{t('landing.nav.docs')}</a>
          </nav>
        )}

        <div className="ml-auto hidden md:flex gap-2 items-center">
          <div className="flex items-center gap-1 mr-2 text-xs">
            <button onClick={() => setLocale('cs')} className={`rounded px-2 py-1 border ${locale==='cs' ? 'border-white/40 text-white' : 'border-white/10 text-white/70 hover:text-white'}`}>CS</button>
            <button onClick={() => setLocale('en')} className={`rounded px-2 py-1 border ${locale==='en' ? 'border-white/40 text-white' : 'border-white/10 text-white/70 hover:text-white'}`}>EN</button>
          </div>

          {isDashboard ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">Vítejte, {user?.name}</div>
              <Link href="/api/auth/signout">
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-900">Odhlásit se</button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
                <LogIn className="h-4 w-4" /> {t('landing.nav.signin')}
              </Link>
              <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
                <UserPlus className="h-4 w-4" /> {t('landing.nav.signup')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(s => !s)}
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-white/90 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        </div>
      </header>

      {/* Mobile overlay + panel (outside header). No blur; panel exactly below header. */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 md:hidden bg-black/20"
              aria-hidden="true"
            />

            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed md:hidden z-40 inset-x-0"
              style={{ top: size.height || 0 }}
            >
              <MobileMenuPanel
                isDashboard={isDashboard}
                locale={locale}
                setLocale={(l) => setLocale(l)}
                t={t}
                userName={user?.name ?? null}
                onClose={() => setOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
