
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import BaseInput from '../ui/BaseInput.vue'
  import BaseButton from '../ui/BaseButton.vue'
  import authService from '@/services/authService'
  import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/vue/24/outline'

  const router = useRouter()

  // Form data
  const formData = ref({
      username: '',  // Changed from email to username (can be email or username)
      password: '',
      rememberMe: false
  })

  // Form errors
  const errors = ref({})

  // Form state
  const isLoading = ref(false)
  const serverError = ref('')
  const successMessage = ref('')

  // 2FA state
  const requires2FA = ref(false)
  const otpCode = ref('')
  const otpError = ref('')
  const isVerifyingOtp = ref(false)

  // Validate form
  const validateForm = () => {
      errors.value = {}

      // Username validation (can be email or username)
      if (!formData.value.username.trim()) {
          errors.value.username = 'Username or email is required'
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
      successMessage.value = ''

      if (!validateForm()) return

      isLoading.value = true

      try {
          const response = await authService.login({
              username: formData.value.username,
              password: formData.value.password,
              grant_type: 'password'
          })

          // Check if response indicates 2FA is required
          if (response.data.requires2FA || response.data.requiresTwoFactor) {
              requires2FA.value = true
              successMessage.value = 'Please enter the OTP sent to your registered contact'
              isLoading.value = false
              return
          }

          // Store tokens
          if (response.data) {
              authService.storeTokens(response.data)
          }

          // Get user details after successful login
          try {
              const userResponse = await authService.getUserDetails()
              localStorage.setItem('user_details', JSON.stringify(userResponse.data))
          } catch (error) {
              console.error('Could not fetch user details:', error)
          }

          // Redirect to dashboard
          router.push('/dashboard')

      } catch (error) {
          if (error.response?.status === 401) {
              serverError.value = 'Invalid username or password'
          } else if (error.response?.status === 403) {
              // Might indicate 2FA is required
              requires2FA.value = true
              successMessage.value = 'Please enter the OTP sent to your registered contact'
          } else if (error.response?.data?.message) {
              serverError.value = error.response.data.message
          } else if (error.response?.data?.error_description) {
              // OAuth error format
              serverError.value = error.response.data.error_description
          } else if (error.response?.data?.errors) {
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

  // Handle 2FA OTP verification
  const handleOtpVerification = async () => {
      if (!otpCode.value || otpCode.value.length < 4) {
          otpError.value = 'Please enter a valid OTP'
          return
      }

      otpError.value = ''
      isVerifyingOtp.value = true

      try {
          const response = await authService.verifyTwoFactor({
              otp: otpCode.value,
              username: formData.value.username
          })

          // Store tokens after successful 2FA
          if (response.data) {
              authService.storeTokens(response.data)
          }

          // Get user details
          try {
              const userResponse = await authService.getUserDetails()
              localStorage.setItem('user_details', JSON.stringify(userResponse.data))
          } catch (error) {
              console.error('Could not fetch user details:', error)
          }

          // Redirect to dashboard
          router.push('/dashboard')

      } catch (error) {
          if (error.response?.data?.message) {
              otpError.value = error.response.data.message
          } else {
              otpError.value = 'Invalid OTP. Please try again.'
          }
      } finally {
          isVerifyingOtp.value = false
      }
  }

  // Resend OTP
  const handleResendOtp = async () => {
      try {
          await authService.resendLoginOtp(formData.value.username)
          successMessage.value = 'OTP has been resent to your registered contact'
          setTimeout(() => {
              successMessage.value = ''
          }, 3000)
      } catch (error) {
          serverError.value = 'Could not resend OTP. Please try again.'
      }
  }

  // Cancel 2FA and go back to login
  const cancel2FA = () => {
      requires2FA.value = false
      otpCode.value = ''
      otpError.value = ''
      successMessage.value = ''
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
          <div class="w-full px-4" style="max-width: 800px; margin: 0 auto;">
              <!-- Main Card -->
              <div class="bg-white rounded-2xl shadow-xl p-8">
                  <!-- Logo -->
                  <div class="text-center mb-8">
                      <div class="flex items-center justify-center mx-auto mb-4">
                          <img src="@/assets/zblogo.png" alt="Universal Wallet Logo" class="h-20 w-auto" />
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

                  <!-- Success Alert -->
                  <div v-if="successMessage" class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                      <p class="text-sm text-green-600">{{ successMessage }}</p>
                  </div>

                  <!-- 2FA OTP Form -->
                  <div v-if="requires2FA" class="space-y-6">
                      <div class="text-center mb-4">
                          <p class="text-sm text-gray-600">
                              Enter the OTP sent to your registered email or mobile number
                          </p>
                      </div>

                      <BaseInput
                          v-model="otpCode"
                          type="text"
                          label="One-Time Password (OTP)"
                          placeholder="Enter 6-digit OTP"
                          :icon-left="LockClosedIcon"
                          :error="otpError"
                          :required="true"
                          maxlength="6"
                      />

                      <div class="flex gap-3">
                          <BaseButton
                              @click="handleOtpVerification"
                              variant="primary"
                              size="lg"
                              :full-width="true"
                              :loading="isVerifyingOtp"
                              text="Verify OTP"
                          />
                      </div>

                      <div class="flex items-center justify-between text-sm">
                          <button
                              @click="handleResendOtp"
                              type="button"
                              class="text-primary hover:text-primary-dark font-medium"
                          >
                              Resend OTP
                          </button>
                          <button
                              @click="cancel2FA"
                              type="button"
                              class="text-gray-600 hover:text-gray-900"
                          >
                              Back to Login
                          </button>
                      </div>
                  </div>

                  <!-- Login Form -->
                  <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                      <!-- Username/Email -->
                      <BaseInput
                          v-model="formData.username"
                          type="text"
                          label="Username or Email"
                          placeholder="Enter your username or email"
                          :icon-left="UserIcon"
                          :error="errors.username"
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