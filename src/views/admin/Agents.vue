<template>
  <AdminLayout page-title="Agents Management" page-subtitle="Manage cash-in/cash-out agents">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:!text-white">Agents Management</h2>
            <p class="mt-2 text-sm text-gray-600 dark:!text-gray-200">Manage cash-in/cash-out agents</p>
          </div>
          <button
            @click="openCreateDialog"
            class="inline-flex items-center px-4 py-2 bg-[#058f1f] hover:bg-[#047017] dark:bg-[#058f1f] dark:hover:bg-[#06b525] text-white font-medium rounded-lg shadow-md transition-colors duration-200"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Add Agent
          </button>
        </div>
      </div>

      

      <!-- Agents DataTable -->
      <DataTable
        title="All Agents"
        description="Manage agents who can perform cash-in and cash-out operations"
        :data="agents"
        :columns="columns"
        :actions="tableActions"
        :searchable="true"
        search-placeholder="Search by location, city..."
        :paginated="true"
        :per-page="10"
        row-key="uuid"
        @action="handleTableAction"
      >
        <!-- Custom cell for location -->
        <template #cell-location="{ item }">
          <div class="text-sm">
            <div class="font-medium text-gray-900 dark:text-white">
              {{ item.location?.description || 'N/A' }}
            </div>
            <div v-if="item.location?.mapLink" class="text-xs">
              <a
                :href="item.location.mapLink"
                target="_blank"
                class="text-[#058f1f] hover:text-[#047017] dark:text-[#06b525] dark:hover:text-[#05a020] hover:underline transition-colors"
              >
                View Map
              </a>
            </div>
          </div>
        </template>

        <!-- Custom cell for coordinates -->
        <template #cell-coordinates="{ item }">
          <div v-if="item.location?.latitude && item.location?.longitude" class="text-sm text-gray-900 dark:text-white">
            {{ item.location.latitude.toFixed(4) }}, {{ item.location.longitude.toFixed(4) }}
          </div>
          <div v-else class="text-sm text-gray-400 dark:text-gray-500">N/A</div>
        </template>

        <!-- Empty state -->
        <template #empty-state>
          <div class="text-center py-12">
            <svg class="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p class="text-gray-600 dark:text-gray-300 font-medium mb-2">No agents found</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first agent</p>
            <button
              @click="openCreateDialog"
              class="inline-flex items-center px-4 py-2 bg-[#058f1f] hover:bg-[#047017] dark:bg-[#058f1f] dark:hover:bg-[#06b525] text-white font-medium rounded-lg transition-colors"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Create First Agent
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Create/Edit Agent Dialog -->
    <div
      v-if="showDialog"
      class="fixed inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeDialog"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Dialog Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:!text-white">
            {{ editMode ? 'Edit Agent' : 'Create New Agent' }}
          </h3>
          <button
            @click="closeDialog"
            class="text-gray-400 dark:!text-gray-300 hover:text-gray-600 dark:hover:!text-white transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Dialog Body -->
        <form @submit.prevent="submitAgent" class="p-6 space-y-6">
          <!-- Customer Selection -->
          <div>
            <BaseSelect
              v-if="customers.length > 0"
              v-model="agentForm.customerUuid"
              label="Select Customer"
              :options="customers.map(c => ({
                value: c.uuid,
                label: `${c.firstName} ${c.lastName} - ${c.mobileNumber || c.email || c.nationalId || c.uuid}`
              }))"
              :required="true"
              :error="formErrors.customerUuid"
              hint="Select the customer who will become an agent"
            />
            <BaseInput
              v-else
              v-model="agentForm.customerUuid"
              label="Customer UUID"
              placeholder="Enter customer UUID manually"
              :required="true"
              :error="formErrors.customerUuid"
              hint="The UUID of the customer who will be the agent"
            />
            <p v-if="loadingCustomers" class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Loading customers...
            </p>
          </div>

          <!-- Agent Tier -->
          <BaseSelect
            v-model="agentForm.agentTiers[0]"
            label="Agent Tier"
            :options="[
              { value: 'AGENT', label: 'Agent' }
            ]"
            :required="true"
            hint="Standard agent for cash-in/cash-out operations"
          />

          <!-- Location Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:!text-white mb-4">Location Information</h4>

            <div class="space-y-4">
              <!-- Description -->
              <BaseTextarea
                v-model="agentForm.location.description"
                label="Location Description"
                placeholder="E.g., Main Street, opposite City Mall"
                :rows="2"
                :required="true"
              />

              <!-- City -->
              <BaseInput
                v-model="agentForm.location.city"
                label="City"
                placeholder="E.g., Harare"
                :required="true"
              />

              <!-- Coordinates -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BaseInput
                  v-model.number="agentForm.location.latitude"
                  type="number"
                  label="Latitude"
                  placeholder="E.g., -17.8252"
                  :required="true"
                />
                <BaseInput
                  v-model.number="agentForm.location.longitude"
                  type="number"
                  label="Longitude"
                  placeholder="E.g., 31.0335"
                  :required="true"
                />
              </div>

              <!-- Map Link -->
              <BaseInput
                v-model="agentForm.location.mapLink"
                type="url"
                label="Map Link (Optional)"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>

          <!-- Form Error -->
          <div v-if="formError" class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ formError }}</p>
          </div>

          <!-- Dialog Footer -->
          <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <BaseButton
              @click="closeDialog"
              variant="outline"
              text="Cancel"
              class="w-full sm:w-auto"
            />
            <BaseButton
              type="submit"
              variant="primary"
              :text="editMode ? 'Update Agent' : 'Create Agent'"
              :loading="submitting"
              class="w-full sm:w-auto !bg-[#058f1f] hover:!bg-[#047017] dark:!bg-[#058f1f] dark:hover:!bg-[#06b525]"
            />
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import DataTable from '@/components/ui/DataTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import registryService from '@/services/registryService'
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

