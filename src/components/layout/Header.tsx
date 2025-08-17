"use client"

import React, { useEffect, useState } from 'react'
import { Menu, X, Sparkles, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/components/providers/locale-provider'

export type UserSummary = { name?: string | null; plan?: string | null }

export default function Header({ user, variant = 'landing' }: { user?: UserSummary; variant?: 'landing' | 'dashboard' }) {
  const { t, locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)

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
  <header className={isDashboard ? 'border-b bg-white/80 z-40 relative' : 'relative z-40'}>
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-4 sm:px-6">
        <Link href="#" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight">{t('app.brand')}</span>
        </Link>

        {!isDashboard && (
          <nav className="hidden md:flex ml-8 items-center gap-6 text-sm text-white/80">
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

      {/* Mobile overlay + rounded panel */}
      {open && (
        <>
          {/* Backdrop blur overlay (covers whole app except header which has higher z-index) */}
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-20 md:hidden bg-black/20 backdrop-blur-sm" aria-hidden="true" />

          {/* Static (in-flow) full-width mobile panel rendered under the header */}
          <div className={`block md:hidden relative z-30 w-full ${isDashboard ? 'bg-white/95 border-b border-slate-100 text-slate-700' : 'bg-[#05060a]/90 border-b border-white/5 text-white/90'} rounded-b-2xl shadow-xl`}>
            <div className="w-full px-4 py-4 sm:px-6">
              {!isDashboard && (
                <nav className="flex flex-col gap-3 text-sm text-white/90">
                  <a href="#" className="block rounded-md px-3 py-2 hover:bg-white/5">{t('landing.nav.features')}</a>
                  <a href="#" className="block rounded-md px-3 py-2 hover:bg-white/5">{t('landing.nav.pricing')}</a>
                  <a href="#" className="block rounded-md px-3 py-2 hover:bg-white/5">{t('landing.nav.docs')}</a>
                </nav>
              )}

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex gap-2 text-xs">
                  <button onClick={() => { setLocale('cs'); setOpen(false) }} className={`flex-1 rounded px-2 py-2 border ${locale==='cs' ? 'border-white/40 text-white' : 'border-white/10 text-white/70 hover:text-white'}`}>CS</button>
                  <button onClick={() => { setLocale('en'); setOpen(false) }} className={`flex-1 rounded px-2 py-2 border ${locale==='en' ? 'border-white/40 text-white' : 'border-white/10 text-white/70 hover:text-white'}`}>EN</button>
                </div>

                {isDashboard ? (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-700">Vítejte, {user?.name}</div>
                    <Link href="/api/auth/signout" onClick={() => setOpen(false)} className="ml-2">
                      <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900">Odhlásit se</button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setOpen(false)} className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white/90 hover:bg-white/10">{t('landing.nav.signin')}</Link>
                    <Link href="/auth/register" onClick={() => setOpen(false)} className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white/90 hover:bg-white/10">{t('landing.nav.signup')}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
