"use client"

import Link from 'next/link'
import React from 'react'

export function MobileMenuPanel({
  isDashboard,
  locale,
  setLocale,
  t,
  onClose,
  userName,
  className = '',
}: {
  isDashboard: boolean
  locale: string
  setLocale: (loc: 'cs' | 'en') => void
  t: (key: string) => string
  onClose: () => void
  userName?: string | null
  className?: string
}) {
  return (
    <div
      className={`w-full ${
        isDashboard
          ? 'bg-white/95 border-b border-slate-100 text-slate-700'
          : 'bg-[#05060a]/90 border-b border-white/5 text-white/90'
      } rounded-b-2xl shadow-xl ${className}`}
    >
      <div className="w-full px-4 py-4 sm:px-6">
        {!isDashboard && (
          <nav className="flex flex-col gap-3 text-sm text-white/90">
            <Link href="/builder" onClick={onClose} className="block rounded-md px-3 py-2 hover:bg-white/5">{t('landing.nav.builder')}</Link>
            <a href="#" className="block rounded-md px-3 py-2 hover:bg-white/5">{t('landing.nav.features')}</a>
            <a href="#" className="block rounded-md px-3 py-2 hover:bg-white/5">{t('landing.nav.pricing')}</a>
            <a href="#" className="block rounded-md px-3 py-2 hover:bg-white/5">{t('landing.nav.docs')}</a>
          </nav>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => {
                setLocale('cs')
                onClose()
              }}
              className={`flex-1 rounded px-2 py-2 border ${
                locale === 'cs'
                  ? 'border-white/40 text-white'
                  : 'border-white/10 text-white/70 hover:text-white'
              }`}
            >
              CS
            </button>
            <button
              onClick={() => {
                setLocale('en')
                onClose()
              }}
              className={`flex-1 rounded px-2 py-2 border ${
                locale === 'en'
                  ? 'border-white/40 text-white'
                  : 'border-white/10 text-white/70 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

      {isDashboard ? (
            <div className="flex items-center justify-between">
        <div className="text-sm text-slate-700">Vítejte{userName ? `, ${userName}` : ''}</div>
              <Link href="/api/auth/signout" onClick={onClose} className="ml-2">
                <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                  Odhlásit se
                </button>
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={onClose}
                className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                {t('landing.nav.signin')}
              </Link>
              <Link
                href="/auth/register"
                onClick={onClose}
                className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                {t('landing.nav.signup')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