// State
const agents = ref([])
const customers = ref([])
const loading = ref(false)
const loadingCustomers = ref(false)
const error = ref(null)

// Dialog State
const showDialog = ref(false)
const editMode = ref(false)
const submitting = ref(false)
const formError = ref('')
const formErrors = ref({})

// Agent Form
const agentForm = ref({
  customerUuid: '',
  agentTiers: ['AGENT'],
  location: {
    latitude: 0,
    longitude: 0,
    description: '',
    mapLink: '',
    city: ''
  }
})

// Table Columns Configuration
const columns = [
  {
    key: 'location',
    label: 'Location',
    sortable: true
  },
  {
    key: 'location.city',
    label: 'City',
    sortable: true
  },
  {
    key: 'agentTiers.0',
    label: 'Tier',
    type: 'badge',
    sortable: true,
    badgeColors: {
      'AGENT': 'bg-[#058f1f]/10 dark:bg-[#058f1f]/20 text-[#058f1f] dark:text-[#06b525] border border-[#058f1f]/20 dark:border-[#058f1f]/30',
      'SUPER_AGENT': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
    }
  },
  {
    key: 'coordinates',
    label: 'Coordinates',
    sortable: false
  }
]

// Table Actions
const tableActions = [
  {
    key: 'view',
    label: 'View',
    icon: EyeIcon,
    variant: 'default'
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: PencilIcon,
    variant: 'default'
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: TrashIcon,
    variant: 'danger'
  }
]

// Methods
const fetchAgents = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await registryService.getAllAgents()

    console.log('✅ Agents fetched:', response.data)

    // Handle response - expecting an array
    if (Array.isArray(response.data)) {
      agents.value = response.data
    } else if (response.data.content) {
      // Fallback for paginated response
      agents.value = response.data.content
    } else {
      agents.value = []
    }
  } catch (err) {
    console.error('❌ Error fetching agents:', err)
    error.value = err.response?.data?.message || 'Failed to load agents'
    agents.value = []
  } finally {
    loading.value = false
  }
}

const handleTableAction = ({ action, item }) => {
  console.log('Table action:', action, item)

  if (action === 'add') {
    openCreateDialog()
  } else if (action === 'view') {
    viewAgent(item)
  } else if (action === 'edit') {
    editAgent(item)
  } else if (action === 'delete') {
    deleteAgentConfirm(item)
  }
}

const openCreateDialog = () => {
  editMode.value = false
  resetForm()
  fetchCustomers()
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  resetForm()
}

const resetForm = () => {
  agentForm.value = {
    customerUuid: '',
    agentTiers: ['AGENT'],
    location: {
      latitude: 0,
      longitude: 0,
      description: '',
      mapLink: '',
      city: ''
    }
  }
  formError.value = ''
  formErrors.value = {}
}

