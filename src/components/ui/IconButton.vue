<template>
    <button
        :class="buttonClasses"
        :disabled="disabled || loading"
        :title="tooltip"
        class="cursor-pointer"
        @click="$emit('click')"
        v-bind="$attrs"
    >
        <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        <component :is="icon" v-else :class="iconClasses" />
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    icon: {
        type: [String, Object, Function],
        required: true
    },
    variant: {
        type: String,
        default: 'default',
        validator: (value) =>
            ['default', 'primary', 'secondary', 'success', 'warning', 'danger'].includes(value)
    },
    size: {
        type: String,
        default: 'sm',
        validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    tooltip: {
        type: String,
        default: ''
    }
})

defineEmits(['click'])

const buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
        default: 'text-gray-900 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500',
        primary: 'text-white bg-primary hover:bg-primary-dark focus:ring-primary',
        secondary: 'text-white bg-secondary hover:bg-secondary-dark focus:ring-secondary',
        success: 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 focus:ring-green-500',
        warning: 'text-yellow-800 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/40 focus:ring-yellow-500',
        danger: 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 focus:ring-red-500'
    }

    const sizeClasses = {
        xs: 'p-1',
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-3'
    }

    return [
        baseClasses,
        variantClasses[props.variant],
        sizeClasses[props.size]
    ].join(' ')
})

const iconClasses = computed(() => {
    const sizeClasses = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    }

    return sizeClasses[props.size]
})
</script>
