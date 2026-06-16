'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme'

export default function AuthPage() {
  const theme = useTheme()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin 
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (res.ok) {
        sessionStorage.setItem('user', JSON.stringify(data.user))
        if (data.user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/customer')
        }
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to connect')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: theme.bg, fontFamily: 'system-ui', transition: 'all 0.3s ease', position: 'relative'
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

      <div style={{
        background: theme.cardBg, padding: 40, borderRadius: 16, width: '100%', maxWidth: 400,
        border: `1px solid ${theme.cardBorder}`, transition: 'all 0.3s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 5, color: theme.text }}>📦 StockFlow</h1>
          <p style={{ color: theme.subText, fontSize: 14 }}>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="Full Name" required
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: 12, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 8, marginBottom: 15, fontSize: 14, boxSizing: 'border-box' }} />
          )}
          <input type="email" placeholder="Email address" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: 12, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 8, marginBottom: 15, fontSize: 14, boxSizing: 'border-box' }} />
          <input type="password" placeholder="Password" required
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: 12, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 8, marginBottom: 20, fontSize: 14, boxSizing: 'border-box' }} />
          <button type="submit"
            style={{ width: '100%', padding: 12, background: theme.primary, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 600, marginBottom: 15 }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 14, color: theme.subText }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError('') }}
            style={{ background: 'none', border: 'none', color: theme.primary, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <div style={{ marginTop: 20, padding: 15, background: theme.tableHeader, borderRadius: 8, fontSize: 12, color: theme.subText, textAlign: 'center' }}>
          <div style={{ fontWeight: 600, marginBottom: 5 }}>Demo Credentials:</div>
          <div>Admin: admin@stockflow.com / admin123</div>
          <div>Customer: customer@demo.com / demo123</div>
        </div>
      </div>
    </div>
  )
}