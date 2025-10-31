<template>
  <AdminLayout
    page-title="Dashboard"
    page-subtitle="Overview of your Universal Digital Wallet"
  >
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <!-- Total Users -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.totalUsers || '0' }}
                  </div>
                  <span class="ml-2 text-sm font-medium text-green-600">+12%</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Transactions -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Today's Transactions</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.todayTransactions || '0' }}
                  </div>
                  <span class="ml-2 text-sm font-medium text-green-600">+8%</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Volume -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Volume</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ${{ formatNumber(stats.transactionVolume) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Wallets -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Wallets</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.activeWallets || '0' }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Table -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Recent Transactions
          </h3>
          <router-link
            to="/transactions"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all →
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="recentTransactions.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  No transactions yet
                </td>
              </tr>
              <tr v-for="transaction in recentTransactions" :key="transaction.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                  #{{ transaction.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ transaction.user }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ transaction.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ${{ transaction.amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(transaction.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ transaction.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ transaction.date }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'

const stats = ref({
  totalUsers: 0,
  todayTransactions: 0,
  transactionVolume: 0,
  activeWallets: 0
})

const recentTransactions = ref([])

onMounted(async () => {
  // TODO: Fetch dashboard stats from API
  // For now, using mock data
  stats.value = {
    totalUsers: 1234,
    todayTransactions: 89,
    transactionVolume: 123456.78,
    activeWallets: 987
  }

  // TODO: Fetch recent transactions from API
  recentTransactions.value = [
    { id: 'TXN001', user: 'John Doe', type: 'Transfer', amount: '100.00', status: 'completed', date: '2025-10-31 10:30' },
    { id: 'TXN002', user: 'Jane Smith', type: 'Deposit', amount: '250.50', status: 'pending', date: '2025-10-31 10:15' },
    { id: 'TXN003', user: 'Mike Johnson', type: 'Withdrawal', amount: '75.25', status: 'completed', date: '2025-10-31 09:45' },
    { id: 'TXN004', user: 'Sarah Wilson', type: 'Transfer', amount: '500.00', status: 'completed', date: '2025-10-31 09:30' },
    { id: 'TXN005', user: 'David Brown', type: 'Deposit', amount: '1000.00', status: 'failed', date: '2025-10-31 09:00' }
  ]
})

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
