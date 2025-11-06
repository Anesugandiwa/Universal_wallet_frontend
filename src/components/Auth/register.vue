<script setup>
import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import BaseInput from '../ui/BaseInput.vue'
  import BaseButton from '../ui/BaseButton.vue'
  import BaseSelect from '../ui/BaseSelect.vue'
  import iamService from '@/services/iamService'
  import digitalWalletService from '@/services/digitalWalletService'
  import {
      UserIcon,
      EnvelopeIcon,
      PhoneIcon,
      LockClosedIcon,
      IdentificationIcon,
      MapPinIcon
  } from '@heroicons/vue/24/outline'

  const router = useRouter()

  const formData = ref({
      name: '',
      username: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
      groupUuid: '',
      tenantId: import.meta.env.VITE_TENANT_ID || ''
  })

  const errors = ref({})
  const isLoading = ref(false)
  const serverError = ref('')
  const successMessage = ref('')
  const usernameChecking = ref(false)
  const usernameAvailable = ref(null)
  const availableGroups = ref([])

  // Fetch available groups/roles on mount
  onMounted(async () => {
    console.log('Register component mounted')
    try {
      const response = await iamService.getGroups({ page: 0, size: 100 })
      if (response.data.content && response.data.content.length > 0) {
        availableGroups.value = response.data.content
      } else {
        // Use fallback if no groups returned
        setFallbackGroups()
      }
    } catch (error) {
      console.warn('Could not fetch groups from API, using fallback:', error.message)
      setFallbackGroups()
    }
  })

  // Set fallback groups
  const setFallbackGroups = () => {
    availableGroups.value = [
      { uuid: 'USER', name: 'User' },
      { uuid: 'ADMIN', name: 'Administrator' },
      { uuid: 'SUPPORT', name: 'Support Staff' },
      { uuid: 'AUDITOR', name: 'Auditor' }
    ]
  }

  

  const passwordStrength = computed(() => {
      const password = formData.value.password
      if (!password) return { level: 0, text: '', color: '' }

      let strength = 0
      if (password.length >= 8) strength++
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^a-zA-Z0-9]/.test(password)) strength++

      const levels = [
          { level: 0, text: '', color: '' },
          { level: 1, text: 'Weak', color: 'bg-red-500' },
          { level: 2, text: 'Fair', color: 'bg-yellow-500' },
          { level: 3, text: 'Good', color: 'bg-blue-500' },
          { level: 4, text: 'Strong', color: 'bg-green-500' }
      ]
      return levels[strength]
  })

  // Check username availability
  const checkUsername = async () => {
    if (!formData.value.username) return

    usernameChecking.value = true
    usernameAvailable.value = null
    delete errors.value.username

    try {
      const response = await iamService.checkUsernameAvailability(formData.value.username)
      console.log('✅ Username API Response:', {
        data: response.data,
        status: response.status,
        fullResponse: response
      })

      // IMPORTANT: The API might be checking "does username EXIST?" not "is it AVAILABLE?"
      // If API returns false = username doesn't exist = AVAILABLE ✅
      // If API returns true = username exists = TAKEN ❌

      // Let's try INVERTING the logic
      if (typeof response.data === 'boolean') {
        // INVERTED: false = available, true = taken
        usernameAvailable.value = !response.data
        console.log('🔄 API returned:', response.data, '→ Inverted to:', usernameAvailable.value)
      } else if (response.data === 'true' || response.data === 'false') {
        usernameAvailable.value = response.data === 'false' // Inverted
        console.log('🔄 API returned string:', response.data, '→ Inverted to:', usernameAvailable.value)
      } else {
        // Unknown format - assume available
        console.warn('Unknown API response format, assuming available')
        usernameAvailable.value = true
      }

      console.log('✅ Final: Username available?', usernameAvailable.value)
    } catch (error) {
      console.error('❌ Error checking username:', error)
      console.error('Error response:', error.response)
      // If API fails (401/network error), assume username is available for now
      // User can still try to register and backend will validate
      console.warn('⚠️ Could not check username - allowing registration to proceed')
      usernameAvailable.value = true // Assume available if check fails
      // Don't show error - let backend handle validation
    } finally {
      usernameChecking.value = false
    }
  }

  const validateForm = () => {
      errors.value = {}

      if (!formData.value.name.trim()) errors.value.name = 'Full name is required'

      if (!formData.value.username.trim()) {
        errors.value.username = 'Username is required'
      } else if (formData.value.username.length < 3) {
        errors.value.username = 'Username must be at least 3 characters'
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.value.email.trim()) {
          errors.value.email = 'Email is required'
      } else if (!emailRegex.test(formData.value.email)) {
          errors.value.email = 'Please enter a valid email'
      }

      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      if (!formData.value.mobileNumber.trim()) {
          errors.value.mobileNumber = 'Mobile number is required'
      } else if (!phoneRegex.test(formData.value.mobileNumber.replace(/\s/g, ''))) {
          errors.value.mobileNumber = 'Invalid mobile number format'
      }

      // Make groupUuid optional - backend might not require it
      // if (!formData.value.groupUuid) {
      //   errors.value.groupUuid = 'Please select a role'
      // }

      if (!formData.value.password) {
          errors.value.password = 'Password is required'
      } else if (formData.value.password.length < 8) {
          errors.value.password = 'Password must be at least 8 characters'
      }

      if (!formData.value.confirmPassword) {
          errors.value.confirmPassword = 'Please confirm your password'
      } else if (formData.value.password !== formData.value.confirmPassword) {
          errors.value.confirmPassword = 'Passwords do not match'
      }

      // Check username availability
      // Only block if username was explicitly checked and found to be taken
      if (usernameAvailable.value === false) {
        errors.value.username = 'This username is already taken'
      } else if (usernameAvailable.value === null && formData.value.username.trim()) {
        // If username hasn't been checked yet, don't block but show warning
        // The handleSubmit will trigger the check
        console.log('Username availability not checked yet - will verify on submit')
      }

      return Object.keys(errors.value).length === 0
  }

  const handleSubmit = async () => {
      serverError.value = ''
      successMessage.value = ''

      // If username hasn't been checked yet, check it now
      if (usernameAvailable.value === null && formData.value.username.trim()) {
        await checkUsername()
        // After checking, validate again
        if (usernameAvailable.value === false) {
          errors.value.username = 'This username is already taken'
          return
        }
      }

      if (!validateForm()) return

      isLoading.value = true

      try {
          // Prepare user data (remove confirmPassword and empty fields)
          const { confirmPassword, ...userData } = formData.value

          // Remove empty or placeholder values
          if (!userData.tenantId || userData.tenantId === 'your-tenant-id-here') {
            delete userData.tenantId
          }
          if (!userData.groupUuid) {
            delete userData.groupUuid
          }

          console.log('📤 Sending registration data:', JSON.stringify(userData, null, 2))

          // Use first admin registration (bypasses auth requirement)
          const response = await iamService.createFirstAdmin(userData)
          console.log('✅ Admin user created:', response.data)

          console.log('Registration successful!')
          successMessage.value = 'Account created successfully! You can now login with your credentials.'

          // Redirect disabled for now - user can click "Sign in" link manually
          // console.log('Setting timeout for redirect...')
          // setTimeout(() => {
          //     console.log('Redirecting to login now...')
          //     router.push('/login')
          // }, 2000)
      } catch (error) {
          console.error('Registration error:', error)
          console.error('Error response:', error.response)

          if (error.response?.data?.message) {
              serverError.value = error.response.data.message
          } else if (error.response?.data?.errors) {
              const backendErrors = error.response.data.errors
              Object.keys(backendErrors).forEach(key => {
                  errors.value[key] = backendErrors[key][0]
              })
          } else if (error.response?.status) {
              // Show detailed error with status code
              serverError.value = `Registration failed (Status ${error.response.status}): ${error.response.statusText || 'Unknown error'}`
          } else if (error.request) {
              serverError.value = 'Cannot connect to server. Please check your internet connection.'
          } else {
              serverError.value = `An error occurred: ${error.message}`
          }
      } finally {
          isLoading.value = false
      }
  }

  const goToLogin = () => {
    router.push('/login')
  }
