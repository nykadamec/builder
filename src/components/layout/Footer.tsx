"use client"

import React from 'react'

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 text-xs text-white/60">
      <div className="border-t border-white/10 pt-6 flex items-center justify-between">
        <span>&copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME || 'App'}</span>
        <span className="opacity-80">Postaveno na Next.js & Tailwind CSS</span>
      </div>
    </footer>
  )
}
