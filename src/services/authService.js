import api from './api'

// Example authentication service
// This shows how to use the configured axios instance

const authService = {
  // Login user
  login(credentials) {
    return api.post('/auth/login', credentials)
  },

  // Register user
  register(userData) {
    return api.post('/auth/register', userData)
  },

  // Logout user
  logout() {
    return api.post('/auth/logout')
  },

  // Get current user profile
  getCurrentUser() {
    return api.get('/auth/me')
  },

  // Refresh token
  refreshToken() {
    return api.post('/auth/refresh')
  },

  // Forgot password
  forgotPassword(email) {
    return api.post('/auth/forgot-password', { email })
  },

  // Reset password
  resetPassword(token, newPassword) {
    return api.post('/auth/reset-password', { token, password: newPassword })
  },
}

export default authService
