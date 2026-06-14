import fs from 'fs'
import path from 'path'

const AUTH_FILE = path.join(process.cwd(), 'users.json')

interface User {
  id: number
  name: string
  email: string
  password: string
  role: 'admin' | 'customer'
}

function readUsers(): User[] {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'))
    }
    // Create with default admin
    const defaultUsers: User[] = [
      {
        id: 1,
        name: "Admin",
        email: "admin@stockflow.com",
        password: "admin123",
        role: "admin"
      }
    ]
    fs.writeFileSync(AUTH_FILE, JSON.stringify(defaultUsers, null, 2))
    return defaultUsers
  } catch {
    return []
  }
}

function writeUsers(users: User[]) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(users, null, 2))
}

export function loginUser(email: string, password: string): User | null {
  const users = readUsers()
  return users.find(u => u.email === email && u.password === password) || null
}

export function registerUser(name: string, email: string, password: string): User | null {
  const users = readUsers()
  
  // Check if email exists
  if (users.find(u => u.email === email)) {
    return null
  }
  
  const newUser: User = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    password,
    role: 'customer' // All new registrations are customers
  }
  
  users.push(newUser)
  writeUsers(users)
  return newUser
}