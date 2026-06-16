'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type ThemeContextType = {
  darkMode: boolean
  toggleTheme: () => void
  bg: string
  text: string
  subText: string
  cardBg: string
  cardBorder: string
  inputBg: string
  inputBorder: string
  tableHeader: string
  tableBorder: string
  primary: string
  danger: string
  success: string
  warning: string
  badgeBg: string
}

const ThemeCtx = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true)

  const toggleTheme = () => setDarkMode(prev => !prev)

  // Update HTML background when theme changes
  useEffect(() => {
    document.documentElement.style.background = darkMode ? '#0a0a0a' : '#f5f5f5'
    document.body.style.background = darkMode ? '#0a0a0a' : '#f5f5f5'
  }, [darkMode])

  const value: ThemeContextType = {
    darkMode,
    toggleTheme,
    bg: darkMode ? '#0a0a0a' : '#f5f5f5',
    text: darkMode ? '#ffffff' : '#0a0a0a',
    subText: darkMode ? '#a0a0a0' : '#666666',
    cardBg: darkMode ? '#1a1a1a' : '#ffffff',
    cardBorder: darkMode ? '#333333' : '#e5e5e5',
    inputBg: darkMode ? '#222222' : '#ffffff',
    inputBorder: darkMode ? '#444444' : '#d1d5db',
    tableHeader: darkMode ? '#1a1a1a' : '#f9fafb',
    tableBorder: darkMode ? '#333333' : '#e5e5e5',
    primary: '#2563EB',
    danger: '#DC2626',
    success: '#059669',
    warning: '#F59E0B',
    badgeBg: darkMode ? '#333333' : '#f3f4f6',
  }

  return React.createElement(ThemeCtx.Provider, { value }, children)
}

export function useTheme() {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}