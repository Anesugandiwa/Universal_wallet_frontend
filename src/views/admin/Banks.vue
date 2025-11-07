<template>
  <AdminLayout page-title="Banks Management" page-subtitle="Manage banking institutions and transfer settings">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:!text-white">Banks Management</h2>
            <p class="mt-2 text-sm text-gray-600 dark:!text-gray-200">Manage banking institutions and transfer configurations</p>
          </div>
          <button
            @click="openCreateDialog"
            class="inline-flex items-center px-4 py-2 bg-[#058f1f] hover:bg-[#047017] dark:bg-[#058f1f] dark:hover:bg-[#06b525] text-white font-medium rounded-lg shadow-md transition-colors duration-200">
            <PlusIcon class="h-5 w-5 mr-2"/>
            Add Bank
        </button>
        </div>
       
      </div>

      <!-- Banks DataTable -->
      <DataTable
        title="All Banks"
        description="View and manage registered banking institutions"
        :data="banks"
        :columns="columns"
        :actions="tableActions"
        :searchable="true"
        search-placeholder="Search by bank name, SWIFT code..."
        :paginated="true"
        :per-page="10"
        row-key="uuid"
        @action="handleTableAction"
      >
        <!-- Custom cell for active status -->
        <template #cell-active="{ item }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-[#058f1f]/10 dark:bg-[#058f1f]/20 text-[#058f1f] dark:text-[#06b525] border border-[#058f1f]/20 dark:border-[#058f1f]/30': item.active,
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600': !item.active
            }"
          >
            {{ item.active ? 'Active' : 'Inactive' }}
          </span>
        </template>

        <!-- Custom cell for transfer methods -->
        <template #cell-transferMethods="{ item }">
          <div class="flex flex-wrap gap-1">
            <span v-if="item.rapidTransferAllowed" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Rapid
            </span>
            <span v-if="item.eftTransferAllowed" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              EFT
            </span>
            <span v-if="item.rtgsAllowed" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
              RTGS
            </span>
            <span v-if="!item.rapidTransferAllowed && !item.eftTransferAllowed && !item.rtgsAllowed" class="text-xs text-gray-400 dark:text-gray-500">
              None
            </span>
          </div>
        </template>

        <!-- Empty state -->
        <template #empty-state>
          <div class="text-center py-12">
            <svg class="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p class="text-gray-600 dark:text-gray-300 font-medium mb-2">No banks found</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first bank</p>
            <button
              @click="openCreateDialog"
              class="inline-flex items-center px-4 py-2 bg-[#058f1f] hover:bg-[#047017] dark:bg-[#058f1f] dark:hover:bg-[#06b525] text-white font-medium rounded-lg transition-colors"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Add First Bank
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Create/Edit Bank Dialog -->
    <div
      v-if="showDialog"
      class="fixed inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeDialog"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Dialog Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:!text-white">
            {{ editMode ? 'Edit Bank' : 'Add New Bank' }}
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
        <form @submit.prevent="submitBank" class="p-6 space-y-6">
          <!-- Basic Information Section -->
          <div class="space-y-4"> 
            <h4 class="text-sm font-semibold text-gray-900 dark:!text-white">Basic Information</h4>

            <!-- Bank Name -->
            <BaseInput
              v-model="bankForm.name"
              label="Bank Name"
              placeholder="e.g., First Capital Bank"
              :required="true"
              :error="formErrors.name"
            />

            <!-- SWIFT Code -->
            <BaseInput
              v-model="bankForm.swiftCode"
              label="SWIFT Code"
              placeholder="e.g., FCABZWHA"
              :required="true"
              :error="formErrors.swiftCode"
              hint="8 or 11 character SWIFT/BIC code"
            />

            <!-- Logo File Name -->
            <BaseInput
              v-model="bankForm.logoFileName"
              label="Logo File Name (Optional)"
              placeholder="e.g., fcb-logo.png"
              hint="File name for the bank's logo image"
            />
          </div>

          <!-- Transfer Settings Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 class="text-sm font-semibold text-gray-900 dark:!text-white mb-4">Transfer Methods & Settings</h4>

            <div class="space-y-4">
              <!-- Active Status -->
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div class="flex-1">
                  <label class="text-sm font-medium text-gray-900 dark:text-white">Active Status</label>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enable or disable this bank</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="bankForm.active"
                    type="checkbox"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#058f1f]/20 dark:peer-focus:ring-[#06b525]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#058f1f]"></div>
                </label>
              </div>

              <!-- Rapid Transfer -->
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div class="flex-1">
                  <label class="text-sm font-medium text-gray-900 dark:text-white">Rapid Transfer</label>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow instant/rapid transfers</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="bankForm.rapidTransferAllowed"
                    type="checkbox"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <!-- EFT Transfer -->
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div class="flex-1">
                  <label class="text-sm font-medium text-gray-900 dark:text-white">EFT Transfer</label>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow Electronic Funds Transfers</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="bankForm.eftTransferAllowed"
                    type="checkbox"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <!-- RTGS -->
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div class="flex-1">
                  <label class="text-sm font-medium text-gray-900 dark:text-white">RTGS Transfer</label>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow Real Time Gross Settlement transfers</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="bankForm.rtgsAllowed"
                    type="checkbox"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
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
              :text="editMode ? 'Update Bank' : 'Add Bank'"
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
import registryService from '@/services/registryService'
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

