<template>
  <div class="w-full">
    <!-- Stepper Header -->
    <div class="flex items-center justify-between mb-8">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex-1 flex items-center"
      >
        <!-- Step Circle -->
        <div class="flex flex-col items-center flex-1">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200"
            :class="{
              'bg-[#058f1f] text-white': index < currentStep,
              'bg-[#058f1f] text-white ring-4 ring-[#058f1f]/20': index === currentStep,
              'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400': index > currentStep
            }"
          >
            <svg v-if="index < currentStep" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>

          <!-- Step Label -->
          <div class="mt-2 text-center">
            <p
              class="text-xs sm:text-sm font-medium transition-colors duration-200"
              :class="{
                'text-[#058f1f] dark:text-[#06b525]': index <= currentStep,
                'text-gray-500 dark:text-gray-400': index > currentStep
              }"
            >
              {{ step }}
            </p>
          </div>
        </div>

        <!-- Connector Line -->
        <div
          v-if="index < steps.length - 1"
          class="flex-1 h-1 mx-2 transition-all duration-200"
          :class="{
            'bg-[#058f1f]': index < currentStep,
            'bg-gray-200 dark:bg-gray-700': index >= currentStep
          }"
        ></div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="min-h-[400px]">
      <slot :name="`step-${currentStep}`"></slot>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <button
        v-if="currentStep > 0"
        @click="previousStep"
        type="button"
        class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
      <div v-else></div>

      <button
        v-if="currentStep < steps.length - 1"
        @click="nextStep"
        type="button"
        :disabled="!canProceed"
        class="inline-flex items-center px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors"
        :class="{
          'bg-[#058f1f] hover:bg-[#047017] dark:bg-[#058f1f] dark:hover:bg-[#06b525] cursor-pointer': canProceed,
          'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed': !canProceed
        }"
      >
        Next
        <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <button
        v-else
        @click="$emit('submit')"
        type="button"
        :disabled="!canProceed || loading"
        class="inline-flex items-center px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors"
        :class="{
          'bg-[#058f1f] hover:bg-[#047017] dark:bg-[#058f1f] dark:hover:bg-[#06b525] cursor-pointer': canProceed && !loading,
          'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed': !canProceed || loading
        }"
      >
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ submitText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true
  },
  canProceed: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    default: 'Submit'
  }
})

const emit = defineEmits(['update:step', 'submit'])

const currentStep = ref(0)

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1 && props.canProceed) {
    currentStep.value++
    emit('update:step', currentStep.value)
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    emit('update:step', currentStep.value)
  }
}

// Expose current step for parent component
defineExpose({
  currentStep
})
</script>
