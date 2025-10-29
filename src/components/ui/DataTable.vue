<template>
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <!-- Header Section -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ title }}</h3>
                    <p v-if="description" class="mt-1 text-sm text-gray-500 dark:text-gray-300">{{ description }}</p>
                </div>

                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <!-- Search Input -->
                    <div v-if="searchable" class="w-74">
                        <BaseInput
                            v-model="searchTerm"
                            :placeholder="searchPlaceholder"
                            :icon-left="MagnifyingGlassIcon"
                        />
                    </div>

                    <!-- Action Button -->
                    <BaseButton
                        v-if="actionButton"
                        :href="actionButton.href"
                        :variant="actionButton.variant || 'primary'"
                        size="sm"
                        :icon-left="actionButton.icon"
                        class="flex items-center"
                        :text="actionButton.text"
                        @click="$emit('action', { action: 'add' })"
                    >
                    </BaseButton>
                </div>
            </div>
        </div>


        <!-- Mobile Card View -->
        <div v-if="isMobile" class="md:hidden">
            <!-- Loading State -->
            <div v-if="paginatedData.length === 0 && !searchTerm" class="px-6 py-12">
                <slot name="empty-state">
                    <div class="text-center">
                        <div class="text-gray-400 dark:text-gray-500 mb-2">
                            <TableCellsIcon class="h-12 w-12 mx-auto" />
                        </div>
                        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">No data found</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-300">
                            {{ searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding some data.' }}
                        </p>
                    </div>
                </slot>
            </div>

            <!-- Mobile Cards -->
            <div v-else class="divide-y divide-gray-200 dark:divide-gray-600">
                <div
                    v-for="(item, index) in paginatedData"
                    :key="getRowKey(item, index)"
                    class="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <slot name="mobile-card" :item="item" :index="index">
                        <!-- Default Mobile Card Layout -->
                        <div class="space-y-3">
                            <!-- Primary Info -->
                            <div class="flex items-start justify-between">
                                <div class="flex-1 min-w-0">
                                    <slot
                                        :name="`cell-${columns[0].key}`"
                                        :item="item"
                                        :value="getNestedValue(item, columns[0].key)"
                                        :column="columns[0]"
                                        :index="index"
                                    >
                                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {{ getNestedValue(item, columns[0].key) || '-' }}
                                        </div>
                                    </slot>
                                </div>
                                <!-- Mobile Actions -->
                                <div v-if="hasActions" class="ml-4 flex-shrink-0">
                                    <slot name="actions" :item="item" :index="index">
                                        <div class="flex space-x-1">
                                            <IconButton
                                                v-for="action in actions.slice(0, 3)"
                                                :key="action.key"
                                                @click="handleAction(action, item)"
                                                :variant="action.variant || 'default'"
                                                size="sm"
                                                :icon="action.icon"
                                                :tooltip="action.label || action.tooltip"
                                            />
                                        </div>
                                    </slot>
                                </div>
                            </div>

                            <!-- Secondary Info Grid -->
                            <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div
                                    v-for="column in columns.slice(1, 5)"
                                    :key="column.key"
                                    class="text-sm"
                                >
                                    <div class="text-gray-500 dark:text-gray-300 text-xs">{{ column.label }}</div>
                                    <slot
                                        :name="`cell-${column.key}`"
                                        :item="item"
                                        :value="getNestedValue(item, column.key)"
                                        :column="column"
                                        :index="index"
                                    >
                                        <div class="text-gray-900 dark:text-gray-100 font-medium">
                                            <template v-if="column.type === 'badge'">
                                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                                    :class="getBadgeClass(getNestedValue(item, column.key), column.badgeColors)">
                                                    {{ getNestedValue(item, column.key) }}
                                                </span>
                                            </template>
                                            <template v-else-if="column.type === 'date'">
                                                {{ formatDate(getNestedValue(item, column.key)) }}
                                            </template>
                                            <template v-else>
                                                {{ getNestedValue(item, column.key) || '-' }}
                                            </template>
                                        </div>
                                    </slot>
                                </div>
                            </div>

                            <!-- Show more info if columns > 5 -->
                            <div v-if="columns.length > 5" class="text-xs text-gray-500 dark:text-gray-300">
                                <button @click="toggleExpanded(getRowKey(item, index))" class="hover:text-gray-700 dark:hover:text-gray-200">
                                    {{ expandedRows.has(getRowKey(item, index)) ? '▼ Show less' : '▶ Show more' }}
                                </button>

                                <div v-if="expandedRows.has(getRowKey(item, index))" class="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div
                                        v-for="column in columns.slice(5)"
                                        :key="column.key"
                                        class="text-sm"
                                    >
                                        <div class="text-gray-500 dark:text-gray-300 text-xs">{{ column.label }}</div>
                                        <slot
                                            :name="`cell-${column.key}`"
                                            :item="item"
                                            :value="getNestedValue(item, column.key)"
                                            :column="column"
                                            :index="index"
                                        >
                                            <div class="text-gray-900 dark:text-gray-100 font-medium">
                                                {{ getNestedValue(item, column.key) || '-' }}
                                            </div>
                                        </slot>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
        </div>

        <!-- Desktop Table View -->
        <div class="overflow-x-auto hidden md:block">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <!-- Table Header -->
                <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th
                            v-for="column in columns"
                            :key="column.key"
                            scope="col"
                            :class="[
                                'px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider',
                                column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-100' : '',
                                'whitespace-nowrap'
                            ]"
                            @click="column.sortable ? sort(column.key) : null"
                        >
                            <div class="flex items-center space-x-1">
                                <span class="hidden md:inline">{{ column.label }}</span>
                                <span class="md:hidden">{{ column.shortLabel || column.label.substring(0, 4) }}</span>
                                <div v-if="column.sortable" class="flex flex-col ml-1">
                                    <ChevronUpIcon
                                        :class="[
                                            'h-3 w-3',
                                            sortField === column.key && sortDirection === 'asc'
                                                ? 'text-[#0D4925]'
                                                : 'text-gray-400'
                                        ]"
                                    />
                                    <ChevronDownIcon
                                        :class="[
                                            'h-3 w-3 -mt-1',
                                            sortField === column.key && sortDirection === 'desc'
                                                ? 'text-[#0D4925]'
                                                : 'text-gray-400'
                                        ]"
                                    />
                                </div>
                            </div>
                        </th>
                        <th v-if="hasActions" scope="col" class="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            <span class="hidden md:inline">Actions</span>
                            <span class="md:hidden">Act</span>
                        </th>
                    </tr>
                </thead>

                <!-- Table Body -->
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600">
                    <tr
                        v-for="(item, index) in paginatedData"
                        :key="getRowKey(item, index)"
                        class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <td
                            v-for="column in columns"
                            :key="column.key"
                            :class="[
                                'px-3 md:px-6 py-4',
                                isMobile ? 'text-xs' : 'text-sm',
                                column.mobileHidden ? 'hidden md:table-cell' : ''
                            ]"
                        >
                            <!-- Custom slot for column content -->
                            <slot
                                :name="`cell-${column.key}`"
                                :item="item"
                                :value="getNestedValue(item, column.key)"
                                :column="column"
                                :index="index"
                            >
                                <!-- Default cell content -->
                                <div v-if="column.type === 'avatar'" class="flex items-center">
                                    <div class="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                        <span class="text-xs font-medium text-gray-700 dark:text-gray-200">
                                            {{ getInitials(getNestedValue(item, column.key) || 'U U') }}
                                        </span>
                                    </div>
                                </div>

                                <div v-else-if="column.type === 'badge'" class="inline-flex items-center px-1.5 md:px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="getBadgeClass(getNestedValue(item, column.key), column.badgeColors)">
                                    <span class="hidden md:inline">{{ getNestedValue(item, column.key) }}</span>
                                    <span class="md:hidden">{{ getNestedValue(item, column.key)?.substring(0, 3) }}</span>
                                </div>

                                <div v-else-if="column.type === 'date'" :class="['text-gray-900 dark:text-gray-100', isMobile ? 'text-xs' : 'text-sm']">
                                    {{ formatDate(getNestedValue(item, column.key)) }}
                                </div>

                                <div v-else :class="['text-gray-900 dark:text-gray-100 truncate max-w-[100px] md:max-w-none', isMobile ? 'text-xs' : 'text-sm']">
                                    {{ getNestedValue(item, column.key) || '-' }}
                                </div>
                            </slot>
                        </td>

                        <!-- Actions Column -->
                        <td v-if="hasActions" class="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <slot name="actions" :item="item" :index="index">
                                <div class="flex items-center justify-end space-x-1">
                                    <IconButton
                                        v-for="action in actions"
                                        :key="action.key"
                                        @click="handleAction(action, item)"
                                        :variant="action.variant || 'default'"
                                        size="md"
                                        :icon="action.icon"
                                        :tooltip="action.label || action.tooltip"
                                    />
                                </div>
                            </slot>
                        </td>
                    </tr>

                    <!-- Empty State -->
                    <tr v-if="paginatedData.length === 0">
                        <td :colspan="columns.length + (hasActions ? 1 : 0)" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center">
                                <slot name="empty-state">
                                    <div class="text-gray-400 dark:text-gray-500 mb-2">
                                        <TableCellsIcon class="h-12 w-12 mx-auto" />
                                    </div>
                                    <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">No data found</h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-300">
                                        {{ searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding some data.' }}
                                    </p>
                                </slot>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Section -->
        <div v-if="paginated && filteredData.length > 0" class="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700 dark:text-gray-200">
                    Showing {{ startIndex + 1 }} to {{ Math.min(startIndex + perPage, filteredData.length) }} of {{ filteredData.length }} results
                </div>

                <div class="flex items-center space-x-2">
                    <BaseButton
                        @click="previousPage"
                        :disabled="currentPage === 1"
                        variant="secondary"
                        size="sm"
                        text="Previous"
                        :icon-left="ChevronLeftIcon"
                    />

                    <span class="text-sm text-gray-700 dark:text-gray-200">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>

                    <BaseButton
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        variant="secondary"
                        size="sm"
                        text="Next"
                        :icon-right="ChevronRightIcon"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import {
    MagnifyingGlassIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    TableCellsIcon
} from '@heroicons/vue/24/solid'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import IconButton from '@/components/IconButton.vue'

const props = defineProps({
    // Data
    data: {
        type: Array,
        default: () => []
    },

    // Table Configuration
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    columns: {
        type: Array,
        required: true
    },

    // Features
    searchable: {
        type: Boolean,
        default: true
    },
    searchPlaceholder: {
        type: String,
        default: 'Search...'
    },
    paginated: {
        type: Boolean,
        default: true
    },
    perPage: {
        type: Number,
        default: 10
    },

    // Actions
    actions: {
        type: Array,
        default: () => []
    },
    actionButton: {
        type: Object,
        default: null
    },

    // Row key
    rowKey: {
        type: String,
        default: 'id'
    },

    // Has actions (can be explicitly set)
    hasActions: {
        type: Boolean,
        default: null
    }
})

const emit = defineEmits(['action'])

// Reactive data
const searchTerm = ref('')
const sortField = ref('')
const sortDirection = ref('asc')
const currentPage = ref(1)
// Mobile always shows cards - no toggle needed
const expandedRows = ref(new Set())
const isMobile = ref(false)

// Computed properties
const hasActions = computed(() => {
    // If hasActions prop is explicitly set, use it
    if (props.hasActions !== null) {
        return props.hasActions
    }
    // Otherwise, determine from actions array or if actions slot is provided
    return props.actions.length > 0 || !!getCurrentInstance()?.slots.actions
})

const filteredData = computed(() => {
    // Handle different data formats (array vs paginated object)
    let dataArray = []
    if (Array.isArray(props.data)) {
        dataArray = [...props.data]
    } else if (props.data && props.data.data) {
        // Laravel pagination object
        dataArray = [...props.data.data]
    } else if (props.data) {
        // Single object, wrap in array
        dataArray = [props.data]
    }

    // Apply search filter
    if (searchTerm.value) {
        const searchLower = searchTerm.value.toLowerCase()
        dataArray = dataArray.filter(item => {
            return props.columns.some(column => {
                const value = getNestedValue(item, column.key)
                return value && value.toString().toLowerCase().includes(searchLower)
            })
        })
    }

    // Apply sorting
    if (sortField.value) {
        dataArray.sort((a, b) => {
            const aValue = getNestedValue(a, sortField.value) || ''
            const bValue = getNestedValue(b, sortField.value) || ''

            let comparison = 0
            if (aValue < bValue) {
                comparison = -1
            } else if (aValue > bValue) {
                comparison = 1
            }

            return sortDirection.value === 'desc' ? -comparison : comparison
        })
    }

    return dataArray
})

const totalPages = computed(() => {
    return props.paginated ? Math.ceil(filteredData.value.length / props.perPage) : 1
})

const startIndex = computed(() => {
    return props.paginated ? (currentPage.value - 1) * props.perPage : 0
})

const paginatedData = computed(() => {
    if (!props.paginated) return filteredData.value

    const start = startIndex.value
    const end = start + props.perPage
    return filteredData.value.slice(start, end)
})

// Methods
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current && current[key], obj)
}

const getRowKey = (item, index) => {
    return getNestedValue(item, props.rowKey) || index
}

const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2)
}

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
}

const getBadgeClass = (value, colors = {}) => {
    const defaultColors = {
        active: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
        inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
        verified: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
        farmer: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
        buyer: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
        transporter: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
        warehouse: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    }

    const colorMap = { ...defaultColors, ...colors }
    return colorMap[value?.toLowerCase()] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

// getActionClass method removed - using BaseButton components now

const sort = (field) => {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortDirection.value = 'asc'
    }
    currentPage.value = 1
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const handleAction = (action, item) => {
    try {
        if (action && action.key) {
            emit('action', { action: action.key, item })
        } else {
            // Handle legacy action format
            emit('action', { action, item })
        }
    } catch (error) {
        console.warn('DataTable action handling error:', error)
    }
}

// Methods for mobile functionality
const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
}

const toggleExpanded = (key) => {
    if (expandedRows.value.has(key)) {
        expandedRows.value.delete(key)
    } else {
        expandedRows.value.add(key)
    }
}

// Reset page when search changes
watch(searchTerm, () => {
    currentPage.value = 1
})

// Check mobile on mount and resize
onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>
