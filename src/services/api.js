import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Debug: Log API base URL
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
console.log('All env vars:', import.meta.env)

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Debug: Log request details
    console.log('API Request:', {
      method: config.method.toUpperCase(),
      url: config.baseURL + config.url,
      data: config.data
    })

    // Check if this is a public endpoint (contains /opn/ in the URL)
    // Also check for special admin registration flag
    const isPublicEndpoint = config.url.includes('/opn/')
    const isAdminRegistration = config.headers['X-First-Admin-Registration'] === 'true'

    // Only add auth token for non-public endpoints and non-admin-registration
    if (!isPublicEndpoint && !isAdminRegistration) {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } else {
      if (isPublicEndpoint) {
        console.log('🔓 Public endpoint detected - skipping auth token:', config.url)
      }
      if (isAdminRegistration) {
        console.log('👤 First admin registration - skipping auth token:', config.url)
        // Remove the special header so it doesn't get sent to server
        delete config.headers['X-First-Admin-Registration']
      }
    }

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.warn('⚠️ 401 Unauthorized - NOT redirecting (disabled for debug)')
          localStorage.removeItem('auth_token')
          // DISABLED FOR DEBUG: window.location.href = '/login'
          break
        case 403:
          console.error('Access forbidden')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error('An error occurred:', error.response.data.message)
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server. Please check your connection.')
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
