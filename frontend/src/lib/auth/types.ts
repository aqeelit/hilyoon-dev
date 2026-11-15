export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  avatar?: string
  createdAt: string
  lastLogin?: string
  isActive: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

// Mock users for development
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hilyoon.com',
    name: 'Admin User',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
    createdAt: '2024-01-01',
    lastLogin: '2025-01-20',
    isActive: true
  },
  {
    id: '2',
    email: 'editor@hilyoon.com',
    name: 'Content Editor',
    role: 'editor',
    avatar: '/avatars/editor.jpg',
    createdAt: '2024-01-15',
    lastLogin: '2025-01-19',
    isActive: true
  },
  {
    id: '3',
    email: 'viewer@hilyoon.com',
    name: 'Content Viewer',
    role: 'viewer',
    avatar: '/avatars/viewer.jpg',
    createdAt: '2024-02-01',
    lastLogin: '2025-01-18',
    isActive: true
  }
]

// Mock authentication functions
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock authentication logic
  const user = mockUsers.find(u => u.email === credentials.email)
  
  if (!user) {
    return {
      success: false,
      message: 'User not found'
    }
  }
  
  // In real implementation, verify password hash
  const validPasswords: Record<string, string> = {
    'admin@hilyoon.com': 'admin123',
    'editor@hilyoon.com': 'editor123',
    'viewer@hilyoon.com': 'viewer123'
  }
  
  if (validPasswords[credentials.email] !== credentials.password) {
    return {
      success: false,
      message: 'Invalid password'
    }
  }
  
  if (!user.isActive) {
    return {
      success: false,
      message: 'Account is deactivated'
    }
  }
  
  // Update last login
  user.lastLogin = new Date().toISOString()
  
  // Generate mock token
  const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 24 * 60 * 60 * 1000 }))
  
  return {
    success: true,
    user,
    token,
    message: 'Login successful'
  }
}

export async function logout(): Promise<void> {
  // Clear any stored tokens
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userStr = localStorage.getItem('auth_user')
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export function storeAuth(user: User, token: string): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('auth_user', JSON.stringify(user))
  localStorage.setItem('auth_token', token)
}

export function hasPermission(user: User | null, requiredRole: User['role']): boolean {
  if (!user || !user.isActive) return false
  
  const roleHierarchy = {
    viewer: 1,
    editor: 2,
    admin: 3
  }
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

export function isTokenValid(token: string): boolean {
  try {
    const decoded = JSON.parse(atob(token))
    return decoded.exp > Date.now()
  } catch {
    return false
  }
}
