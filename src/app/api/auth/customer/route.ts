import { NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  const user = loginUser(email, password)
  
  if (!user || user.role !== 'customer') {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  
  return NextResponse.json({ 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    } 
  })
}