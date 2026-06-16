'use client'

import Link from 'next/link'
import { useTheme } from '@/lib/theme'

export default function Homepage() {
  const theme = useTheme()

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui',
      transition: 'all 0.3s ease',
      position: 'relative'
    }}>
      {/* Theme Toggle */}
      <div style={{ position: 'absolute', top: 30, right: 30 }}>
        <button onClick={theme.toggleTheme}
          style={{
            width: 56, height: 28, borderRadius: 14,
            background: theme.darkMode ? '#333' : '#e5e5e5',
            border: 'none', cursor: 'pointer', position: 'relative',
            transition: 'all 0.3s ease', padding: 0,
          }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: theme.darkMode ? '#fff' : '#0a0a0a',
            position: 'absolute', top: 3,
            left: theme.darkMode ? '4px' : '30px',
            transition: 'all 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
          }}>
            {theme.darkMode ? '🌙' : '☀️'}
          </div>
        </button>
      </div>

      <div style={{ textAlign: 'center', padding: 40 }}>
        {/* Logo */}
        <div style={{
          width: 120, height: 120, background: theme.cardBg,
          borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 30px', border: `1px solid ${theme.cardBorder}`, transition: 'all 0.3s ease'
        }}>
          <span style={{ fontSize: 60 }}>📦</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 52, fontWeight: 800, color: theme.text, marginBottom: 10,
          letterSpacing: '-1px', transition: 'all 0.3s ease'
        }}>
          StockFlow
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: 20, color: theme.subText, marginBottom: 50, fontWeight: 300, transition: 'all 0.3s ease'
        }}>
          Smart Inventory, Simple Management
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth"
            style={{
              padding: '16px 40px',
              background: theme.darkMode ? '#ffffff' : '#0a0a0a',
              color: theme.darkMode ? '#0a0a0a' : '#ffffff',
              borderRadius: 12, fontSize: 18, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.3s ease',
            }}>
            🔐 Admin Panel
          </Link>
          <Link href="/customer"
            style={{
              padding: '16px 40px',
              background: theme.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: theme.text, borderRadius: 12, fontSize: 18, fontWeight: 600,
              textDecoration: 'none',
              border: `2px solid ${theme.darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
              transition: 'all 0.3s ease'
            }}>
            🛒 Customer Store
          </Link>
        </div>
      </div>
    </div>
  )
}