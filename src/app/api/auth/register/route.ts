import { NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json()
  
  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }
  
  const user = registerUser(name, email, password)
  
  if (!user) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 })
  }
  
  const { password: _, ...userWithoutPassword } = user
  return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
}