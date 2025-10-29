<template>
    <div class="space-y-1">
        <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>

        <div class="relative">
            <div v-if="iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <component :is="iconLeft" class="h-5 w-5 text-gray-400" />
            </div>

            <input
                :id="id"
                :type="actualType"
                :placeholder="placeholder"
                :value="modelValue"
                :disabled="disabled"
                :required="required"
                :class="inputClasses"
                @input="$emit('update:modelValue', $event.target.value)"
                @blur="$emit('blur')"
                @focus="$emit('focus')"
                v-bind="$attrs"
            />

            <div v-if="iconRight || showPasswordToggle" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                    v-if="showPasswordToggle"
                    type="button"
                    @click="togglePasswordVisibility"
                    class="text-gray-400 hover:text-primary focus:outline-none transition-colors duration-200"
                >
                    <EyeIcon v-if="showPassword" class="h-5 w-5" />
                    <EyeSlashIcon v-else class="h-5 w-5" />
                </button>
                <component v-else-if="iconRight" :is="iconRight" class="h-5 w-5 text-gray-400" />
            </div>
        </div>

        <p v-if="error" class="text-sm text-red-600 flex items-center">
            <ExclamationCircleIcon class="h-4 w-4 mr-1" />
            {{ error }}
        </p>

        <p v-if="hint && !error" class="text-sm text-gray-500">
            {{ hint }}
        </p>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    id: {
        type: String,
        default: () => `input-${Math.random().toString(36).substr(2, 9)}`
    },
    label: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number],
        default: ''
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
        type: [String, Object, Function],
        default: null
    },
    iconRight: {
        type: [String, Object, Function],
        default: null
    }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const showPassword = ref(false)
const showPasswordToggle = computed(() => props.type === 'password')

const actualType = computed(() => {
    if (props.type === 'password') {
        return showPassword.value ? 'text' : 'password'
    }
    return props.type
})

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const inputClasses = computed(() => {
    const baseClasses = 'block w-full rounded-xl border-0 py-3 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset transition-all duration-200 sm:text-sm sm:leading-6'

    const stateClasses = props.error
        ? 'ring-red-300 focus:ring-red-500'
        : 'ring-gray-300 dark:ring-gray-600 focus:ring-primary hover:ring-primary/50'

    const iconClasses = props.iconLeft ? 'pl-10' : 'pl-4'
    const rightIconClasses = (props.iconRight || showPasswordToggle.value) ? 'pr-10' : 'pr-4'

    const disabledClasses = props.disabled 
        ? 'bg-gray-50 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
        : 'bg-white dark:bg-gray-800 focus:bg-primary/5'

    return [baseClasses, stateClasses, iconClasses, rightIconClasses, disabledClasses].join(' ')
})
</script>