// State
const banks = ref([])
const loading = ref(false)
const error = ref(null)

// Dialog State
const showDialog = ref(false)
const editMode = ref(false)
const submitting = ref(false)
const formError = ref('')
const formErrors = ref({})

// Bank Form
const bankForm = ref({
  name: '',
  swiftCode: '',
  rapidTransferAllowed: true,
  eftTransferAllowed: true,
  logoFileName: '',
  rtgsAllowed: true,
  active: true
})

// Table Columns Configuration
const columns = [
  {
    key: 'name',
    label: 'Bank Name',
    sortable: true
  },
  {
    key: 'swiftCode',
    label: 'SWIFT Code',
    sortable: true
  },
  {
    key: 'transferMethods',
    label: 'Transfer Methods',
    sortable: false
  },
  {
    key: 'active',
    label: 'Status',
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
const fetchBanks = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await registryService.getBanks({
      page: 0,
      size: 100
    })

    console.log('✅ Banks fetched:', response.data)

    // Handle paginated response
    if (response.data.content) {
      banks.value = response.data.content
    } else if (Array.isArray(response.data)) {
      banks.value = response.data
    } else {
      banks.value = []
    }
  } catch (err) {
    console.error('❌ Error fetching banks:', err)
    error.value = err.response?.data?.message || 'Failed to load banks'
    banks.value = []
  } finally {
    loading.value = false
  }
}

const handleTableAction = ({ action, item }) => {
  console.log('Table action:', action, item)

  if (action === 'add') {
    openCreateDialog()
  } else if (action === 'view') {
    viewBank(item)
  } else if (action === 'edit') {
    editBank(item)
  } else if (action === 'delete') {
    deleteBankConfirm(item)
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
  bankForm.value = {
    name: '',
    swiftCode: '',
    rapidTransferAllowed: true,
    eftTransferAllowed: true,
    logoFileName: '',
    rtgsAllowed: true,
    active: true
  }
  formError.value = ''
  formErrors.value = {}
}

const validateForm = () => {
  formErrors.value = {}

  if (!bankForm.value.name) {
    formErrors.value.name = 'Bank name is required'
  }

  if (!bankForm.value.swiftCode) {
    formErrors.value.swiftCode = 'SWIFT code is required'
  } else if (bankForm.value.swiftCode.length !== 8 && bankForm.value.swiftCode.length !== 11) {
    formErrors.value.swiftCode = 'SWIFT code must be 8 or 11 characters'
  }

  return Object.keys(formErrors.value).length === 0
}

const submitBank = async () => {
  if (!validateForm()) return

  submitting.value = true
  formError.value = ''

  try {
    console.log('📤 Submitting bank data:', bankForm.value)
    console.log('🔑 Auth token:', localStorage.getItem('auth_token') ? 'Present' : 'Missing')

    if (editMode.value) {
      await registryService.updateBank(bankForm.value.uuid, bankForm.value)
      console.log('✅ Bank updated successfully')
    } else {
      await registryService.createBank(bankForm.value)
      console.log('✅ Bank created successfully')
    }

    closeDialog()
    fetchBanks()
  } catch (err) {
    console.error('❌ Error submitting bank:', err)
    console.error('❌ Error response:', err.response)
    console.error('❌ Error status:', err.response?.status)
    console.error('❌ Error data:', err.response?.data)

    // Show more detailed error message
    let errorMsg = err.response?.data?.message ||
                   err.response?.data?.error ||
                   err.message ||
                   'Failed to save bank'

    // Handle 403 Forbidden specifically
    if (err.response?.status === 403) {
      errorMsg = 'Access Denied: You do not have permission to manage banks. Please contact your administrator.'
    }

    formError.value = `${errorMsg} (Status: ${err.response?.status || 'Unknown'})`
  } finally {
    submitting.value = false
  }
}

const editBank = (bank) => {
  editMode.value = true
  bankForm.value = JSON.parse(JSON.stringify(bank))
  showDialog.value = true
}

const viewBank = (bank) => {
  console.log('View bank:', bank)
  const transferMethods = []
  if (bank.rapidTransferAllowed) transferMethods.push('Rapid Transfer')
  if (bank.eftTransferAllowed) transferMethods.push('EFT')
  if (bank.rtgsAllowed) transferMethods.push('RTGS')

  alert(`Bank Details:\nName: ${bank.name}\nSWIFT Code: ${bank.swiftCode}\nTransfer Methods: ${transferMethods.join(', ') || 'None'}\nStatus: ${bank.active ? 'Active' : 'Inactive'}`)
}

const deleteBankConfirm = async (bank) => {
  const confirmed = confirm(`Are you sure you want to delete "${bank.name}"?`)

  if (confirmed) {
    try {
      await registryService.deleteBank(bank.uuid)
      console.log('✅ Bank deleted')
      fetchBanks()
    } catch (err) {
      console.error('❌ Error deleting bank:', err)
      alert(err.response?.data?.message || 'Failed to delete bank')
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchBanks()
})
</script>