const validateForm = () => {
  formErrors.value = {}

  if (!agentForm.value.customerUuid) {
    formErrors.value.customerUuid = 'Customer UUID is required'
  }

  return Object.keys(formErrors.value).length === 0
}

const submitAgent = async () => {
  if (!validateForm()) return

  submitting.value = true
  formError.value = ''

  try {
    console.log('📤 Submitting agent data:', agentForm.value)
    console.log('🔑 Auth token:', localStorage.getItem('auth_token') ? 'Present' : 'Missing')

    // Check user details and roles
    const userDetails = localStorage.getItem('user_details')
    if (userDetails) {
      const user = JSON.parse(userDetails)
      console.log('👤 Current user:', user)
      console.log('👤 User authorities:', user.authorities)
      console.log('👤 User roles:', user.roles)

      // Check if user has required permissions
      const hasAdminAuth = user.authorities?.some(auth =>
        auth.authority === 'ADMIN' ||
        auth.authority === 'AGENT_CREATE' ||
        auth.authority === 'AGENT_WRITE' ||
        auth.authority === 'REGISTRY_ADMIN'
      )
      console.log('👤 Has agent creation permission:', hasAdminAuth)

      if (!hasAdminAuth) {
        console.warn('⚠️ User may not have sufficient permissions to create agents')
        console.warn('⚠️ Required permissions: AGENT_CREATE, AGENT_WRITE, REGISTRY_ADMIN, or ADMIN')
      }
    }

    if (editMode.value) {
      await registryService.updateAgent(agentForm.value.uuid, agentForm.value)
      console.log('✅ Agent updated successfully')
    } else {
      await registryService.createAgent(agentForm.value)
      console.log('✅ Agent created successfully')
    }

    closeDialog()
    fetchAgents()
  } catch (err) {
    console.error('❌ Error submitting agent:', err)
    console.error('❌ Error response:', err.response)
    console.error('❌ Error status:', err.response?.status)
    console.error('❌ Error data:', err.response?.data)

    // Show more detailed error message
    let errorMsg = err.response?.data?.message ||
                   err.response?.data?.error ||
                   err.message ||
                   'Failed to save agent'

    // Handle 403 Forbidden specifically
    if (err.response?.status === 403) {
      errorMsg = 'Access Denied: You do not have permission to create agents. Please contact your administrator to grant you the required permissions (AGENT_CREATE, AGENT_WRITE, or REGISTRY_ADMIN).'
    }

    // Handle enum validation errors (400)
    if (err.response?.status === 400 && err.response?.data?.message?.includes('AgentTier')) {
      errorMsg = 'Invalid agent tier selected. Please try again.'
    }

    formError.value = `${errorMsg} (Status: ${err.response?.status || 'Unknown'})`
  } finally {
    submitting.value = false
  }
}

const editAgent = (agent) => {
  editMode.value = true
  agentForm.value = JSON.parse(JSON.stringify(agent))
  showDialog.value = true
}

const viewAgent = (agent) => {
  // TODO: Implement view details modal
  console.log('View agent:', agent)
  alert(`Agent Details:\nLocation: ${agent.location?.description}\nCity: ${agent.location?.city}\nTier: ${agent.agentTiers?.[0]}`)
}

const deleteAgentConfirm = async (agent) => {
  const confirmed = confirm(`Are you sure you want to delete this agent in ${agent.location?.city}?`)

  if (confirmed) {
    try {
      await registryService.deleteAgent(agent.uuid)
      console.log('✅ Agent deleted')
      fetchAgents()
    } catch (err) {
      console.error('❌ Error deleting agent:', err)
      alert(err.response?.data?.message || 'Failed to delete agent')
    }
  }
}

const fetchCustomers = async () => {
  loadingCustomers.value = true

  try {
    const response = await registryService.getCustomers({
      page: 0,
      size: 100
    })

    console.log('✅ Customers fetched:', response.data)

    // Handle paginated response
    if (response.data.content) {
      customers.value = response.data.content
    } else if (Array.isArray(response.data)) {
      customers.value = response.data
    } else {
      customers.value = []
    }
  } catch (err) {
    console.error('❌ Error fetching customers:', err)
    customers.value = []
  } finally {
    loadingCustomers.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchAgents()
})
</script>
