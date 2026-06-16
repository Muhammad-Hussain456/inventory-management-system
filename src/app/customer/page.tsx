'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/lib/theme'

export default function CustomerDashboard() {
  const theme = useTheme()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('stock')
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('customer')
    if (stored) setUser(JSON.parse(stored))
    loadProducts()
  }, [])

  useEffect(() => {
    if (user) loadPurchases()
  }, [user])

  const loadProducts = () => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
  }

  const loadPurchases = () => {
    fetch('/api/order')
      .then(res => res.json())
      .then(data => setPurchases(Array.isArray(data) ? data : []))
  }

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/auth/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      const data = await res.json()
      if (res.ok && data.user) {
        sessionStorage.setItem('customer', JSON.stringify(data.user))
        setUser(data.user)
        setShowLogin(false)
        setLoginForm({ email: '', password: '' })
      } else {
        setLoginError(data.error || 'Login failed')
      }
    } catch {
      setLoginError('Connection failed')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('customer')
    setUser(null)
    setPurchases([])
    setActiveTab('stock')
  }

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      if (existing.orderQty >= product.quantity) return
      setCart(cart.map(i => i.id === product.id ? { ...i, orderQty: i.orderQty + 1 } : i))
    } else {
      setCart([...cart, { ...product, orderQty: 1 }])
    }
  }

  const removeFromCart = (id: number) => {
    const item = cart.find(i => i.id === id)
    if (item.orderQty === 1) setCart(cart.filter(i => i.id !== id))
    else setCart(cart.map(i => i.id === id ? { ...i, orderQty: i.orderQty - 1 } : i))
  }

  const placeOrder = async () => {
    if (!user) { setShowLogin(true); return }
    if (cart.length === 0) return
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, customer: user.name })
    })
    if (res.ok) {
      const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.orderQty, 0)
      setMessage(`✅ Order placed! Total: $${total.toFixed(2)}`)
      setCart([])
      loadProducts()
      loadPurchases()
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.orderQty, 0)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20, fontFamily: 'system-ui', background: theme.bg, minHeight: '100vh', color: theme.text, transition: 'all 0.3s ease' }}>
      {/* Theme Toggle */}
      <button onClick={theme.toggleTheme}
        style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 100, width: 48, height: 24, borderRadius: 12, background: theme.darkMode ? '#333' : '#e5e5e5', border: 'none', cursor: 'pointer', padding: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: theme.darkMode ? '#fff' : '#0a0a0a', margin: 3, transition: 'all 0.3s ease', marginLeft: theme.darkMode ? '4px' : '26px', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {theme.darkMode ? '🌙' : '☀️'}
        </div>
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>🛒 Customer Store</h1>
          <a href="/" style={{ fontSize: 13, color: theme.subText, textDecoration: 'none' }}>← Back to Home</a>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: 14, color: theme.text }}>👤 {user.name}</span>
              <button onClick={handleLogout}
                style={{ padding: '8px 16px', background: '#FEE2E2', color: theme.danger, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)}
              style={{ padding: '8px 16px', background: theme.primary, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
              🔑 Login
            </button>
          )}
        </div>
      </div>

      {message && (
        <div style={{ background: '#D1FAE5', color: '#065F46', padding: 15, borderRadius: 8, marginBottom: 20 }}>{message}</div>
      )}

      <div style={{ display: 'flex', gap: 5, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('stock')}
          style={{ padding: '10px 24px', background: activeTab === 'stock' ? theme.primary : theme.darkMode ? '#333' : '#e5e5e5', color: activeTab === 'stock' ? 'white' : theme.text, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
          📦 Available Stock
        </button>
        {user && (
          <button onClick={() => setActiveTab('purchases')}
            style={{ padding: '10px 24px', background: activeTab === 'purchases' ? theme.primary : theme.darkMode ? '#333' : '#e5e5e5', color: activeTab === 'purchases' ? 'white' : theme.text, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
            🛍️ My Purchases ({purchases.length})
          </button>
        )}
      </div>

      {activeTab === 'stock' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 15 }}>
            {products.filter((p: any) => p.quantity > 0).map((p: any) => (
              <div key={p.id} style={{ background: theme.cardBg, padding: 20, borderRadius: 12, border: `1px solid ${theme.cardBorder}`, transition: 'all 0.3s ease' }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: theme.subText }}>{p.category || 'General'}</div>
                <div style={{ fontSize: 22, fontWeight: 'bold', color: theme.primary, margin: '10px 0' }}>
                  {p.price ? `$${Number(p.price).toFixed(2)}` : 'Free'}
                </div>
                <div style={{ fontSize: 13, color: p.quantity <= p.minQuantity ? theme.warning : theme.success }}>
                  {p.quantity} in stock
                </div>
                <button onClick={() => addToCart(p)}
                  style={{ width: '100%', marginTop: 10, padding: 10, background: theme.primary, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: theme.cardBg, padding: 20, borderRadius: 12, border: `1px solid ${theme.cardBorder}`, height: 'fit-content', position: 'sticky', top: 20, transition: 'all 0.3s ease' }}>
            <h2 style={{ fontSize: 18, marginBottom: 15 }}>🛍️ Cart ({cart.length})</h2>
            {cart.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${theme.tableBorder}` }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: theme.subText }}>${Number(item.price || 0).toFixed(2)} x {item.orderQty}</div>
                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <button onClick={() => removeFromCart(item.id)} style={{ width: 28, height: 28, border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, borderRadius: 6 }}>−</button>
                  <span style={{ fontWeight: 600 }}>{item.orderQty}</span>
                  <button onClick={() => addToCart(item)} style={{ width: 28, height: 28, border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, borderRadius: 6 }}>+</button>
                </div>
              </div>
            ))}
            <div style={{ borderTop: `2px solid ${theme.cardBorder}`, marginTop: 15, paddingTop: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>Total: ${total.toFixed(2)}</div>
              <button onClick={placeOrder} disabled={cart.length === 0}
                style={{ width: '100%', marginTop: 10, padding: 12, background: cart.length ? theme.success : theme.darkMode ? '#333' : '#d1d5db', color: 'white', border: 'none', borderRadius: 8, cursor: cart.length ? 'pointer' : 'not-allowed', fontWeight: 600 }}>
                {user ? 'Place Order' : 'Login to Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'purchases' && user && (
        <div style={{ background: theme.cardBg, borderRadius: 12, border: `1px solid ${theme.cardBorder}`, overflow: 'auto', transition: 'all 0.3s ease' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: theme.tableHeader }}>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: theme.subText }}>Order #</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: theme.subText }}>Products</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: theme.subText }}>Total</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: theme.subText }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: theme.subText }}>No purchases yet</td></tr>
              ) : (
                purchases.map((o: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.tableBorder}` }}>
                    <td style={{ padding: 12 }}>#{o.id || i + 1}</td>
                    <td style={{ padding: 12 }}>
                      {o.items?.map((item: any, j: number) => (
                        <div key={j} style={{ fontSize: 13 }}>{item.name} <span style={{ color: theme.subText }}>x{item.orderQty}</span></div>
                      ))}
                    </td>
                    <td style={{ padding: 12, fontWeight: 600 }}>${(o.total || 0).toFixed(2)}</td>
                    <td style={{ padding: 12, fontSize: 13, color: theme.subText }}>{o.date || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: theme.cardBg, padding: 30, borderRadius: 12, width: '90%', maxWidth: 400, border: `1px solid ${theme.cardBorder}`, transition: 'all 0.3s ease' }}>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: theme.text }}>🔑 Customer Login</h2>
            {loginError && (
              <div style={{ background: '#FEE2E2', color: '#DC2626', padding: 10, borderRadius: 6, marginBottom: 15, fontSize: 13 }}>{loginError}</div>
            )}
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" required value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                style={{ width: '100%', padding: 10, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, marginBottom: 10, boxSizing: 'border-box' }} />
              <input type="password" placeholder="Password" required value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                style={{ width: '100%', padding: 10, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, marginBottom: 15, boxSizing: 'border-box' }} />
              <button type="submit"
                style={{ width: '100%', padding: 12, background: theme.primary, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginBottom: 10 }}>
                Sign In
              </button>
              <button type="button" onClick={() => setShowLogin(false)}
                style={{ width: '100%', padding: 12, background: theme.darkMode ? '#333' : '#e5e5e5', color: theme.text, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Cancel
              </button>
            </form>
            <div style={{ marginTop: 15, padding: 12, background: theme.tableHeader, borderRadius: 6, fontSize: 12, color: theme.subText, textAlign: 'center' }}>
              Demo: customer@demo.com / demo123
            </div>
          </div>
        </div>
      )}
    </div>
  )
}