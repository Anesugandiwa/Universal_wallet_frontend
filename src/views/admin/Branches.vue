<template>
  <AdminLayout page-title="Branches Management" page-subtitle="Manage bank branches and locations">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:!text-white">Branches Management</h2>
            <p class="mt-2 text-sm text-gray-600 dark:!text-gray-200">Manage bank branches and their locations</p>
          </div>
          <button
            @click="openCreateDialog"
            class="inline-flex items-center px-4 py-2 bg-[#058f1f] hover:bg-[#047017] dark:bg-[#058f1f] dark:hover:bg-[#06b525] text-white font-medium rounded-lg shadow-md transition-colors duration-200"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Add Branch
          </button>
        </div>
      </div>

      <!-- Branches DataTable -->
      <DataTable
        title="All Branches"
        description="View and manage bank branch locations"
        :data="branches"
        :columns="columns"
        :actions="tableActions"
        :searchable="true"
        search-placeholder="Search by branch name, code, city..."
        :paginated="true"
        :per-page="10"
        row-key="uuid"
        @action="handleTableAction"
      >
        <!-- Custom cell for bank -->
        <template #cell-bank="{ item }">
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ item.bankName || 'N/A' }}
          </span>
        </template>

        <!-- Custom cell for location -->
        <template #cell-location="{ item }">
          <div class="text-sm">
            <div class="font-medium text-gray-900 dark:text-white">
              {{ item.location?.description || 'N/A' }}
            </div>
            <div v-if="item.location?.city" class="text-xs text-gray-500 dark:text-gray-400">
              {{ item.location.city }}
            </div>
            <div v-if="item.location?.mapLink" class="text-xs mt-1">
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

        <!-- Custom cell for default bank -->
        <template #cell-forDefaultBank="{ item }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-[#058f1f]/10 dark:bg-[#058f1f]/20 text-[#058f1f] dark:text-[#06b525] border border-[#058f1f]/20 dark:border-[#058f1f]/30': item.forDefaultBank,
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600': !item.forDefaultBank
            }"
          >
            {{ item.forDefaultBank ? 'Yes' : 'No' }}
          </span>
        </template>

        <!-- Custom cell for lenient -->
        <template #cell-lenient="{ item }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800': item.lenient,
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600': !item.lenient
            }"
          >
            {{ item.lenient ? 'Yes' : 'No' }}
          </span>
        </template>

        <!-- Empty state -->
        <template #empty-state>
          <div class="text-center py-12">
            <svg class="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-gray-600 dark:text-gray-300 font-medium mb-2">No branches found</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first branch</p>
            <button
              @click="openCreateDialog"
              class="inline-flex items-center px-4 py-2 bg-[#058f1f] hover:bg-[#047017] dark:bg-[#058f1f] dark:hover:bg-[#06b525] text-white font-medium rounded-lg transition-colors"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Add First Branch
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Create/Edit Branch Dialog -->
    <div
      v-if="showDialog"
      class="fixed inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeDialog"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Dialog Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:!text-white">
            {{ editMode ? 'Edit Branch' : 'Add New Branch' }}
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
        <form @submit.prevent="submitBranch" class="p-6 space-y-6">
          <!-- Basic Information Section -->
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:!text-white">Basic Information</h4>

            <!-- Branch Name -->
            <BaseInput
              v-model="branchForm.name"
              label="Branch Name"
              placeholder="e.g., Harare Main Branch"
              :required="true"
              :error="formErrors.name"
            />

            <!-- Branch Code -->
            <BaseInput
              v-model="branchForm.code"
              label="Branch Code"
              placeholder="e.g., HRE001"
              :required="true"
              :error="formErrors.code"
              hint="Unique identifier for the branch"
            />

            <!-- Bank UUID -->
            <BaseInput
              v-model="branchForm.bankUuid"
              label="Bank UUID"
              placeholder="Enter bank UUID"
              :required="true"
              :error="formErrors.bankUuid"
              hint="The UUID of the bank this branch belongs to"
            />
          </div>

          <!-- Location Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 class="text-sm font-semibold text-gray-900 dark:!text-white mb-4">Location Information</h4>

            <div class="space-y-4">
              <!-- Location Description -->
              <BaseTextarea
                v-model="branchForm.location.description"
                label="Location Description"
                placeholder="E.g., Corner of Baker Avenue and Main Street"
                :rows="2"
                :required="true"
                :error="formErrors['location.description']"
              />

              <!-- City -->
              <BaseInput
                v-model="branchForm.location.city"
                label="City"
                placeholder="E.g., Harare"
                :required="true"
                :error="formErrors['location.city']"
              />

              <!-- Coordinates -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BaseInput
                  v-model.number="branchForm.location.latitude"
                  type="number"
                  step="any"
                  label="Latitude"
                  placeholder="E.g., -17.8252"
                  :required="true"
                  :error="formErrors['location.latitude']"
                />
                <BaseInput
                  v-model.number="branchForm.location.longitude"
                  type="number"
                  step="any"
                  label="Longitude"
                  placeholder="E.g., 31.0335"
                  :required="true"
                  :error="formErrors['location.longitude']"
                />
              </div>

              <!-- Map Link -->
              <BaseInput
                v-model="branchForm.location.mapLink"
                type="url"
                label="Map Link (Optional)"
                placeholder="https://maps.google.com/..."
                hint="Link to Google Maps or other map service"
              />
            </div>
          </div>

          <!-- Settings Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 class="text-sm font-semibold text-gray-900 dark:!text-white mb-4">Branch Settings</h4>

            <div class="space-y-4">
              <!-- For Default Bank -->
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div class="flex-1">
                  <label class="text-sm font-medium text-gray-900 dark:text-white">Default Bank Branch</label>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Mark this as the default branch for the bank</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="branchForm.forDefaultBank"
                    type="checkbox"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#058f1f]/20 dark:peer-focus:ring-[#06b525]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#058f1f]"></div>
                </label>
              </div>

              <!-- Lenient Mode -->
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div class="flex-1">
                  <label class="text-sm font-medium text-gray-900 dark:text-white">Lenient Mode</label>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enable lenient transaction processing for this branch</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="branchForm.lenient"
                    type="checkbox"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
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
              :text="editMode ? 'Update Branch' : 'Add Branch'"
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
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import registryService from '@/services/registryService'
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

