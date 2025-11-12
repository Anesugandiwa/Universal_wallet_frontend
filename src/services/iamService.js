import api from './api'

// IAM Service for User Management
const iamService = {
  // Check if username/email is available
  checkUsernameAvailability(username) {
    return api.get('/iam/opn/v1/userid/validate', {
      params: { username }
    })
  },

  // Create new user (Registration - requires admin auth)
  createUser(userData) {
    return api.post('/iam/cmn/v1/users', userData)
  },

  // Self-registration (public - no auth required)

  selfRegister(userData) {
    return api.post('/iam/opn/v1/users/register', userData)
  },

  // First admin registration (bypasses auth for initial setup)
  createFirstAdmin(userData) {
    return api.post('/iam/cmn/v1/users', userData, {
      headers: {
        'X-First-Admin-Registration': 'true'
      }
    })
  },

  // Get all users (paginated)
  getUsers(pagination) {
    return api.get('/iam/cmn/v1/users', {
      params: pagination
    })
  },

  // Get user by UUID
  getUserById(uuid) {
    return api.get(`/iam/cmn/v1/users/${uuid}`)
  },

  // Get current user profile
  getCurrentUserProfile() {
    return api.get('/iam/cmn/v1/users/profile')
  },

  // Update user
  updateUser(uuid, userData) {
    return api.put(`/iam/cmn/v1/users/${uuid}`, userData)
  },

  // Delete user
  deleteUser(uuid) {
    return api.delete(`/iam/cmn/v1/users/${uuid}`)
  },

  // Soft delete user
  softDeleteUser(uuid) {
    return api.patch(`/iam/cmn/v1/users/${uuid}/delete`)
  },

  // Change user status (activate/deactivate)
  changeUserStatus(uuid, active) {
    return api.post(`/iam/cmn/v1/users/${uuid}/status`, { active })
  },

  // Get users by status
  getUsersByStatus(status) {
    return api.get(`/iam/cmn/v1/users/status/${status}`)
  },

  // Assign user to group/role
  assignUserToGroup(uuid, groupUuid) {
    return api.post(`/iam/cmn/v1/users/${uuid}/group`, null, {
      params: { groupUuid }
    })
  },

  // Get user authorities/permissions
  getUserAuthorities(uuid) {
    return api.get(`/iam/cmn/v1/users/${uuid}/authorities`)
  },

  // Add authorities to user
  addUserAuthorities(uuid, authoritiesUuid) {
    return api.post(`/iam/cmn/v1/users/${uuid}/authorities`, {
      authoritiesUuid
    })
  },

  // Remove authorities from user
  removeUserAuthorities(uuid, authoritiesUuid) {
    return api.patch(`/iam/cmn/v1/users/${uuid}/authorities`, {
      authoritiesUuid
    })
  },

  // Update user password
  updatePassword(uuid, passwordData) {
    return api.put(`/iam/cmn/v1/users/${uuid}/password`, passwordData)
  },

  // Forgot password
  forgotPassword(username) {
    return api.post('/iam/opn/v1/forgot-password', null, {
      params: { username }
    })
  },

  // Reset password with OTP
  resetPassword(resetData) {
    return api.post('/iam/opn/v1/reset-password', resetData)
  },

  // Upload profile picture
  uploadProfilePicture(userUuid, fileName, file) {
    const formData = new FormData()
    formData.append('file', file)

    return api.post(`/iam/cmn/v1/users/${userUuid}/profile-picture`, formData, {
      params: { fileName },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Update mobile number
  updateMobileNumber(uuid, mobileNumber) {
    return api.put(`/iam/admin/v1/users/${uuid}/mobile-number`, null, {
      params: { mobileNumber }
    })
  },

  // Get password policy
  getPasswordPolicy() {
    return api.get('/iam/admin/v1/password-policy')
  },

  // Update password policy
  updatePasswordPolicy(policyData) {
    return api.put('/iam/admin/v1/password-policy', policyData)
  },

  // Group Management
  createGroup(groupData) {
    return api.post('/iam/cmn/v1/groups', groupData)
  },

  getGroups(pagination) {
    return api.get('/iam/cmn/v1/groups', {
      params: pagination
    })
  },

  // Get all groups (no pagination)
  getAllGroups() {
    return api.get('/iam/cmn/v1/groups/all')
  },

  updateGroup(uuid, groupData) {
    return api.put(`/iam/cmn/v1/groups/${uuid}`, groupData)
  },

  getGroupAuthorities(uuid) {
    return api.get(`/iam/cmn/v1/groups/${uuid}/authorities`)
  },

  addGroupAuthorities(uuid, groupUuid, authoritiesUuid) {
    return api.post(`/iam/cmn/v1/groups/${uuid}/authorities`, {
      groupUuid,
      authoritiesUuid
    })
  },

  removeGroupAuthorities(uuid, groupUuid, authoritiesUuid) {
    return api.patch(`/iam/cmn/v1/groups/${uuid}/authorities`, {
      groupUuid,
      authoritiesUuid
    })
  }
}

export default iamService
