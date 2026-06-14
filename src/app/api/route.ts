import { NextRequest, NextResponse } from "next/server"
import { getProducts, addProduct, adjustStock } from "@/lib/data"

export async function GET() {
  const products = getProducts()
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle stock adjustment
    if (body.action === 'adjust') {
      const result = adjustStock(body.id, body.type, body.qty || 1)
      if (!result) {
        return NextResponse.json({ error: "Failed to adjust stock" }, { status: 400 })
      }
      return NextResponse.json(result)
    }
    
    // Handle adding product
    const product = addProduct(body)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}