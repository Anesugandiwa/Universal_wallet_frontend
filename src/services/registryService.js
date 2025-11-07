import api from './api'

// Registry Service - Information Registry API
const registryService = {
  // ============================================
  // AGENTS MANAGEMENT
  // ============================================

  // Create new agent (Admin)
  createAgent(agentData) {
    return api.post('/registry/admin/v1/agents', agentData)
  },

  // Get all agents (Admin - paginated)
  getAgents(pagination = { page: 0, size: 20 }) {
    return api.get('/registry/admin/v1/agents', {
      params: pagination
    })
  },

  // Get agent by UUID (Admin)
  getAgent(uuid) {
    return api.get(`/registry/admin/v1/agents/${uuid}`)
  },

  // Update agent (Admin)
  updateAgent(uuid, agentData) {
    return api.put(`/registry/admin/v1/agents/${uuid}`, agentData)
  },

  // Delete agent (Admin)
  deleteAgent(uuid) {
    return api.delete(`/registry/admin/v1/agents/${uuid}`)
  },

  // Get all agents (Common - no pagination)
  getAllAgents() {
    return api.get('/registry/cmn/v1/agents/all')
  },

  // Get agent tiers/classifications
  getAgentTiers() {
    return api.get('/registry/cmn/v1/agent-tiers')
  },

  // ============================================
  // CUSTOMERS MANAGEMENT (Registry)
  // ============================================

  // Create new customer (Admin)
  createCustomer(customerData) {
    return api.post('/registry/admin/v1/customers', customerData)
  },

  // Get all customers (Admin - paginated)
  getCustomers(pagination = { page: 0, size: 20 }) {
    return api.get('/registry/admin/v1/customers', {
      params: pagination
    })
  },

  // Get customer by UUID (Admin)
  getCustomer(uuid) {
    return api.get(`/registry/admin/v1/customers/${uuid}`)
  },

  // Update customer (Admin)
  updateCustomer(uuid, customerData) {
    return api.put(`/registry/admin/v1/customers/${uuid}`, customerData)
  },

  // Delete customer (Admin)
  deleteCustomer(uuid) {
    return api.delete(`/registry/admin/v1/customers/${uuid}`)
  },

  // Search customer by identifier
  searchCustomerByIdentifier(identifier) {
    return api.get('/registry/admin/v1/customers/identifier-search', {
      params: { identifier }
    })
  },

  // ============================================
  // BANKS MANAGEMENT (Registry)
  // ============================================

  // Create new bank (Admin)
  createBank(bankData) {
    return api.post('/registry/admin/v1/banks', bankData)
  },

  // Get all banks (Admin - paginated)
  getBanks(pagination = { page: 0, size: 20 }) {
    return api.get('/registry/admin/v1/banks', {
      params: pagination
    })
  },

  // Get bank by UUID (Admin)
  getBank(uuid) {
    return api.get(`/registry/admin/v1/banks/${uuid}`)
  },

  // Update bank (Admin)
  updateBank(uuid, bankData) {
    return api.put(`/registry/admin/v1/banks/${uuid}`, bankData)
  },

  // Delete bank (Admin)
  deleteBank(uuid) {
    return api.delete(`/registry/admin/v1/banks/${uuid}`)
  }
}

export default registryService
