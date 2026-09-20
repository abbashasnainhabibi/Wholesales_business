'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void; ready: boolean }

const ThemeContext = createContext<ThemeContextValue | null>(null)
const THEME_KEY = 'supplybase-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<Theme>('light')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.removeItem(THEME_KEY)
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
    } catch {}
    setReady(true)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {}, toggleTheme: () => {}, ready }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) return { theme: 'light' as Theme, setTheme: () => {}, toggleTheme: () => {}, ready: true }
  return value
}
