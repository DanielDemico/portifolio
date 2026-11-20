import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'pf-theme'
const DEFAULT_THEME: Theme = 'light' // padrão do projeto: claro
const THEME_COLOR: Record<Theme, string> = { light: '#F7F5FB', dark: '#0F0B1A' }

type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void; toggleTheme: () => void }

const ThemeContext = createContext<ThemeContextValue | null>(null)

function initialTheme(): Theme {
  const saved = readStorage(STORAGE_KEY)
  return saved === 'dark' || saved === 'light' ? saved : DEFAULT_THEME
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    writeStorage(STORAGE_KEY, next)
  }, [])

  const toggleTheme = useCallback(() => setTheme(theme === 'light' ? 'dark' : 'light'), [theme, setTheme])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
