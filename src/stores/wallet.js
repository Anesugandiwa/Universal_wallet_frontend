import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// TODO: Import wallet service when created
// import walletService from '@/services/walletService'

export const useWalletStore = defineStore('wallet', () => {
  const wallets = ref([])
  const currentWallet = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed: Total balance across all wallets
  const totalBalance = computed(() => {
    if (!wallets.value || wallets.value.length === 0) return 0
    return wallets.value.reduce((sum, wallet) => sum + (wallet.balance || 0), 0)
  })

  // Computed: Active wallets count
  const activeWalletsCount = computed(() => {
    return wallets.value.filter(w => w.status === 'active').length
  })

  // Action: Fetch all wallets for current user
  async function fetchWallets() {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await walletService.getWallets()
      // wallets.value = response.data

      // Mock data for now
      wallets.value = [
        {
          id: '1',
          name: 'Main Wallet',
          type: 'USD',
          balance: 1250.50,
          status: 'active'
        },
        {
          id: '2',
          name: 'Savings',
          type: 'USD',
          balance: 5000.00,
          status: 'active'
        }
      ]

      loading.value = false
      return wallets.value
    } catch (err) {
      loading.value = false
      error.value = err.response?.data?.message || 'Failed to fetch wallets'
      console.error('Fetch wallets error:', err)
      throw err
    }
  }

  // Action: Get wallet by ID
  async function getWalletById(walletId) {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await walletService.getWalletById(walletId)
      // currentWallet.value = response.data

      // Mock data
      currentWallet.value = wallets.value.find(w => w.id === walletId) || null

      loading.value = false
      return currentWallet.value
    } catch (err) {
      loading.value = false
      error.value = err.response?.data?.message || 'Failed to fetch wallet'
      throw err
    }
  }

  // Action: Create new wallet
  async function createWallet(walletData) {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await walletService.createWallet(walletData)
      // const newWallet = response.data

      // Mock data
      const newWallet = {
        id: Date.now().toString(),
        ...walletData,
        balance: 0,
        status: 'active',
        createdAt: new Date().toISOString()
      }

      wallets.value.push(newWallet)

      loading.value = false
      return newWallet
    } catch (err) {
      loading.value = false
      error.value = err.response?.data?.message || 'Failed to create wallet'
      throw err
    }
  }

  // Action: Update wallet
  async function updateWallet(walletId, walletData) {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await walletService.updateWallet(walletId, walletData)

      // Mock update
      const index = wallets.value.findIndex(w => w.id === walletId)
      if (index !== -1) {
        wallets.value[index] = { ...wallets.value[index], ...walletData }
      }

      loading.value = false
      return wallets.value[index]
    } catch (err) {
      loading.value = false
      error.value = err.response?.data?.message || 'Failed to update wallet'
      throw err
    }
  }

  // Action: Set current/active wallet
  function setCurrentWallet(wallet) {
    currentWallet.value = wallet
    localStorage.setItem('currentWallet', JSON.stringify(wallet))
  }

  // Initialize current wallet from localStorage
  function initializeWallet() {
    const storedWallet = localStorage.getItem('currentWallet')
    if (storedWallet) {
      try {
        currentWallet.value = JSON.parse(storedWallet)
      } catch (err) {
        console.error('Failed to parse stored wallet:', err)
        localStorage.removeItem('currentWallet')
      }
    }
  }

  // Initialize on store creation
  initializeWallet()

  return {
    // State
    wallets,
    currentWallet,
    loading,
    error,

    // Getters
    totalBalance,
    activeWalletsCount,

    // Actions
    fetchWallets,
    getWalletById,
    createWallet,
    updateWallet,
    setCurrentWallet,
    initializeWallet
  }
})
