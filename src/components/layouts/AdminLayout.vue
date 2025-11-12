<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="w-72 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <!-- Top: App Name/Branding -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <img src="@/assets/zblogo.png" alt="ZB Logo" class="h-10 w-auto" />
          <div>
            <h1 class="text-sm font-bold text-gray-900 dark:!text-white">Universal Wallet</h1>
            <p class="text-xs text-gray-500 dark:!text-gray-200">ZB Bank Digital Wallet</p>
          </div>
        </div>
      </div>

      <!-- Middle: Navigation Menu -->
      <nav class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-2">
          <li v-for="item in navigationItems" :key="item.path">
            <router-link
              :to="item.path"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              :style="isActive(item.path) ? 'background-color: #058f1f; color: white;' : ''"
              :class="isActive(item.path) ? '' : 'text-gray-900 dark:!text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'"
            >
              <component :is="item.icon" class="h-5 w-5" />
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Bottom: User Profile & Logout -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 relative">
        <button
          @click="toggleDropdown"
          class="w-full flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
        >
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style="background-color: #058f1f;">
            {{ userInitials }}
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-medium text-gray-900 dark:!text-white">{{ userName }}</p>
            <p class="text-xs text-gray-500 dark:!text-gray-200">{{ userEmail }}</p>
          </div>
          <svg
            class="h-4 w-4 text-gray-400 transition-transform"
            :class="showDropdown ? 'rotate-180' : ''"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showDropdown"
          class="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden"
        >
          <router-link
            to="/profile"
            @click="showDropdown = false"
            class="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:!text-gray-100 text-sm font-medium transition-colors"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </router-link>
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 text-sm font-medium transition-colors border-t border-gray-100 dark:border-gray-600"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:!text-white">Universal Wallet</h2>
          </div>

          <!-- Quick Info Display -->
          <div class="flex items-center gap-6">
            <div class="text-right">
              <p class="text-xs text-gray-500 dark:!text-gray-200">Total Balance</p>
              <p class="text-lg font-bold text-gray-900 dark:!text-white">{{ formatCurrency(totalBalance) }}</p>
            </div>
            <button
              @click="refreshBalance"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Refresh Balance"
            >
              <svg
                class="h-5 w-5 text-gray-600 dark:text-gray-400"
                :class="{ 'animate-spin': isRefreshing }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWalletStore } from '@/stores/wallet'
import {
  HomeIcon,
  ClockIcon,
  UserIcon,
  Cog6ToothIcon,
  UsersIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BanknotesIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  BuildingLibraryIcon,
  BuildingOfficeIcon ,
  ShoppingBagIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Dashboard'
  },
  pageSubtitle: {
    type: String,
    default: ''
  }
})

// Router
const route = useRoute()
const router = useRouter()

// Stores
const authStore = useAuthStore()
const walletStore = useWalletStore()

// Navigation items for Universal Wallet Admin Portal
const navigationItems = [
  // Core Admin Functions
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Users', path: '/users', icon: UsersIcon },
  { name: 'Customers', path: '/customers', icon: UserGroupIcon },
  { name: 'Transactions', path: '/transactions', icon: ClockIcon },

  // Financial Management
  { name: 'Fees & Charges', path: '/fees', icon: BanknotesIcon },
  { name: 'Commissions', path: '/commissions', icon: BanknotesIcon },

  // Agents & Merchants (Optional)
  { name: 'Agents', path: '/agents', icon: BuildingStorefrontIcon },
  { name: 'Merchants', path: '/merchants', icon: ShoppingBagIcon },
  {name: 'Banks', path: '/banks', icon: BuildingLibraryIcon},
  {name: 'Branches', path: '/branches', icon: BuildingOfficeIcon },

  // Reports & Monitoring
  { name: 'Reports', path: '/reports', icon: ChartBarIcon },
  { name: 'Audit Logs', path: '/audit', icon: DocumentTextIcon },

  // System Configuration
  { name: 'Notifications', path: '/notifications', icon: BellIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon }
]

// User data from auth store
const userName = computed(() => authStore.user?.name || 'User')
const userEmail = computed(() => authStore.user?.email || '')
const userInitials = computed(() => {
  const name = userName.value
  const names = name.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

// Wallet data from store
const totalBalance = computed(() => walletStore.totalBalance || 0)
const isRefreshing = ref(false)

// Dropdown state
const showDropdown = ref(false)

// Methods
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const isActive = (path) => {
  return route.path === path
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

const refreshBalance = async () => {
  isRefreshing.value = true
  await walletStore.fetchWallets()
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}

const handleLogout = async () => {
  // Close dropdown
  showDropdown.value = false

  // Logout using auth store
  await authStore.logout()

  // Redirect to login
  router.push('/login')
}
</script>