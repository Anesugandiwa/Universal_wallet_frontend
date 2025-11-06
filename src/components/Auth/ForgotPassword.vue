<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import iamService from '@/services/iamService'
import { UserIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const username = ref('')
const errors = ref({})
const isLoading = ref(false)
const serverError = ref('')
const successMessage = ref('')

// Validate form
const validateForm = () => {
  errors.value = {}

  if (!username.value.trim()) {
    errors.value.username = 'Username or email is required'
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
    console.log('Requesting password reset for:', username.value)

    const response = await iamService.forgotPassword(username.value)

    console.log('✅ Forgot password response:', response.data)

    successMessage.value = 'Password reset instructions have been sent to your registered email/mobile number. Please check your inbox.'

    // After 3 seconds, redirect to reset password page with username
    setTimeout(() => {
      router.push({
        name: 'ResetPassword',
        query: { username: username.value }
      })
    }, 3000)

  } catch (error) {
    console.error('❌ Forgot password error:', error)

    if (error.response?.data?.message) {
      serverError.value = error.response.data.message
    } else if (error.response?.status === 404) {
      serverError.value = 'User not found. Please check your username/email.'
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
    <div class="w-full max-w-md" style="max-width: 800px; margin: 0 auto;">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mx-auto mb-4">
            <img src="@/assets/zblogo.png" alt="Universal Wallet Logo" class="h-20 w-auto" />
          </div>
          <h1 class="mt-4 text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p class="mt-2 text-sm text-gray-600">
            Enter your username or email to receive password reset instructions
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

        <!-- Forgot Password Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Username/Email Input -->
          <BaseInput
            v-model="username"
            label="Username or Email"
            placeholder="Enter your username or email"
            :icon-left="UserIcon"
            :error="errors.username"
            :required="true"
          />

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :full-width="true"
            :loading="isLoading"
            text="Send Reset Instructions"
          />
        </form>

        <!-- Back to Login Link -->
        <div class="mt-6">
          <button
            @click="goToLogin"
            type="button"
            class="w-full flex items-center justify-center text-sm text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
