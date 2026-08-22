import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type NimTheme = 'ledger' | 'vlora'
export type NimScheme = 'dark' | 'light'
export type NimDirection = 'ltr' | 'rtl'

interface NimContextValue {
  direction: NimDirection
  scheme: NimScheme
  setScheme: (scheme: NimScheme) => void
  setTheme: (theme: NimTheme) => void
  theme: NimTheme
}

const NimContext = createContext<NimContextValue | null>(null)

export interface NimProviderProps {
  children: ReactNode
  className?: string
  defaultScheme?: NimScheme
  defaultTheme?: NimTheme
  direction?: NimDirection
  /** Writes the theme attributes onto <html> as well, so portalled surfaces
      (sheets, toasts) inherit them outside the React tree. */
  syncDocument?: boolean
}

export function NimProvider({
  children,
  className,
  defaultScheme = 'light',
  defaultTheme = 'ledger',
  direction = 'ltr',
  syncDocument = true,
}: NimProviderProps) {
  const [theme, setTheme] = useState<NimTheme>(defaultTheme)
  const [scheme, setScheme] = useState<NimScheme>(defaultScheme)

  useEffect(() => {
    if (!syncDocument || typeof document === 'undefined') return
    const root = document.documentElement
    root.dataset.nimTheme = theme
    root.dataset.nimScheme = scheme
    root.dir = direction
  }, [direction, scheme, syncDocument, theme])

  const value = useMemo(
    () => ({ direction, scheme, setScheme, setTheme, theme }),
    [direction, scheme, theme],
  )

  return (
    <NimContext.Provider value={value}>
      <div className={cn('nim-root', className)} data-nim-scheme={scheme} data-nim-theme={theme} dir={direction}>
        {children}
      </div>
    </NimContext.Provider>
  )
}

export function useNim() {
  const context = useContext(NimContext)
  if (!context) throw new Error('useNim must be used inside <NimProvider>')
  return context
}

/** Convenience for a header toggle: flips light ⇄ dark. */
export function useSchemeToggle() {
  const { scheme, setScheme } = useNim()
  return useCallback(() => setScheme(scheme === 'dark' ? 'light' : 'dark'), [scheme, setScheme])
}
