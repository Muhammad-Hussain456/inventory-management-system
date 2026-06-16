import { NextRequest, NextResponse } from "next/server"
import { adjustStock } from "@/lib/data"

let orders: any[] = []

export async function GET() {
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()
    
    for (const item of items) {
      const result = adjustStock(item.id, 'out', item.orderQty)
      if (!result) return NextResponse.json({ error: "Not enough stock" }, { status: 400 })
    }
    
    const total = items.reduce((sum: number, item: any) => sum + (item.price || 0) * item.orderQty, 0)
    const order = {
      id: orders.length + 1,
      items,
      total,
      date: new Date().toLocaleDateString()
    }
    orders.push(order)
    
    return NextResponse.json({ success: true, order })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}