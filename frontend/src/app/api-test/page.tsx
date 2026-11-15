'use client'

import { useState, useEffect } from 'react'

interface ApiStatus {
  name: string
  version: string
  status: string
  timestamp: string
}

export default function ApiTestPage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loginResult, setLoginResult] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    testApiConnection()
  }, [])

  const testApiConnection = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost/hilyoon-backend/api/status')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setApiStatus(data.data)
      } else {
        throw new Error(data.message || 'API returned error')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const testLogin = async () => {
    try {
      setLoginResult(null)
      
      const response = await fetch('http://localhost/hilyoon-backend/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@hilyoon.com',
          password: 'admin123'
        })
      })

      const data = await response.json()
      setLoginResult(data)
      
      if (data.success) {
        localStorage.setItem('test_token', data.data.token)
      }
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setLoginResult({ error: message })
    }
  }

  const testBlogPosts = async () => {
    try {
      const response = await fetch('http://localhost/hilyoon-backend/api/blog/posts?locale=en&limit=5')
      const data = await response.json()
      console.log('Blog posts:', data)
      alert('Blog posts response logged to console')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('Blog posts error:', err)
      alert('Error: ' + message)
    }
  }

  const testDashboard = async () => {
    try {
      const token = localStorage.getItem('test_token')
      if (!token) {
        alert('Please login first!')
        return
      }

      const response = await fetch('http://localhost/hilyoon-backend/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Dashboard data:', data)
      alert('Dashboard data logged to console')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('Dashboard error:', err)
      alert('Error: ' + message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            🔗 Frontend ↔ XAMPP Backend Test
          </h1>

          {/* API Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">📊 API Connection Status</h2>
            
            {isLoading ? (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                Testing API connection...
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <div className="text-red-800 font-medium">❌ Connection Failed</div>
                <div className="text-red-600 text-sm mt-1">{error}</div>
                <button 
                  onClick={testApiConnection}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  🔄 Retry Connection
                </button>
              </div>
            ) : apiStatus ? (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <div className="text-green-800 font-medium">✅ Connected Successfully</div>
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div><strong>Name:</strong> {apiStatus.name}</div>
                  <div><strong>Version:</strong> {apiStatus.version}</div>
                  <div><strong>Status:</strong> {apiStatus.status}</div>
                  <div><strong>Time:</strong> {new Date(apiStatus.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ) : null}
          </div>

          {/* API Tests */}
          {apiStatus && (
            <div className="space-y-6">
              {/* Authentication Test */}
              <div>
                <h2 className="text-xl font-semibold mb-4">🔐 Authentication Test</h2>
                <button
                  onClick={testLogin}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
                >
                  🔑 Test Login (admin@hilyoon.com)
                </button>
                
                {loginResult && (
                  <div className={`mt-4 p-4 rounded ${loginResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(loginResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Blog Posts Test */}
              <div>
                <h2 className="text-xl font-semibold mb-4">📝 Blog Posts Test</h2>
                <button
                  onClick={testBlogPosts}
                  className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  📚 Get Blog Posts
                </button>
                <p className="text-sm text-gray-600 mt-2">Result will be logged to browser console</p>
              </div>

              {/* Dashboard Test */}
              <div>
                <h2 className="text-xl font-semibold mb-4">📊 Admin Dashboard Test</h2>
                <button
                  onClick={testDashboard}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  🏠 Get Dashboard Data
                </button>
                <p className="text-sm text-gray-600 mt-2">Login first, then test dashboard</p>
              </div>

              {/* Integration Info */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-medium text-blue-800 mb-2">🔗 Integration Details</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div><strong>Frontend:</strong> http://localhost:3000</div>
                  <div><strong>Backend API:</strong> http://localhost/hilyoon-backend/api</div>
                  <div><strong>Database:</strong> MySQL via XAMPP (hilyoon_saas)</div>
                  <div><strong>Authentication:</strong> JWT tokens</div>
                </div>
              </div>

              {/* Success Message */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg text-center">
                <div className="text-xl font-bold mb-2">🎉 Integration Successful!</div>
                <div className="text-green-100">
                  Your Hilyoon frontend is now connected to the XAMPP backend with real database!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Browser Console Instructions */}
        <div className="mt-6 bg-gray-800 text-white p-4 rounded-lg">
          <h3 className="font-medium mb-2">💡 Developer Instructions</h3>
          <p className="text-sm text-gray-300">
            Open browser Developer Tools (F12) → Console tab to see detailed API responses.
            Network tab shows all HTTP requests to your XAMPP backend.
          </p>
        </div>
      </div>
    </div>
  )
}
