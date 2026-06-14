// // Simple in-memory storage that persists to a JSON file
// import fs from 'fs'
// import path from 'path'

// const DATA_FILE = path.join(process.cwd(), 'data.json')

// interface Product {
//   id: number
//   name: string
//   sku: string
//   quantity: number
//   minQuantity: number
//   price: number | null
//   category: string | null
//   createdAt: string
//   updatedAt: string
// }

// // Initialize with sample data if file doesn't exist
// const sampleData: Product[] = [
//   {
//     id: 1,
//     name: "Coffee Beans",
//     sku: "COF-001",
//     quantity: 50,
//     minQuantity: 10,
//     price: 15.99,
//     category: "Beverages",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     id: 2,
//     name: "Paper Cups",
//     sku: "CUP-001",
//     quantity: 200,
//     minQuantity: 50,
//     price: 0.25,
//     category: "Supplies",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     id: 3,
//     name: "Laptop Stand",
//     sku: "STD-001",
//     quantity: 5,
//     minQuantity: 10,
//     price: 49.99,
//     category: "Electronics",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   }
// ]

// function readData(): Product[] {
//   try {
//     if (fs.existsSync(DATA_FILE)) {
//       const raw = fs.readFileSync(DATA_FILE, 'utf-8')
//       return JSON.parse(raw)
//     }
//     // Create file with sample data
//     fs.writeFileSync(DATA_FILE, JSON.stringify(sampleData, null, 2))
//     return sampleData
//   } catch {
//     return sampleData
//   }
// }

// function writeData(data: Product[]) {
//   fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
// }

// export function getProducts(): Product[] {
//   return readData()
// }

// export function addProduct(product: any): Product {
//   const data = readData()
//   const newProduct: Product = {
//     id: data.length > 0 ? Math.max(...data.map(p => p.id)) + 1 : 1,
//     name: product.name,
//     sku: product.sku,
//     quantity: product.quantity || 0,
//     minQuantity: product.minQuantity || 10,
//     price: product.price || null,
//     category: product.category || null,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   }
//   data.push(newProduct)
//   writeData(data)
//   return newProduct
// }

// export function adjustStock(id: number, type: string, qty: number): Product | null {
//   const data = readData()
//   const index = data.findIndex(p => p.id === id)
  
//   if (index === -1) return null
  
//   if (type === 'in') {
//     data[index].quantity += qty
//   } else if (type === 'out') {
//     if (data[index].quantity < qty) return null
//     data[index].quantity -= qty
//   }
  
//   data[index].updatedAt = new Date().toISOString()
//   writeData(data)
//   return data[index]
// }

// Replace file-based storage with in-memory for Vercel
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