<script setup>
import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import BaseInput from '../ui/BaseInput.vue'
  import BaseButton from '../ui/BaseButton.vue'
  import BaseSelect from '../ui/BaseSelect.vue'
  import authService from '@/services/authService'
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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      idNumber: '',
      address: '',
      password: '',
      confirmPassword: ''
  })

  const errors = ref({})
  const isLoading = ref(false)
  const serverError = ref('')

  

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

  const validateForm = () => {
      errors.value = {}

      if (!formData.value.firstName.trim()) errors.value.firstName = 'First name is required'
      if (!formData.value.lastName.trim()) errors.value.lastName = 'Last name is required'

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.value.email.trim()) {
          errors.value.email = 'Email is required'
      } else if (!emailRegex.test(formData.value.email)) {
          errors.value.email = 'Please enter a valid email'
      }

      if (!formData.value.phone.trim()) {
          errors.value.phone = 'Phone number is required'
      } else if (formData.value.phone.length < 10) {
          errors.value.phone = 'Please enter a valid phone number'
      }

      if (!formData.value.idNumber.trim()) errors.value.idNumber = 'ID number is required'
      if (!formData.value.address.trim()) errors.value.address = 'Address is required'
      if (!formData.value.city.trim()) errors.value.city = 'City is required'
      if (!formData.value.country) errors.value.country = 'Country is required'

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

      return Object.keys(errors.value).length === 0
  }

  const handleSubmit = async () => {
      serverError.value = ''
      if (!validateForm()) return

      isLoading.value = true

      try {
          const response = await authService.register({
              first_name: formData.value.firstName,
              last_name: formData.value.lastName,
              email: formData.value.email,
              phone: formData.value.phone,
              id_number: formData.value.idNumber,
              address: formData.value.address,
              city: formData.value.city,
              country: formData.value.country,
              password: formData.value.password,
              password_confirmation: formData.value.confirmPassword
          })

          if (response.data.token) {
              localStorage.setItem('auth_token', response.data.token)
          }

          router.push('/dashboard')
      } catch (error) {
          if (error.response?.data?.message) {
              serverError.value = error.response.data.message
          } else if (error.response?.data?.errors) {
              const backendErrors = error.response.data.errors
              Object.keys(backendErrors).forEach(key => {
                  errors.value[key] = backendErrors[key][0]
              })
          } else {
              serverError.value = 'An error occurred during registration. Please try again.'
          }
      } finally {
          isLoading.value = false
      }
  }

  const goToLogin = () => router.push('/login')
</script>
<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div class="w-full max-w-2xl mx-auto">
              <div class="bg-white rounded-2xl shadow-xl p-8">
                  <!-- Logo -->
                  <div class="text-center mb-8">
                      <div class="h-16 w-16 rounded-full flex items-center justify-center mx-auto"
                           style="background-color: var(--color-primary)">
                          <span class="text-white text-2xl font-bold">UW</span>
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

                  <!-- Registration Form -->
                  <form @submit.prevent="handleSubmit" class="space-y-6">
                      <!-- Name Fields -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <BaseInput
                              v-model="formData.firstName"
                              label="First Name"
                              placeholder="Enter your first name"
                              :icon-left="UserIcon"
                              :error="errors.firstName"
                              :required="true"
                          />
                          <BaseInput
                              v-model="formData.lastName"
                              label="Last Name"
                              placeholder="Enter your last name"
                              :icon-left="UserIcon"
                              :error="errors.lastName"
                              :required="true"
                          />
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
                              v-model="formData.phone"
                              type="tel"
                              label="Phone Number"
                              placeholder="+263 XXX XXX XXX"
                              :icon-left="PhoneIcon"
                              :error="errors.phone"
                              :required="true"
                          />
                      </div>

                      <!-- ID Number -->
                      <BaseInput
                          v-model="formData.idNumber"
                          label="ID Number"
                          placeholder="Enter your national ID number"
                          :icon-left="IdentificationIcon"
                          :error="errors.idNumber"
                          :required="true"
                          hint="Your national identification number"
                      />

                      <!-- Address -->
                      <BaseInput
                          v-model="formData.address"
                          label="Address"
                          placeholder="Street address"
                          :icon-left="MapPinIcon"
                          :error="errors.address"
                          :required="true"
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