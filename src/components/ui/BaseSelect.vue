<template>
    <div class="space-y-1">
        <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:!text-gray-200">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>

        <div class="relative">
            <div v-if="iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <component :is="iconLeft" class="h-5 w-5 text-gray-400" />
            </div>

            <select
                :id="id"
                :value="modelValue"
                :disabled="disabled"
                :required="required"
                :class="selectClasses"
                @change="$emit('update:modelValue', $event.target.value)"
                @blur="$emit('blur')"
                @focus="$emit('focus')"
                v-bind="$attrs"
            >
                <option v-if="placeholder" value="" class="text-gray-400">{{ placeholder }}</option>
                <option
                    v-for="option in options"
                    :key="getOptionValue(option)"
                    :value="getOptionValue(option)"
                    class="text-gray-900 dark:text-white"
                >
                    {{ getOptionLabel(option) }}
                </option>
            </select>

            <!-- Custom dropdown arrow -->
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <component v-if="iconRight" :is="iconRight" class="h-5 w-5 text-gray-400" />
                <ChevronDownIcon v-else class="h-5 w-5 text-gray-400" />
            </div>
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
import { ExclamationCircleIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    id: {
        type: String,
        default: () => `select-${Math.random().toString(36).substr(2, 9)}`
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
        type: [String, Number],
        default: ''
    },
    options: {
        type: Array,
        default: () => []
    },
    optionValue: {
        type: String,
        default: null
    },
    optionLabel: {
        type: String,
        default: null
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
    },
    iconLeft: {
        type: [String, Object],
        default: null
    },
    iconRight: {
        type: [String, Object],
        default: null
    }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const getOptionValue = (option) => {
    if (props.optionValue && typeof option === 'object') {
        return option[props.optionValue]
    }
    return typeof option === 'object' ? option.value || option.id : option
}

const getOptionLabel = (option) => {
    if (props.optionLabel && typeof option === 'object') {
        return option[props.optionLabel]
    }
    return typeof option === 'object' ? option.label || option.name || option.text : option
}

const selectClasses = computed(() => {
    const baseClasses = [
        // Layout & Typography
        'block w-full rounded-xl border-0 py-3 text-gray-900 dark:text-white',
        'shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset',
        'transition-all duration-200 sm:text-sm sm:leading-6',
        // Remove browser default styling
        'appearance-none cursor-pointer',
        // Ensure consistent font
        'font-medium'
    ]

    // State-based ring colors
    const stateClasses = props.error
        ? ['ring-red-300 dark:ring-red-500/50 focus:ring-red-500']
        : ['ring-gray-300 dark:ring-gray-600 focus:ring-primary hover:ring-primary/50']

    // Padding based on icons
    const leftPadding = props.iconLeft ? 'pl-10' : 'pl-4'
    const rightPadding = 'pr-10' // Always account for dropdown arrow or custom icon

    // Background and disabled states
    const bgClasses = props.disabled 
        ? [
            'bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400',
            'cursor-not-allowed opacity-50'
          ]
        : [
            'bg-white dark:bg-gray-800',
            'hover:bg-gray-50 dark:hover:bg-gray-700/50',
            'focus:bg-primary/5 dark:focus:bg-primary/10'
          ]

    return [
        ...baseClasses,
        ...stateClasses,
        leftPadding,
        rightPadding,
        ...bgClasses
    ].join(' ')
})
</script>
