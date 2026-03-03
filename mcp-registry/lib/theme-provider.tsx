'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext<{
  isDark: boolean
  toggle: () => void
}>({
  isDark: false,
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check localStorage on mount
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(saved ? saved === 'dark' : prefersDark)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark, mounted])

  const toggle = () => setIsDark(!isDark)

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
