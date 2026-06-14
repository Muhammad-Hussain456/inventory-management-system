import { NextRequest, NextResponse } from "next/server"
import { adjustStock } from "@/lib/data"

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Process each item in the order
    for (const item of items) {
      const result = adjustStock(item.id, 'out', item.orderQty)
      if (!result) {
        return NextResponse.json({ 
          error: `Failed to process ${item.name}. Not enough stock.` 
        }, { status: 400 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Order placed successfully! ${items.length} items ordered.` 
    })
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}