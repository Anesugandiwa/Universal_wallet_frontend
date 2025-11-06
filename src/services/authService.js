import api from './api'

// Payzaar Authentication Service
const authService = {
  /**
   * Login with username and password (OAuth2 Password Grant)
   * @param {Object} credentials - { username, password, grant_type }
   * @returns OAuth2AccessToken
   */
  login(credentials) {
    // OAuth2 typically uses form data format
    const formData = new URLSearchParams()
    formData.append('grant_type', credentials.grant_type || 'password')
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    // OAuth2 client credentials for admin portal
    const clientId = credentials.client_id || 'admin-portal'
    const clientSecret = credentials.client_secret || '#@U7HjucwxOa@BeFYvUcRyaVsM%MnQCv'

    // Create Basic Auth header for client authentication
    const basicAuth = btoa(`${clientId}:${clientSecret}`)

    return api.post('/auth/oauth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      }
    })
  },

  /**
   * Login with mobile number and PIN
   * @param {Object} credentials - { mobileNumber, pin }
   */
  loginWithMobile(credentials) {
    return api.post('/auth/oauth/token/mobile', credentials)
  },

  /**
   * Login with biometric data
   * @param {Object} biometricData
   */
  loginWithBiometric(biometricData) {
    return api.post('/auth/oauth/token/biometric', biometricData)
  },

  /**
   * Two-Factor Authentication verification
   * @param {Object} twoFactorData - { otp, username }
   */
  verifyTwoFactor(twoFactorData) {
    return api.post('/auth/cmn/two-factor/auth', twoFactorData)
  },

  /**
   * Resend OTP for login
   * @param {string} username
   */
  resendLoginOtp(username) {
    return api.post('/auth/cmn/login/resend-otp', { username })
  },

  /**
   * Get current authenticated user details
   */
  getUserDetails() {
    return api.get('/auth/v1/user-details')
  },

  /**
   * Logout user
   */
  logout() {
    return api.delete('/auth/v1/logout')
  },

  /**
   * Validate token
   * @param {string} token
   */
  validateToken(token) {
    return api.post('/auth/oauth/check_token', null, {
      params: { token }
    })
  },

  /**
   * Refresh access token (if refresh token is available)
   * @param {string} refreshToken
   */
  refreshToken(refreshToken) {
    const formData = new URLSearchParams()
    formData.append('grant_type', 'refresh_token')
    formData.append('refresh_token', refreshToken)

    return api.post('/auth/oauth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },

  // Helper methods for token management

  /**
   * Store authentication tokens in localStorage
   * @param {Object} tokenData - OAuth2AccessToken response
   */
  storeTokens(tokenData) {
    if (tokenData.access_token) {
      localStorage.setItem('auth_token', tokenData.access_token)
    }
    if (tokenData.refresh_token) {
      localStorage.setItem('refresh_token', tokenData.refresh_token)
    }
    if (tokenData.expires_in) {
      const expiresAt = Date.now() + (tokenData.expires_in * 1000)
      localStorage.setItem('token_expires_at', expiresAt.toString())
    }
    if (tokenData.token_type) {
      localStorage.setItem('token_type', tokenData.token_type)
    }
  },

  /**
   * Clear all authentication tokens
   */
  clearTokens() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token_expires_at')
    localStorage.removeItem('token_type')
    localStorage.removeItem('user_details')
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('auth_token')
    const expiresAt = localStorage.getItem('token_expires_at')

    if (!token) return false

    // Check if token is expired
    if (expiresAt && Date.now() > parseInt(expiresAt)) {
      return false
    }

    return true
  },

  /**
   * Get stored access token
   */
  getAccessToken() {
    return localStorage.getItem('auth_token')
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken() {
    return localStorage.getItem('refresh_token')
  }
}

export default authService
