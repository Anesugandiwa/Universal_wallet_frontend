import api from './api'

// Digital Wallet Service - All wallet operations
const digitalWalletService = {
  // ============================================
  // ACCOUNTS MANAGEMENT
  // ============================================

  // Get account by UUID
  getAccount(uuid) {
    return api.get(`/digital-wallet/cmn/v1/accounts/${uuid}`)
  },

  // Get all accounts (paginated)
  getAccounts(pagination = { page: 0, size: 20 }) {
    return api.get('/digital-wallet/cmn/v1/accounts', {
      params: pagination
    })
  },

  // Create new wallet account
  createAccount(accountData) {
    return api.post('/digital-wallet/cmn/v1/accounts', accountData)
  },

  // Update wallet account
  updateAccount(uuid, accountData) {
    return api.put(`/digital-wallet/cmn/v1/accounts/${uuid}`, accountData)
  },

  // Get account by account number
  getAccountByNumber(accountNumber) {
    return api.get(`/digital-wallet/cmn/v1/accounts/ac/${accountNumber}`)
  },

  // Get customer accounts by customer UUID
  getCustomerAccounts(customerUuid) {
    return api.get(`/digital-wallet/cmn/v1/customers/${customerUuid}/accounts`)
  },

  // Get customer accounts by CIF
  getAccountsByCif(cif) {
    return api.get(`/digital-wallet/cmn/v1/customers/${cif}/accounts/cif`)
  },

  // Get account transactions
  getAccountTransactions(accountNumber, pagination = { page: 0, size: 20 }) {
    return api.get(`/digital-wallet/cmn/v1/accounts/${accountNumber}/transactions`, {
      params: pagination
    })
  },

  // Get account statement
  getAccountStatement(uuid, pagination = { page: 0, size: 20 }) {
    return api.get(`/digital-wallet/cmn/v1/accounts/${uuid}/statement`, {
      params: pagination
    })
  },

  // Get periodic account statement
  getPeriodicStatement(uuid, startDate, endDate, pagination = { page: 0, size: 20 }) {
    return api.get(`/digital-wallet/cmn/v1/accounts/${uuid}/statement/periodic`, {
      params: {
        startDate,
        endDate,
        ...pagination
      }
    })
  },

  // ============================================
  // CUSTOMERS MANAGEMENT
  // ============================================

  // Get customer by UUID (Admin)
  getCustomer(uuid) {
    return api.get(`/digital-wallet/admin/v1/customers/${uuid}`)
  },

  // Get all customers (Admin - paginated)
  getCustomers(pagination = { page: 0, size: 20 }) {
    return api.get('/digital-wallet/admin/v1/customers', {
      params: pagination
    })
  },

  // Create new customer (Admin)
  createCustomer(customerData) {
    return api.post('/digital-wallet/admin/v1/customers', customerData)
  },

  // Update customer (Admin)
  updateCustomer(uuid, customerData) {
    return api.put(`/digital-wallet/admin/v1/customers/${uuid}`, customerData)
  },

  // Validate self-signup customer (Public)
  validateSelfSignUp(customerData) {
    return api.post('/digital-wallet/opn/v1/customers/individuals/on-boarding/validate', customerData)
  },

  // Self-onboarding (Public)
  selfOnboarding(customerData) {
    return api.post('/digital-wallet/opn/admin/v1/customers/self-onboarding', customerData)
  },

  // Link existing customer to user
  linkExistingCustomer(userUuid, customerUuid) {
    return api.post('/digital-wallet/cmn/v1/customers/existing', null, {
      params: { userUuid, customerUuid }
    })
  },

  // ============================================
  // TRANSACTIONS PROCESSING
  // ============================================

  // Execute transaction
  executeTransaction(transactionContext) {
    return api.post('/digital-wallet/cmn/v1/transactions/execute', transactionContext)
  },

  // Perform transaction on specific account
  performAccountTransaction(accountUuid, transactionContext) {
    return api.post(`/digital-wallet/cmn/v1/accounts/${accountUuid}/perform-transaction`, transactionContext)
  },

  // Get all transactions (Admin - paginated)
  getAllTransactions(pagination = { page: 0, size: 20 }) {
    return api.get('/digital-wallet/admin/v1/transactions', {
      params: pagination
    })
  },

  // Get transaction history
  getTransactionHistory(uuid) {
    return api.get(`/digital-wallet/admin/v1/transactions/${uuid}/history`)
  },

  // ============================================
  // AGENTS & MERCHANTS
  // ============================================

  // Agent cash out
  agentCashOut(agentUuid, transactionContext) {
    return api.post(`/digital-wallet/cmn/v1/agents/${agentUuid}/cash-out`, transactionContext)
  },

  // Get agent by UUID
  getAgent(uuid) {
    return api.get(`/digital-wallet/cmn/v1/agents/${uuid}`)
  },

  // Get all agents
  getAllAgents() {
    return api.get('/digital-wallet/inter-service/v1/agents')
  },

  // Get merchant by UUID
  getMerchant(uuid) {
    return api.get(`/digital-wallet/cmn/v1/merchants/${uuid}`)
  },

  // Make payment to merchant
  merchantPayment(merchantUuid, transactionContext) {
    return api.post(`/digital-wallet/cmn/v1/merchants/${merchantUuid}/make-payment`, null, {
      params: { transactionContext }
    })
  },

  // ============================================
  // TRUST ACCOUNTS (Admin)
  // ============================================

  // Get all trust accounts
  getTrustAccounts(pagination = { page: 0, size: 20 }) {
    return api.get('/digital-wallet/admin/v1/trust-accounts', {
      params: pagination
    })
  },

  // Create trust account
  createTrustAccount(trustAccountData) {
    return api.post('/digital-wallet/admin/v1/trust-accounts', trustAccountData)
  },

  // Update trust account
  updateTrustAccount(uuid, trustAccountData) {
    return api.put(`/digital-wallet/admin/v1/trust-accounts/${uuid}`, trustAccountData)
  },

  // ============================================
  // FEES & COMMISSIONS (Admin)
  // ============================================

  // Get transactional fees
  getTransactionalFees(pagination = { page: 0, size: 20 }) {
    return api.get('/digital-wallet/admin/v1/transactional-fee', {
      params: pagination
    })
  },

  // Create transactional fee
  createTransactionalFee(feeData) {
    return api.post('/digital-wallet/admin/v1/transactional-fee', feeData)
  },

  // Update transactional fee
  updateTransactionalFee(uuid, feeData) {
    return api.put(`/digital-wallet/admin/v1/transactional-fee/${uuid}`, feeData)
  },

  // Delete transactional fee
  deleteTransactionalFee(uuid) {
    return api.delete(`/digital-wallet/admin/v1/transactional-fee/${uuid}`)
  },

  // Get commissions
  getCommissions(pagination = { page: 0, size: 20 }) {
    return api.get('/digital-wallet/admin/v1/commissions', {
      params: pagination
    })
  },

  // Get all commissions (Public)
  getAllCommissions() {
    return api.get('/digital-wallet/opn/v1/commissions/all')
  },

  // Create commission
  createCommission(commissionData) {
    return api.post('/digital-wallet/admin/v1/commissions', commissionData)
  },

  // Update commission
  updateCommission(uuid, commissionData) {
    return api.put(`/digital-wallet/admin/v1/commissions/${uuid}`, commissionData)
  },

  // Delete commission
  deleteCommission(uuid) {
    return api.delete(`/digital-wallet/admin/v1/commissions/${uuid}`)
  },

  // ============================================
  // LEDGER ACCOUNTS (Admin)
  // ============================================

  // Get all ledger accounts
  getLedgerAccounts(pagination = { page: 0, size: 20 }) {
    return api.get('/digital-wallet/admin/v1/ledger-accounts', {
      params: pagination
    })
  },

  // Create ledger account
  createLedgerAccount(ledgerData) {
    return api.post('/digital-wallet/admin/v1/ledger-accounts', ledgerData)
  },

  // Update ledger account
  updateLedgerAccount(uuid, ledgerData) {
    return api.put(`/digital-wallet/admin/v1/ledger-accounts/${uuid}`, ledgerData)
  },

  // Delete ledger account
  deleteLedgerAccount(uuid) {
    return api.delete(`/digital-wallet/admin/v1/ledger-accounts/${uuid}`)
  },

  // Get ledger account by transaction type and currency
  getLedgerAccountByType(transactionType, currencyCode) {
    return api.get(`/digital-wallet/inter-service/v1/ledger-accounts/type/${transactionType}/cur/${currencyCode}`)
  },

  // Get ledger reconciliation transactions
  getLedgerReconTransactions(uuid, pagination = { page: 0, size: 20 }) {
    return api.get(`/digital-wallet/admin/v1/ledger-accounts/${uuid}/recon-transactions`, {
      params: pagination
    })
  },

  // Get reconciliation transaction by UUID
  getReconTransaction(uuid) {
    return api.get(`/digital-wallet/opn/v1/recon-transactions/${uuid}`)
  }
}

export default digitalWalletService
