let products: any[] = [
  {
    id: 1,
    name: "Coffee Beans",
    sku: "COF-001",
    quantity: 50,
    minQuantity: 10,
    price: 15.99,
    category: "Beverages",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Paper Cups",
    sku: "CUP-001",
    quantity: 200,
    minQuantity: 50,
    price: 0.25,
    category: "Supplies",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Laptop Stand",
    sku: "STD-001",
    quantity: 5,
    minQuantity: 10,
    price: 49.99,
    category: "Electronics",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function getProducts() {
  return products
}

export function addProduct(product: any) {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: product.name,
    sku: product.sku,
    quantity: product.quantity || 0,
    minQuantity: product.minQuantity || 10,
    price: product.price || null,
    category: product.category || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  products.push(newProduct)
  return newProduct
}

export function adjustStock(id: number, type: string, qty: number) {
  const product = products.find(p => p.id === id)
  if (!product) return null
  
  if (type === 'in') {
    product.quantity += qty
  } else {
    if (product.quantity < qty) return null
    product.quantity -= qty
  }
  
  product.updatedAt = new Date().toISOString()
  return product
}

export function deleteProduct(id: number): boolean {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return false
  products.splice(index, 1)
  return true
}