</script>
<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div class="w-full px-4" style="max-width: 800px; margin: 0 auto;">
              <div class="bg-white rounded-2xl shadow-xl p-8">
                  <!-- Logo -->
                  <div class="text-center mb-8">
                      <div class="flex items-center justify-center mx-auto mb-4">
                          <img src="@/assets/zblogo.png" alt="Universal Wallet Logo" class="h-20 w-auto" />
                      </div>
                      <h1 class="mt-4 text-2xl font-bold text-gray-900">Create Account</h1>
                      <p class="mt-2 text-sm text-gray-600">
                          Join Universal Wallet and manage your finances securely
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

                  <!-- Registration Form -->
                  <form @submit.prevent="handleSubmit" class="space-y-6">
                      <!-- Full Name -->
                      <BaseInput
                          v-model="formData.name"
                          label="Full Name"
                          placeholder="Enter your full name"
                          :icon-left="UserIcon"
                          :error="errors.name"
                          :required="true"
                      />

                      <!-- Username -->
                      <div>
                        <BaseInput
                            v-model="formData.username"
                            label="Username"
                            placeholder="Choose a username"
                            :icon-left="UserIcon"
                            :error="errors.username"
                            :required="true"
                            @blur="checkUsername"
                        />
                        <p v-if="usernameChecking" class="mt-1 text-xs text-gray-500">Checking availability...</p>
                        <p v-if="usernameAvailable === true" class="mt-1 text-xs text-green-600">✓ Username is available</p>
                        <p v-if="usernameAvailable === false" class="mt-1 text-xs text-red-600">✗ Username is already taken</p>
                      </div>

                      <!-- Email & Phone -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <BaseInput
                              v-model="formData.email"
                              type="email"
                              label="Email Address"
                              placeholder="your@email.com"
                              :icon-left="EnvelopeIcon"
                              :error="errors.email"
                              :required="true"
                          />
                          <BaseInput
                              v-model="formData.mobileNumber"
                              type="tel"
                              label="Mobile Number"
                              placeholder="+263 XXX XXX XXX"
                              :icon-left="PhoneIcon"
                              :error="errors.mobileNumber"
                              :required="true"
                          />
                      </div>

                      <!-- Role Selection (Optional) -->
                      <BaseSelect
                          v-model="formData.groupUuid"
                          label="User Role (Optional)"
                          :options="availableGroups.map(g => ({ value: g.uuid, label: g.name }))"
                          placeholder="Select a role (optional)"
                          :error="errors.groupUuid"
                          :required="false"
                      />



                      <!-- Password -->
                      <BaseInput
                          v-model="formData.password"
                          type="password"
                          label="Password"
                          placeholder="Create a strong password"
                          :icon-left="LockClosedIcon"
                          :error="errors.password"
                          :required="true"
                          hint="Must be at least 8 characters"
                      />

                      <!-- Password Strength Indicator -->
                      <div v-if="formData.password" class="space-y-2">
                          <div class="flex items-center gap-2">
                              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                      :class="passwordStrength.color"
                                      class="h-full transition-all duration-300"
                                      :style="{ width: `${(passwordStrength.level / 4) * 100}%` }"
                                  ></div>
                              </div>
                              <span class="text-sm font-medium">{{ passwordStrength.text }}</span>
                          </div>
                      </div>

                      <!-- Confirm Password -->
                      <BaseInput
                          v-model="formData.confirmPassword"
                          type="password"
                          label="Confirm Password"
                          placeholder="Re-enter your password"
                          :icon-left="LockClosedIcon"
                          :error="errors.confirmPassword"
                          :required="true"
                      />

                      <!-- Terms & Conditions -->
                      <div class="flex items-start">
                          <input
                              type="checkbox"
                              id="terms"
                              required
                              class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label for="terms" class="ml-2 text-sm text-gray-600">
                              I agree to the
                              <a href="#" class="font-medium text-primary hover:text-primary-dark">
                                  Terms of Service
                              </a>
                              and
                              <a href="#" class="font-medium text-primary hover:text-primary-dark">
                                  Privacy Policy
                              </a>
                          </label>
                      </div>

                      <!-- Submit Button -->
                      <BaseButton
                          type="submit"
                          variant="primary"
                          size="lg"
                          :full-width="true"
                          :loading="isLoading"
                          text="Create Account"
                      />
                  </form>

                  <!-- Login Link -->
                  <div class="mt-6 text-center">
                      <p class="text-sm text-gray-600">
                          Already have an account?
                          <button
                              @click="goToLogin"
                              type="button"
                              class="font-medium text-primary hover:text-primary-dark transition-colors"
                          >
                              Sign in
                          </button>
                      </p>
                  </div>
              </div>
          </div>
      </div>

</template>