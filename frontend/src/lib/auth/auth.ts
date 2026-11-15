import { authAPI } from '../api/client';

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  avatar?: string
  bio?: string
  is_active: boolean
  created_at: string
  last_login_at?: string
  updated_at: string
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

/**
 * Login with real API
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const data = await authAPI.login(credentials);
    
    return {
      success: true,
      user: data.user as unknown as User,
      token: data.token,
      message: 'Login successful'
    };

  } catch (error: unknown) {
    return {
      success: false,
      message: (error instanceof Error && error.message) || 'Login failed'
    };
  }
}

/**
 * Logout with real API
 */
export async function logout(): Promise<void> {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Always clear local storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

/**
 * Get stored token
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Store auth data
 */
export function storeAuth(user: User, token: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('auth_user', JSON.stringify(user));
  localStorage.setItem('auth_token', token);
}

/**
 * Check if user has permission
 */
export function hasPermission(user: User | null, requiredRole: User['role']): boolean {
  if (!user || !user.is_active) return false;
  
  const roleHierarchy = {
    viewer: 1,
    editor: 2,
    admin: 3
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

/**
 * Simple token validation (check if exists and not expired)
 */
export function isTokenValid(token: string): boolean {
  if (!token) return false;
  
  try {
    // Basic JWT structure check
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Refresh user profile from API
 */
export async function refreshProfile(): Promise<User | null> {
  try {
    const user = (await authAPI.getProfile()) as User | null;
    
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
    
    return user;
  } catch (error) {
    console.error('Failed to refresh profile:', error);
    return null;
  }
}

/**
 * Check if current session is valid
 */
export async function validateSession(): Promise<boolean> {
  const token = getStoredToken();
  
  if (!token || !isTokenValid(token)) {
    return false;
  }
  
  try {
    await authAPI.getProfile();
    return true;
  } catch {
    // Session is invalid, clear auth data
    logout();
    return false;
  }
}
