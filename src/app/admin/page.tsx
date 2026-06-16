'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme'

export default function AdminDashboard() {
  const theme = useTheme()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState('stock')
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', sku: '', quantity: 0, minQuantity: 10, price: '', category: '' })

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (!stored) { router.push('/auth'); return }
    const userData = JSON.parse(stored)
    if (userData.role !== 'admin') { router.push('/customer'); return }
    setUser(userData)
    setChecking(false)
    refresh()
  }, [])

  const refresh = () => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
    fetch('/api/order')
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
  }

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    router.push('/')
  }

  const handleAdd = async (e: any) => {
    e.preventDefault()
    await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowAdd(false)
    setForm({ name: '', sku: '', quantity: 0, minQuantity: 10, price: '', category: '' })
    refresh()
  }

  const handleAdjust = async (id: number, type: string) => {
    await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'adjust', id, type, qty: 1 })
    })
    refresh()
  }

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`⚠️ Delete "${name}"?\n\nThis cannot be undone!`)) {
      await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      })
      refresh()
    }
  }

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: products.length,
    inStock: products.filter((p: any) => p.quantity > 0).length,
    lowStock: products.filter((p: any) => p.quantity <= p.minQuantity && p.quantity > 0).length,
    outStock: products.filter((p: any) => p.quantity === 0).length,
    totalSales: orders.length,
    revenue: orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
  }

  if (checking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: theme.bg, color: theme.text, fontFamily: 'system-ui' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>⏳</div>
          <div style={{ fontSize: 18, color: theme.subText }}>Checking access...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20, fontFamily: 'system-ui', background: theme.bg, minHeight: '100vh', color: theme.text, transition: 'all 0.3s ease' }}>
      {/* Theme Toggle */}
      <button onClick={theme.toggleTheme}
        style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 100, width: 48, height: 24, borderRadius: 12, background: theme.darkMode ? '#333' : '#e5e5e5', border: 'none', cursor: 'pointer', padding: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: theme.darkMode ? '#fff' : '#0a0a0a', margin: 3, transition: 'all 0.3s ease', marginLeft: theme.darkMode ? '4px' : '26px', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {theme.darkMode ? '🌙' : '☀️'}
        </div>
      </button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 5 }}>🔐 Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            <a href="/" style={{ fontSize: 13, color: theme.subText, textDecoration: 'none' }}>← Back to Home</a>
            {user && <span style={{ fontSize: 13, color: theme.subText }}>👤 {user.name}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowAdd(true)}
            style={{ padding: '10px 20px', background: theme.primary, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
            + Add Product
          </button>
          <button onClick={handleLogout}
            style={{ padding: '10px 20px', background: '#FEE2E2', color: theme.danger, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 20 }}>
        {['stock', 'sales'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              background: activeTab === tab ? theme.primary : theme.darkMode ? '#333' : '#e5e5e5',
              color: activeTab === tab ? 'white' : theme.text,
              border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500
            }}>
            {tab === 'stock' ? '📦 Stock' : '💰 Sales'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginBottom: 30 }}>
        {activeTab === 'stock' ? (
          <>
            {[
              { label: 'Total Products', value: stats.total, color: theme.darkMode ? '#1e3a5f' : '#EFF6FF', textColor: theme.darkMode ? '#60a5fa' : '#1E40AF' },
              { label: 'In Stock', value: stats.inStock, color: theme.darkMode ? '#14532d' : '#F0FDF4', textColor: theme.darkMode ? '#4ade80' : '#166534' },
              { label: 'Low Stock', value: stats.lowStock, color: theme.darkMode ? '#422006' : '#FEFCE8', textColor: theme.darkMode ? '#fbbf24' : '#854D0E' },
              { label: 'Out of Stock', value: stats.outStock, color: theme.darkMode ? '#450a0a' : '#FEF2F2', textColor: theme.darkMode ? '#f87171' : '#991B1B' },
            ].map(s => (
              <div key={s.label} style={{ background: s.color, padding: 20, borderRadius: 12, transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: s.textColor }}>{s.value}</div>
                <div style={{ color: s.textColor, marginTop: 5, fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </>
        ) : (
          <>
            {[
              { label: 'Total Orders', value: stats.totalSales, color: theme.darkMode ? '#1e3a5f' : '#EFF6FF', textColor: theme.darkMode ? '#60a5fa' : '#1E40AF' },
              { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, color: theme.darkMode ? '#14532d' : '#F0FDF4', textColor: theme.darkMode ? '#4ade80' : '#166534' },
            ].map(s => (
              <div key={s.label} style={{ background: s.color, padding: 20, borderRadius: 12, transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: s.textColor }}>{s.value}</div>
                <div style={{ color: s.textColor, marginTop: 5, fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Stock Tab */}
      {activeTab === 'stock' && (
        <>
          <input type="text" placeholder="🔍 Search products..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: 12, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 8, marginBottom: 20, fontSize: 14, boxSizing: 'border-box' }} />

          <div style={{ background: theme.cardBg, borderRadius: 12, border: `1px solid ${theme.cardBorder}`, overflow: 'auto', transition: 'all 0.3s ease' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: theme.tableHeader }}>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: theme.subText }}>Product</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: theme.subText }}>Category</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: theme.subText }}>Stock</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: theme.subText }}>Price</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 13, color: theme.subText }}>Status</th>
                  <th style={{ padding: 12, textAlign: 'right', fontSize: 13, color: theme.subText }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: theme.subText }}>No products found</td></tr>
                ) : (
                  filtered.map((p: any) => (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${theme.tableBorder}` }}>
                      <td style={{ padding: 12 }}>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: theme.subText }}>SKU: {p.sku}</div>
                      </td>
                      <td style={{ padding: 12 }}>
                        <span style={{ background: theme.badgeBg, padding: '4px 10px', borderRadius: 20, fontSize: 12 }}>{p.category || '-'}</span>
                      </td>
                      <td style={{ padding: 12, fontFamily: 'monospace', fontWeight: 'bold' }}>{p.quantity}</td>
                      <td style={{ padding: 12 }}>{p.price ? `$${Number(p.price).toFixed(2)}` : '-'}</td>
                      <td style={{ padding: 12 }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 12,
                          background: p.quantity === 0 ? '#FEE2E2' : p.quantity <= p.minQuantity ? '#FEF3C7' : '#D1FAE5',
                          color: p.quantity === 0 ? '#991B1B' : p.quantity <= p.minQuantity ? '#92400E' : '#065F46',
                        }}>
                          {p.quantity === 0 ? 'Out' : p.quantity <= p.minQuantity ? 'Low' : 'OK'}
                        </span>
                      </td>
                      <td style={{ padding: 12, textAlign: 'right' }}>
                        <button onClick={() => handleAdjust(p.id, 'out')} disabled={p.quantity === 0}
                          style={{ padding: '6px 10px', marginRight: 3, border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, borderRadius: 6, cursor: 'pointer' }}>➖</button>
                        <button onClick={() => handleAdjust(p.id, 'in')}
                          style={{ padding: '6px 10px', marginRight: 3, border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, borderRadius: 6, cursor: 'pointer' }}>➕</button>
                        <button onClick={() => handleDelete(p.id, p.name)}
                          style={{ padding: '6px 10px', background: '#FEE2E2', color: theme.danger, border: 'none', borderRadius: 6, cursor: 'pointer' }}>🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && (
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
              {orders.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: theme.subText }}>No orders yet</td></tr>
              ) : (
                orders.map((o: any, i: number) => (
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

      {/* Add Product Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: theme.cardBg, padding: 30, borderRadius: 12, width: '90%', maxWidth: 450, border: `1px solid ${theme.cardBorder}`, transition: 'all 0.3s ease' }}>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: theme.text }}>Add Product</h2>
            <form onSubmit={handleAdd}>
              <input type="text" placeholder="Product Name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: 10, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, marginBottom: 10, boxSizing: 'border-box' }} />
              <input type="text" placeholder="SKU *" required value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
                style={{ width: '100%', padding: 10, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, marginBottom: 10, boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                  style={{ padding: 10, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 6 }} />
                <input type="number" placeholder="Min Qty" value={form.minQuantity} onChange={e => setForm({ ...form, minQuantity: Number(e.target.value) })}
                  style={{ padding: 10, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 6 }} />
              </div>
              <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                style={{ width: '100%', padding: 10, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, marginBottom: 10, boxSizing: 'border-box' }} />
              <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: 10, background: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}`, borderRadius: 6, marginBottom: 20, boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 10, border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.text, borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: 10, background: theme.primary, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}