import {defineStore} from 'pinia'
import {ref,computed} from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
    // Mock user for testing (remove in production)
    const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser'
    }

    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)
    const loading = ref(false)
    const error = ref(null)

    const isAuthenticated = computed(() => !!token.value)

    const fullName = computed(() => {
        if (!user.value) return ''
        return user.value.name || user.value.username || ''
    })

    const userInitials = computed(() => {
        if (!user.value) return 'U'
        const name = user.value.name || user.value.username || 'User'
        const names = name.split(' ')
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase()
        }
        return name.substring(0, 2).toUpperCase()
    })

    async function login(credentials){
        loading.value = true
        error.value = null

        try {
            const response = await authService.login(credentials)

            const data = response.data.data ||  response.data

            const authToken = data.token || data.access_token || response.data.token

            if(authToken){
                token.value = authToken

                localStorage.setItem('token', authToken)
            }
            // store user data if returned 

            const userData = data.user || data.data?.user ||response.data.user || data
            // check if userData has user-like properties

            if (userData && (userData.email || userData.name || userData.id)){
                user.value = userData
                localStorage.setItem('user', JSON.stringify(userData))
            }
            // Fetch user details if not included in login response

            if (!user.value) {
                try {
                    await fetchCurrentUser()
                } catch (fetchErr){
                    console.error('Failed to fetch current user after login:',fetchErr)
                }
            }
            loading.value = false
            return response.data
        } catch (err){
            loading.value = false
            error.value = err.response?.data?.message || 'Login failed'
            console.error('Login error', err)
            throw err
        }
    }

    async function register(userData){
        loading.value = true
        error.value = null

        try{
            const response = await authService.register(userData)
            loading.value =false
            return response.data

        } catch(err){
            loading.value = false
            error.value = err.response?.data?.message || 'Registration failed'
            throw err
        }
    }

    async function logout() {
        loading.value = true
        try {
            // Call logout API if token exists
            if (token.value) {
                await authService.logout()
            }
        } catch(err) {
            console.error('Logout API error:', err)
        } finally {
            // Clear all local state regardless of API call result
            user.value = null
            token.value = null

            // Clear all auth-related items from localStorage
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('auth_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('token_expires_at')
            localStorage.removeItem('token_type')
            localStorage.removeItem('user_details')

            // Also use authService clearTokens helper
            authService.clearTokens()

            loading.value = false

            console.log('✅ Logout successful - all tokens cleared')
        }
    }
    async function fetchCurrentUser() {
    if (!token.value) return

    loading.value = true
    error.value = null

    try {
      const response = await authService.getCurrentUser()

      // Handle different response structures
      const userData = response.data.data || response.data.user || response.data

      if (userData && (userData.email || userData.name || userData.id)) {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
      }

      loading.value = false
      return userData
    } catch (err) {
      loading.value = false
      error.value = err.response?.data?.message || 'Failed to fetch user'
      console.error('Fetch current user error:', err)

      // If token is invalid, logout
      if (err.response?.status === 401) {
        await logout()
      }
      throw err
    }
  }
  async function updateProfile(data) {
    loading.value = true
    error.value = null

    try {
      // TODO: Call update profile API when available
      // const response = await api.put('/auth/profile', data)

      // For now, update local user data
      user.value = { ...user.value, ...data }
      localStorage.setItem('user', JSON.stringify(user.value))

      loading.value = false
      return user.value
    } catch (err) {
      loading.value = false
      error.value = err.response?.data?.message || 'Failed to update profile'
      throw err
    }
  }
  // Initialize user from localStorage if exists
  function initializeAuth() {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Failed to parse stored user:', err)
        localStorage.removeItem('user')
      }
    }

    // Fetch fresh user data if token exists
    if (token.value && !user.value) {
      fetchCurrentUser().catch(() => {
        // Ignore error, user will be redirected to login if needed
      })
    }

    // DEVELOPMENT ONLY: Use mock user if no user is logged in
    // Remove this in production
    if (!user.value && !token.value) {
      console.warn('⚠️ Using mock user for development testing')
      user.value = mockUser
    }
  }

  // Initialize on store creation
  initializeAuth()

  return {
    // State
    user,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,
    fullName,
    userInitials,

    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
    initializeAuth
  }
})