"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from "react"
import en from "@/locales/en.json"
import cs from "@/locales/cs.json"

type Locale = "cs" | "en"
type Dict = Record<string, any>

const dictionaries: Record<Locale, Dict> = { en, cs }

function getFromPath(obj: Dict, path: string) {
  return path.split(".").reduce<any>((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

function format(template: string, vars?: Record<string, string | number>) {
  if (!template || !vars) return template
  return template.replace(/\{(.*?)\}/g, (_, k) => String(vars[k] ?? `{${k}}`))
}

export interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale, options?: { persist?: boolean }) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within LocaleProvider")
  return ctx
}

export function LocaleProvider({ children, initialLocale = "cs" as Locale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, _setLocale] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale, options?: { persist?: boolean }) => {
    _setLocale(next)
    if (options?.persist !== false) {
      // Persist to cookie for server components to read next load
      try {
        document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
        // Update html lang immediately for accessibility
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("lang", next)
        }
      } catch {}
    }
  }, [])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = dictionaries[locale] ?? dictionaries.cs
      const raw = getFromPath(dict, key) ?? key
      return typeof raw === "string" ? format(raw, vars) : key
    },
    [locale]
  )

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