// State
const branches = ref([])
const loading = ref(false)
const error = ref(null)

// Dialog State
const showDialog = ref(false)
const editMode = ref(false)
const submitting = ref(false)
const formError = ref('')
const formErrors = ref({})

// Branch Form
const branchForm = ref({
  name: '',
  code: '',
  bankUuid: '',
  forDefaultBank: false,
  location: {
    latitude: 0,
    longitude: 0,
    description: '',
    mapLink: '',
    city: ''
  },
  lenient: true
})

// Table Columns Configuration
const columns = [
  {
    key: 'name',
    label: 'Branch Name',
    sortable: true
  },
  {
    key: 'code',
    label: 'Code',
    sortable: true
  },
  {
    key: 'bank',
    label: 'Bank',
    sortable: false
  },
  {
    key: 'location',
    label: 'Location',
    sortable: false
  },
  {
    key: 'forDefaultBank',
    label: 'Default',
    sortable: true
  },
  {
    key: 'lenient',
    label: 'Lenient',
    sortable: true
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
const fetchBranches = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await registryService.getBranches({
      page: 0,
      size: 100
    })

    console.log('✅ Branches fetched:', response.data)

    // Handle paginated response
    if (response.data.content) {
      branches.value = response.data.content
    } else if (Array.isArray(response.data)) {
      branches.value = response.data
    } else {
      branches.value = []
    }
  } catch (err) {
    console.error('❌ Error fetching branches:', err)
    error.value = err.response?.data?.message || 'Failed to load branches'
    branches.value = []
  } finally {
    loading.value = false
  }
}

