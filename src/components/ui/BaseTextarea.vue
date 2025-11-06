<template>
    <div class="space-y-1">
        <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:!text-gray-200">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>

        <div class="relative">
            <textarea
                :id="id"
                :placeholder="placeholder"
                :value="modelValue"
                :disabled="disabled"
                :required="required"
                :rows="rows"
                :class="textareaClasses"
                @input="$emit('update:modelValue', $event.target.value)"
                @blur="$emit('blur')"
                @focus="$emit('focus')"
                v-bind="$attrs"
            ></textarea>
        </div>

        <p v-if="error" class="text-sm text-red-600 flex items-center">
            <ExclamationCircleIcon class="h-4 w-4 mr-1" />
            {{ error }}
        </p>

        <p v-if="hint && !error" class="text-sm text-gray-500 dark:!text-gray-300">
            {{ hint }}
        </p>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    id: {
        type: String,
        default: () => `textarea-${Math.random().toString(36).substr(2, 9)}`
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    modelValue: {
        type: String,
        default: ''
    },
    rows: {
        type: Number,
        default: 3
    },
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ''
    },
    hint: {
        type: String,
        default: ''
    }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const textareaClasses = computed(() => {
    const baseClasses = 'block w-full rounded-xl border-0 py-3 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset transition-all duration-200 sm:text-sm sm:leading-6 resize-vertical'

    const stateClasses = props.error
        ? 'ring-red-300 focus:ring-red-500'
        : 'ring-gray-300 dark:ring-gray-600 focus:ring-primary'

    const disabledClasses = props.disabled 
        ? 'bg-gray-50 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
        : 'bg-white dark:bg-gray-800'

    return [baseClasses, stateClasses, disabledClasses].join(' ')
})
</script>