'use client'

import { useState, useEffect } from 'react'

export default function Store() {
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => { loadProducts() }, [])

  const loadProducts = () => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
  }

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      if (existing.orderQty >= product.quantity) {
        alert('Not enough stock!')
        return
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, orderQty: item.orderQty + 1 }
          : item
      ))
    } else {
      if (product.quantity === 0) {
        alert('Out of stock!')
        return
      }
      setCart([...cart, { ...product, orderQty: 1 }])
    }
  }

  const removeFromCart = (productId: number) => {
    const item = cart.find(i => i.id === productId)
    if (item.orderQty === 1) {
      setCart(cart.filter(i => i.id !== productId))
    } else {
      setCart(cart.map(i =>
        i.id === productId ? { ...i, orderQty: i.orderQty - 1 } : i
      ))
    }
  }

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!')
      return
    }

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      })

      if (res.ok) {
        const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.orderQty, 0)
        setMessage(`Order placed! Total: $${total.toFixed(2)}`)
        setCart([])
        loadProducts()
        setTimeout(() => setMessage(''), 3000)
      } else {
        alert('Order failed. Try again.')
      }
    } catch (err) {
      alert('Failed to connect')
    }
  }

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.orderQty, 0)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20, fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>🛒 Customer Store</h1>
      </div>

      {message && (
        <div style={{ background: '#D1FAE5', color: '#065F46', padding: 15, borderRadius: 8, marginBottom: 20, fontWeight: 500 }}>
          ✅ {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 20 }}>
        {/* Products Grid */}
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 15 }}>Available Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 15 }}>
            {products.filter(p => p.quantity > 0).map(product => (
              <div key={product.id} style={{
                background: 'white', padding: 20, borderRadius: 12, border: '1px solid #E5E7EB',
                display: 'flex', flexDirection: 'column', gap: 10
              }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{product.name}</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>{product.category || 'General'}</div>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#2563EB' }}>
                  {product.price ? `$${Number(product.price).toFixed(2)}` : 'Free'}
                </div>
                <div style={{ fontSize: 13, color: product.quantity <= product.minQuantity ? '#F59E0B' : '#10B981' }}>
                  {product.quantity} in stock
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.quantity === 0}
                  style={{
                    padding: '10px', background: '#2563EB', color: 'white', border: 'none',
                    borderRadius: 8, cursor: product.quantity > 0 ? 'pointer' : 'not-allowed',
                    opacity: product.quantity > 0 ? 1 : 0.5, fontSize: 14
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
            {products.filter(p => p.quantity > 0).length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No products available</div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #E5E7EB', height: 'fit-content', position: 'sticky', top: 20 }}>
          <h2 style={{ fontSize: 18, marginBottom: 15 }}>🛍️ Cart ({cart.length})</h2>
          
          {cart.length === 0 ? (
            <div style={{ color: '#9CA3AF', textAlign: 'center', padding: 30 }}>Cart is empty</div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>
                      ${Number(item.price || 0).toFixed(2)} × {item.orderQty}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => removeFromCart(item.id)}
                      style={{ width: 28, height: 28, border: '1px solid #E5E7EB', background: 'white', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>−</button>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{item.orderQty}</span>
                    <button onClick={() => addToCart(item)}
                      style={{ width: 28, height: 28, border: '1px solid #E5E7EB', background: 'white', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}
                      disabled={item.orderQty >= item.quantity}>+</button>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '2px solid #E5E7EB', marginTop: 15, paddingTop: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 16 }}>
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button onClick={placeOrder}
                  style={{
                    width: '100%', marginTop: 15, padding: 12, background: '#059669', color: 'white',
                    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 600
                  }}>
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}