// API Configuration and Base Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
  timestamp: string;
}

export class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data: ApiResponse<T> = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data.data;
  }

  // Authentication Methods
  async login(credentials: { email: string; password: string; rememberMe?: boolean }) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await this.handleResponse<{ token: string; user: Record<string, unknown> }>(response);
    
    // Store token and user data
    this.setToken(data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    
    return data;
  }

  async logout() {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } finally {
      this.removeToken();
    }
  }

  async getProfile() {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Blog Methods
  async getPosts(params: {
    locale?: string;
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseUrl}/blog/posts?${searchParams}`);
    return this.handleResponse(response);
  }

  async getPost(slug: string, locale: string = 'en') {
    const response = await fetch(`${this.baseUrl}/blog/post/${slug}?locale=${locale}`);
    return this.handleResponse(response);
  }

  // Admin Methods
  async getDashboard() {
    const response = await fetch(`${this.baseUrl}/admin/dashboard`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getUsers(params: { limit?: number; offset?: number } = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseUrl}/admin/users?${searchParams}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    bio?: string;
    is_active?: boolean;
  }) {
    const response = await fetch(`${this.baseUrl}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }

  async updateUser(userId: string, userData: Record<string, unknown>) {
    const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }

  async deleteUser(userId: string) {
    const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export commonly used functions
export const authAPI = {
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => 
    apiClient.login(credentials),
  logout: () => apiClient.logout(),
  getProfile: () => apiClient.getProfile(),
};

export const blogAPI = {
  getPosts: (params?: Parameters<typeof apiClient.getPosts>[0]) => 
    apiClient.getPosts(params),
  getPost: (slug: string, locale?: string) => apiClient.getPost(slug, locale),
};

export const adminAPI = {
  getDashboard: () => apiClient.getDashboard(),
  getUsers: (params?: Parameters<typeof apiClient.getUsers>[0]) => 
    apiClient.getUsers(params),
  createUser: (userData: Parameters<typeof apiClient.createUser>[0]) => 
    apiClient.createUser(userData),
  updateUser: (userId: string, userData: Record<string, unknown>) => 
    apiClient.updateUser(userId, userData),
  deleteUser: (userId: string) => apiClient.deleteUser(userId),
};
