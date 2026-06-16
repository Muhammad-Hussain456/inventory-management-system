interface User {
  id: number
  name: string
  email: string
  password: string
  role: string
}

const users: User[] = [
  { id: 1, name: "admin", email: "admin@stockflow.com", password: "admin123", role: "admin" },
  { id: 2, name: "customer", email: "customer@demo.com", password: "demo123", role: "customer" }
]

export function loginUser(email: string, password: string): User | null {
  return users.find(u => u.email === email && u.password === password) || null
}

export function registerUser(name: string, email: string, password: string): User | null {
  if (users.find(u => u.email === email)) return null
  const user: User = { id: users.length + 1, name, email, password, role: "customer" }
  users.push(user)
  return user
}