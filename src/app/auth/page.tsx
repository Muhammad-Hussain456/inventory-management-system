'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
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
        // Store user in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.user))
        
        if (data.user.role === 'admin') {
          router.push('/stock')
        } else {
          router.push('/')
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: 'system-ui'
    }}>
      <div style={{
        background: 'white', padding: 40, borderRadius: 16, width: '100%', maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 5 }}>📦 StockFlow</h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>
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
            <input
              type="text" placeholder="Full Name" required
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: 12, border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 15, fontSize: 14, boxSizing: 'border-box' }}
            />
          )}
          <input
            type="email" placeholder="Email address" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: 12, border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 15, fontSize: 14, boxSizing: 'border-box' }}
          />
          <input
            type="password" placeholder="Password" required
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: 12, border: '1px solid #E5E7EB', borderRadius: 8, marginBottom: 20, fontSize: 14, boxSizing: 'border-box' }}
          />
          <button type="submit"
            style={{
              width: '100%', padding: 12, background: '#2563EB', color: 'white', border: 'none',
              borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 600, marginBottom: 15
            }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 14, color: '#6B7280' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <div style={{ marginTop: 20, padding: 15, background: '#F9FAFB', borderRadius: 8, fontSize: 12, color: '#6B7280' }}>
          <div style={{ fontWeight: 600, marginBottom: 5 }}>Demo Credentials:</div>
          <div>Admin: admin@stockflow.com / admin123</div>
        </div>
      </div>
    </div>
  )
}