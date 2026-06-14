import { NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  const user = loginUser(email, password)
  
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }
  
  // Don't send password back
  const { password: _, ...userWithoutPassword } = user
  return NextResponse.json({ user: userWithoutPassword })
}