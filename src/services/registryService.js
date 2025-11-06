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

  // Get all customers (for selecting agent's customer)
  getCustomers(pagination = { page: 0, size: 20 }) {
    return api.get('/registry/admin/v1/customers', {
      params: pagination
    })
  },

  // Search customer by identifier
  searchCustomerByIdentifier(identifier) {
    return api.get('/registry/admin/v1/customers/identifier-search', {
      params: { identifier }
    })
  }
}

export default registryService
