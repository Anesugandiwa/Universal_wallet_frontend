<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import iamService from '@/services/iamService'
import { UserIcon, LockClosedIcon, KeyIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

const formData = ref({
  username: '',
  otp: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = ref({})
const isLoading = ref(false)
const serverError = ref('')
const successMessage = ref('')

// Password strength indicator
const passwordStrength = computed(() => {
  const password = formData.value.newPassword
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

// Pre-fill username from query params if available
onMounted(() => {
  if (route.query.username) {
    formData.value.username = route.query.username
  }
})

// Validate form
const validateForm = () => {
  errors.value = {}

  if (!formData.value.username.trim()) {
    errors.value.username = 'Username or email is required'
  }

  if (!formData.value.otp.trim()) {
    errors.value.otp = 'OTP code is required'
  } else if (formData.value.otp.length < 4) {
    errors.value.otp = 'OTP code must be at least 4 characters'
  }

  if (!formData.value.newPassword) {
    errors.value.newPassword = 'New password is required'
  } else if (formData.value.newPassword.length < 8) {
    errors.value.newPassword = 'Password must be at least 8 characters'
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (formData.value.newPassword !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
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
    console.log('Resetting password for:', formData.value.username)

    const resetData = {
      username: formData.value.username,
      otp: formData.value.otp,
      newPassword: formData.value.newPassword
    }

    const response = await iamService.resetPassword(resetData)

    console.log('✅ Password reset response:', response.data)

    successMessage.value = 'Password reset successful! Redirecting to login...'

    // Clear form
    formData.value = {
      username: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    }

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (error) {
    console.error('❌ Reset password error:', error)

    if (error.response?.data?.message) {
      serverError.value = error.response.data.message
    } else if (error.response?.status === 400) {
      serverError.value = 'Invalid OTP code or password. Please check and try again.'
    } else if (error.response?.status === 404) {
      serverError.value = 'User not found. Please check your username.'
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

const goToForgotPassword = () => {
  router.push('/forgot-password')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md" style="max-width: 800px; margin: 0 auto;">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mx-auto mb-4">
            <img src="@/assets/zblogo.png" alt="Universal Wallet Logo" class="h-20 w-auto" />
          </div>
          <h1 class="mt-4 text-2xl font-bold text-gray-900">Reset Password</h1>
          <p class="mt-2 text-sm text-gray-600">
            Enter the OTP code sent to your email/mobile and create a new password
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

        <!-- Reset Password Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Username/Email Input -->
          <BaseInput
            v-model="formData.username"
            label="Username or Email"
            placeholder="Enter your username or email"
            :icon-left="UserIcon"
            :error="errors.username"
            :required="true"
          />

          <!-- OTP Code Input -->
          <BaseInput
            v-model="formData.otp"
            label="OTP Code"
            placeholder="Enter the OTP code"
            :icon-left="KeyIcon"
            :error="errors.otp"
            :required="true"
            hint="Check your email or SMS for the OTP code"
          />

          <!-- New Password -->
          <BaseInput
            v-model="formData.newPassword"
            type="password"
            label="New Password"
            placeholder="Create a strong password"
            :icon-left="LockClosedIcon"
            :error="errors.newPassword"
            :required="true"
            hint="Must be at least 8 characters"
          />

          <!-- Password Strength Indicator -->
          <div v-if="formData.newPassword" class="space-y-2">
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
            label="Confirm New Password"
            placeholder="Re-enter your password"
            :icon-left="LockClosedIcon"
            :error="errors.confirmPassword"
            :required="true"
          />

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :full-width="true"
            :loading="isLoading"
            text="Reset Password"
          />
        </form>

        <!-- Links -->
        <div class="mt-6 space-y-3">
          <div class="text-center">
            <button
              @click="goToForgotPassword"
              type="button"
              class="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Didn't receive OTP? Request again
            </button>
          </div>
          <div class="text-center">
            <button
              @click="goToLogin"
              type="button"
              class="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
