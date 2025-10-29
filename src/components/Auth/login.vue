
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import BaseInput from '../ui/BaseInput.vue'
  import BaseButton from '../ui/BaseButton.vue'
  import authService from '@/services/authService'
  import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

  const router = useRouter()

  // Form data
  const formData = ref({
      email: '',
      password: '',
      rememberMe: false
  })

  // Form errors
  const errors = ref({})

  // Form state
  const isLoading = ref(false)
  const serverError = ref('')

  // Validate form
  const validateForm = () => {
      errors.value = {}

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.value.email.trim()) {
          errors.value.email = 'Email is required'
      } else if (!emailRegex.test(formData.value.email)) {
          errors.value.email = 'Please enter a valid email'
      }

      // Password validation
      if (!formData.value.password) {
          errors.value.password = 'Password is required'
      } else if (formData.value.password.length < 6) {
          errors.value.password = 'Password must be at least 6 characters'
      }

      return Object.keys(errors.value).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
      serverError.value = ''

      if (!validateForm()) return

      isLoading.value = true

      try {
          const response = await authService.login({
              email: formData.value.email,
              password: formData.value.password,
              remember: formData.value.rememberMe
          })

          // Store token
          if (response.data.token) {
              localStorage.setItem('auth_token', response.data.token)
          }

          // Store user data if available
          if (response.data.user) {
              localStorage.setItem('user', JSON.stringify(response.data.user))
          }

          // Redirect to dashboard
          router.push('/dashboard')

      } catch (error) {
          if (error.response?.status === 401) {
              serverError.value = 'Invalid email or password'
          } else if (error.response?.data?.message) {
              serverError.value = error.response.data.message
          } else if (error.response?.data?.errors) {
              // Handle validation errors from backend
              const backendErrors = error.response.data.errors
              Object.keys(backendErrors).forEach(key => {
                  errors.value[key] = backendErrors[key][0]
              })
          } else {
              serverError.value = 'An error occurred during login. Please try again.'
          }
      } finally {
          isLoading.value = false
      }
  }

  // Navigate to register
  const goToRegister = () => {
      router.push('/register')
  }

  // Navigate to forgot password
  const goToForgotPassword = () => {
      router.push('/forgot-password')
  }
  </script>

  <template>
      <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div class="w-full max-w-md mx-auto">
              <!-- Main Card -->
              <div class="bg-white rounded-2xl shadow-xl p-8">
                  <!-- Logo -->
                  <div class="text-center mb-8">
                      <div class="h-16 w-16 rounded-full flex items-center justify-center mx-auto"
                           style="background-color: var(--color-primary)">
                          <span class="text-white text-2xl font-bold">UW</span>
                      </div>
                      <h1 class="mt-4 text-2xl font-bold text-gray-900">Welcome Back</h1>
                      <p class="mt-2 text-sm text-gray-600">
                          Sign in to access your Universal Wallet
                      </p>
                  </div>

                  <!-- Server Error Alert -->
                  <div v-if="serverError" class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                      <p class="text-sm text-red-600">{{ serverError }}</p>
                  </div>

                  <!-- Login Form -->
                  <form @submit.prevent="handleSubmit" class="space-y-6">
                      <!-- Email -->
                      <BaseInput
                          v-model="formData.email"
                          type="email"
                          label="Email Address"
                          placeholder="your@email.com"
                          :icon-left="EnvelopeIcon"
                          :error="errors.email"
                          :required="true"
                      />

                      <!-- Password -->
                      <BaseInput
                          v-model="formData.password"
                          type="password"
                          label="Password"
                          placeholder="Enter your password"
                          :icon-left="LockClosedIcon"
                          :error="errors.password"
                          :required="true"
                      />

                      <!-- Remember Me & Forgot Password -->
                      <div class="flex items-center justify-between">
                          <div class="flex items-center">
                              <input
                                  v-model="formData.rememberMe"
                                  type="checkbox"
                                  id="remember"
                                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label for="remember" class="ml-2 text-sm text-gray-600">
                                  Remember me
                              </label>
                          </div>

                          <button
                              @click="goToForgotPassword"
                              type="button"
                              class="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                          >
                              Forgot password?
                          </button>
                      </div>

                      <!-- Submit Button -->
                      <BaseButton
                          type="submit"
                          variant="primary"
                          size="lg"
                          :full-width="true"
                          :loading="isLoading"
                          text="Sign In"
                      />
                  </form>

                  <!-- Divider -->
                  <div class="relative my-6">
                      <div class="absolute inset-0 flex items-center">
                          <div class="w-full border-t border-gray-300"></div>
                      </div>
                      <div class="relative flex justify-center text-sm">
                          <span class="px-2 bg-white text-gray-500">Or</span>
                      </div>
                  </div>

                  <!-- Social Login Buttons (Optional) -->
                  <div class="space-y-3">
                      <!-- Google Login -->
                      <button
                          type="button"
                          class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                          <svg class="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Continue with Google
                      </button>
                  </div>

                  <!-- Register Link -->
                  <div class="mt-6 text-center">
                      <p class="text-sm text-gray-600">
                          Don't have an account?
                          <button
                              @click="goToRegister"
                              type="button"
                              class="font-medium text-primary hover:text-primary-dark transition-colors"
                          >
                              Sign up
                          </button>
                      </p>
                  </div>
              </div>

              <!-- Security Notice -->
              <div class="mt-6 text-center">
                  <p class="text-xs text-gray-500">
                      <svg class="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8
  0v4h8z" />
                      </svg>
                      Your connection is secure and encrypted
                  </p>
              </div>
          </div>
      </div>
  </template>

  <style scoped>
  /* Custom checkbox styles using brand colors */
  input[type="checkbox"]:checked {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
  }
  </style>