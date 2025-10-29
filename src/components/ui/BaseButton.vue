<template>
    <component
        :is="href? 'a' : 'button'"
        :href="href"
        :type="href? undefined : type"
        :class="buttonClasses"
        :disabled="disabled || loading"
        :aria-disabled="disabled || loading"
        :aria-label="ariaLabel || text"
        :aria-describedby="ariaDescribedby"
        :role="href ? 'link' : 'button'"
        :tabindex="(disabled || loading) ? '-1' : '0'"
        @click="href ? undefined : $emit('click')"
        v-bind = $attrs
    >
    <div 
            v-if="loading" 
            class="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white dark:border-white"
            aria-hidden="true"
        ></div>
        <component 
            :is="iconLeft" 
            v-if="iconLeft && !loading" 
            class="mr-2 h-5 w-5" 
            aria-hidden="true"
        />
        <span v-if="text">{{ text }}</span>
        <slot v-else></slot>
        <component 
            :is="iconRight" 
            v-if="iconRight && !loading" 
            class="ml-2 h-5 w-5" 
            aria-hidden="true"
        />
        
        <!-- Screen reader text for loading state -->
        <span v-if="loading" class="sr-only">Loading...</span>
    </component>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    text: { type: String, default: '' },
    href: { type: String, default: null },
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger', 'warning'].includes(value),
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
    },
    fullWidth: Boolean,
    disabled: Boolean,
    loading: Boolean,
    iconLeft: { type: [String, Object, Function], default: null },
    iconRight: { type: [String, Object, Function], default: null },
    type: {
        type: String,
        default: 'button',
        validator: (value) => ['button', 'submit', 'reset'].includes(value),
    },
    // Accessibility props
    ariaLabel: { type: String, default: null },
    ariaDescribedby: { type: String, default: null }
});

defineEmits(['click']);

const buttonClasses = computed(() => {
    const baseClasses =
        'inline-flex items-center justify-center font-semibold rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary hover:bg-primary-dark hover:cursor-pointer dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-lg hover:shadow-xl focus:ring-primary dark:focus:ring-white',
        secondary: 'bg-secondary hover:bg-secondary-dark  hover:cursor-pointer text-white dark:text-white shadow-lg hover:shadow-xl focus:ring-secondary dark:focus:ring-secondary',
        outline: 'border-2 border-primary dark:border-white  hover:cursor-pointer text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-gray-900 focus:ring-primary dark:focus:ring-white',
        ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100  hover:cursor-pointer dark:hover:bg-gray-700 focus:ring-gray-500 dark:focus:ring-gray-400',
        danger: 'bg-red-600 dark:bg-red-600 hover:bg-red-700  hover:cursor-pointer dark:hover:bg-red-700 text-white dark:text-white shadow-lg hover:shadow-xl focus:ring-red-500 dark:focus:ring-red-400',
        warning: 'bg-yellow-600 dark:bg-yellow-600 hover:bg-yellow-700 hover:cursor-pointer dark:hover:bg-yellow-700 text-white dark:text-white shadow-lg hover:shadow-xl focus:ring-yellow-500 dark:focus:ring-yellow-400',
    };

    const sizeClasses = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl',
    };

    const widthClass = props.fullWidth ? 'w-full' : '';

    return [baseClasses, variantClasses[props.variant], sizeClasses[props.size], widthClass].join(' ');
});
</script>