const handleTableAction = ({ action, item }) => {
  console.log('Table action:', action, item)

  if (action === 'add') {
    openCreateDialog()
  } else if (action === 'view') {
    viewBranch(item)
  } else if (action === 'edit') {
    editBranch(item)
  } else if (action === 'delete') {
    deleteBranchConfirm(item)
  }
}

const openCreateDialog = () => {
  editMode.value = false
  resetForm()
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  resetForm()
}

const resetForm = () => {
  branchForm.value = {
    name: '',
    code: '',
    bankUuid: '',
    forDefaultBank: false,
    location: {
      latitude: 0,
      longitude: 0,
      description: '',
      mapLink: '',
      city: ''
    },
    lenient: true
  }
  formError.value = ''
  formErrors.value = {}
}

const validateForm = () => {
  formErrors.value = {}

  if (!branchForm.value.name) {
    formErrors.value.name = 'Branch name is required'
  }

  if (!branchForm.value.code) {
    formErrors.value.code = 'Branch code is required'
  }

  if (!branchForm.value.bankUuid) {
    formErrors.value.bankUuid = 'Bank UUID is required'
  }

  if (!branchForm.value.location.description) {
    formErrors.value['location.description'] = 'Location description is required'
  }

  if (!branchForm.value.location.city) {
    formErrors.value['location.city'] = 'City is required'
  }

  if (!branchForm.value.location.latitude) {
    formErrors.value['location.latitude'] = 'Latitude is required'
  }

  if (!branchForm.value.location.longitude) {
    formErrors.value['location.longitude'] = 'Longitude is required'
  }

  return Object.keys(formErrors.value).length === 0
}

const submitBranch = async () => {
  if (!validateForm()) return

  submitting.value = true
  formError.value = ''

  try {
    console.log('📤 Submitting branch data:', branchForm.value)
    console.log('🔑 Auth token:', localStorage.getItem('auth_token') ? 'Present' : 'Missing')

    if (editMode.value) {
      await registryService.updateBranch(branchForm.value.uuid, branchForm.value)
      console.log('✅ Branch updated successfully')
    } else {
      await registryService.createBranch(branchForm.value)
      console.log('✅ Branch created successfully')
    }

    closeDialog()
    fetchBranches()
  } catch (err) {
    console.error('❌ Error submitting branch:', err)
    console.error('❌ Error response:', err.response)
    console.error('❌ Error status:', err.response?.status)
    console.error('❌ Error data:', err.response?.data)

    // Show more detailed error message
    let errorMsg = err.response?.data?.message ||
                   err.response?.data?.error ||
                   err.message ||
                   'Failed to save branch'

    // Handle 403 Forbidden specifically
    if (err.response?.status === 403) {
      errorMsg = 'Access Denied: You do not have permission to manage branches. Please contact your administrator.'
    }

    formError.value = `${errorMsg} (Status: ${err.response?.status || 'Unknown'})`
  } finally {
    submitting.value = false
  }
}

const editBranch = (branch) => {
  editMode.value = true
  branchForm.value = JSON.parse(JSON.stringify(branch))
  showDialog.value = true
}

const viewBranch = (branch) => {
  console.log('View branch:', branch)
  alert(`Branch Details:\nName: ${branch.name}\nCode: ${branch.code}\nLocation: ${branch.location?.description}\nCity: ${branch.location?.city}\nDefault: ${branch.forDefaultBank ? 'Yes' : 'No'}\nLenient: ${branch.lenient ? 'Yes' : 'No'}`)
}

const deleteBranchConfirm = async (branch) => {
  const confirmed = confirm(`Are you sure you want to delete "${branch.name}"?`)

  if (confirmed) {
    try {
      await registryService.deleteBranch(branch.uuid)
      console.log('✅ Branch deleted')
      fetchBranches()
    } catch (err) {
      console.error('❌ Error deleting branch:', err)
      alert(err.response?.data?.message || 'Failed to delete branch')
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchBranches()
})
</script>
