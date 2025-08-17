"use client"

import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export type Size = { width: number; height: number }

/**
 * useElementSize - returns a ref to assign to any element and its live size.
 * Uses ResizeObserver when available, falls back to client rect on mount.
 */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setSize({ width: rect.width, height: rect.height })
  }, [])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    // Initial measure
    measure()
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => measure())
      ro.observe(el)
      return () => ro.disconnect()
    }
  }, [measure])

  return { ref, size } as const
}
