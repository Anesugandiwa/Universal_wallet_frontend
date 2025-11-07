<template>
  <AdminLayout page-title="Customers Management" page-subtitle="Manage customer accounts and information">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:!text-white">Customers Management</h2>
              <p class="mt-2 text-sm text-gray-600 dark:!text-gray-200">Manage customer accounts and profiles</p>
          </div>
          <button
            @click="openCreateDialog"
            class="inline-flex items-center px-4 py-2 bg-[#058f1f] hover:bg-[#047017] dark:bg-[#058f1f] dark:hover:bg-[#06b525] text-white font-medium rounded-lg shadow-md transition-colors duration-200">
            <PlusIcon class="h-5 w-5 mr-2"/>
            Add Customer
          </button>
        </div>

      </div>

      <!-- Customers DataTable -->
      <DataTable
        title="All Customers"
        description="View and manage customer accounts"
        :data="customers"
        :columns="columns"
        :actions="tableActions"
        :searchable="true"
        search-placeholder="Search by name, email, mobile number..."
        :paginated="true"
        :per-page="10"
        row-key="uuid"
        @action="handleTableAction"
      >
        <!-- Custom cell for customer type -->
        <template #cell-customerType="{ item }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800': item.customerType === 'INDIVIDUAL',
              'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800': item.customerType === 'BUSINESS'
            }"
          >
            {{ item.customerType }}
          </span>
        </template>

        <!-- Custom cell for status -->
        <template #cell-status="{ item }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-[#058f1f]/10 dark:bg-[#058f1f]/20 text-[#058f1f] dark:text-[#06b525] border border-[#058f1f]/20 dark:border-[#058f1f]/30': item.status === 'ACTIVE',
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600': item.status === 'INACTIVE'
            }"
          >
            {{ item.status }}
          </span>
        </template>

        <!-- Empty state -->
        <template #empty-state>
          <div class="text-center py-12">
            <svg class="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-600 dark:text-gray-300 font-medium mb-2">No customers found</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first customer</p>
            <button
              @click="openCreateDialog"
              class="inline-flex items-center px-4 py-2 bg-[#058f1f] hover:bg-[#047017] dark:bg-[#058f1f] dark:hover:bg-[#06b525] text-white font-medium rounded-lg transition-colors"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Create First Customer
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Create/Edit Customer Dialog -->
    <div
      v-if="showDialog"
      class="fixed inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeDialog"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Dialog Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 class="text-xl font-semibold text-gray-900 dark:!text-white">
            {{ editMode ? 'Edit Customer' : 'Create New Customer' }}
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

        <!-- Dialog Body with Stepper -->
        <div class="p-6">
          <FormStepper
            ref="stepperRef"
            :steps="['Basic Info', 'Contact & Address', 'Branch', 'User Account']"
            :can-proceed="canProceedToNextStep"
            :loading="submitting"
            :submit-text="editMode ? 'Update Customer' : 'Create Customer'"
            @submit="submitCustomer"
            @update:step="handleStepChange"
          >
            <!-- Step 0: Basic Information -->
            <template #step-0>
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 dark:!text-white mb-4">Basic Information</h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Name -->
                  <BaseInput
                    v-model="customerForm.name"
                    label="Full Name"
                    placeholder="Enter customer's full name"
                    :required="true"
                    :error="formErrors.name"
                    class="md:col-span-2"
                  />

                  <!-- Customer Type -->
                  <BaseSelect
                    v-model="customerForm.customerType"
                    label="Customer Type"
                    :options="[
                      { value: 'INDIVIDUAL', label: 'Individual' },
                      { value: 'BUSINESS', label: 'Business' }
                    ]"
                    :required="true"
                  />

                  <!-- Status -->
                  <BaseSelect
                    v-model="customerForm.status"
                    label="Status"
                    :options="[
                      { value: 'ACTIVE', label: 'Active' },
                      { value: 'INACTIVE', label: 'Inactive' }
                    ]"
                    :required="true"
                  />

                  <!-- Identifier -->
                  <BaseInput
                    v-model="customerForm.identifier"
                    label="Identifier (ID/Passport)"
                    placeholder="e.g., 63-123456A47"
                    :required="true"
                    :error="formErrors.identifier"
                  />

                  <!-- Nationality -->
                  <BaseInput
                    v-model="customerForm.nationality"
                    label="Nationality"
                    placeholder="e.g., Zimbabwean"
                    :required="true"
                  />
                </div>
              </div>
            </template>

            <!-- Step 1: Contact & Address -->
            <template #step-1>
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:!text-white mb-4">Contact Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Mobile Number -->
                    <BaseInput
                      v-model="customerForm.mobileNumber"
                      label="Mobile Number"
                      type="tel"
                      placeholder="e.g., 263779081696"
                      :required="true"
                      :error="formErrors.mobileNumber"
                    />

                    <!-- Email -->
                    <BaseInput
                      v-model="customerForm.email"
                      label="Email Address"
                      type="email"
                      placeholder="e.g., customer@example.com"
                      :required="true"
                      :error="formErrors.email"
                    />
                  </div>
                </div>

                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 class="text-lg font-semibold text-gray-900 dark:!text-white mb-4">Address Information</h4>
                  <div class="space-y-4">
                    <!-- Address Line 1 -->
                    <BaseInput
                      v-model="customerForm.address.addressLine1"
                      label="Address Line 1"
                      placeholder="e.g., 123 Main Street"
                      :required="true"
                    />

                    <!-- Address Line 2 -->
                    <BaseInput
                      v-model="customerForm.address.addressLine2"
                      label="Address Line 2 (Optional)"
                      placeholder="e.g., Apartment 4B"
                    />

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <!-- City -->
                      <BaseInput
                        v-model="customerForm.address.city"
                        label="City"
                        placeholder="e.g., Harare"
                        :required="true"
                      />

                      <!-- Province -->
                      <BaseInput
                        v-model="customerForm.address.province"
                        label="Province"
                        placeholder="e.g., Harare"
                        :required="true"
                      />

                      <!-- Postal Code -->
                      <BaseInput
                        v-model="customerForm.address.postalCode"
                        label="Postal Code"
                        placeholder="e.g., 00263"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Step 2: Branch Information -->
            <template #step-2>
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 dark:!text-white mb-4">Branch Information</h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Branch UUID -->
                  <BaseInput
                    v-model="customerForm.branchUuid"
                    label="Branch UUID"
                    placeholder="Enter branch UUID"
                    :required="true"
                    :error="formErrors.branchUuid"
                    hint="The UUID of the branch this customer belongs to"
                  />

                  <!-- Branch (alternative) -->
                  <BaseInput
                    v-model="customerForm.branch"
                    label="Branch Name/Code"
                    placeholder="e.g., Harare Main"
                    hint="Alternative branch identifier"
                  />
                </div>
              </div>
            </template>

            <!-- Step 3: User Account -->
            <template #step-3>
              <div class="space-y-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-900 dark:!text-white">User Account Information</h4>
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="createUserAccount"
                      type="checkbox"
                      class="w-4 h-4 text-[#058f1f] bg-gray-100 border-gray-300 rounded focus:ring-[#058f1f] dark:focus:ring-[#06b525] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    >
                    <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Create user account</span>
                  </label>
                </div>

                <div v-if="!createUserAccount" class="text-center py-12">
                  <svg class="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p class="text-gray-600 dark:text-gray-400">No user account will be created</p>
                  <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">Toggle the switch above to create a user account for this customer</p>
                </div>

                <div v-else class="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Username -->
                    <BaseInput
                      v-model="customerForm.createUserCommand.username"
                      label="Username"
                      placeholder="Enter username"
                      :required="createUserAccount"
                      :error="formErrors.username"
                    />

                    <!-- Password -->
                    <BaseInput
                      v-model="customerForm.createUserCommand.password"
                      label="Password"
                      type="password"
                      placeholder="Enter password"
                      :required="createUserAccount"
                      :error="formErrors.password"
                    />

                    <!-- User Email (auto-filled) -->
                    <BaseInput
                      v-model="customerForm.createUserCommand.email"
                      label="User Email"
                      type="email"
                      placeholder="Email (auto-filled from above)"
                      :required="createUserAccount"
                      disabled
                      hint="Automatically uses customer's email"
                    />

                    <!-- User Name (auto-filled) -->
                    <BaseInput
                      v-model="customerForm.createUserCommand.name"
                      label="Display Name"
                      placeholder="Name (auto-filled from above)"
                      :required="createUserAccount"
                      disabled
                      hint="Automatically uses customer's name"
                    />

                    <!-- Mobile Number (auto-filled) -->
                    <BaseInput
                      v-model="customerForm.createUserCommand.mobileNumber"
                      label="User Mobile Number"
                      type="tel"
                      placeholder="Mobile (auto-filled from above)"
                      :required="createUserAccount"
                      disabled
                      hint="Automatically uses customer's mobile"
                    />

                    <!-- Group UUID -->
                    <BaseInput
                      v-model="customerForm.createUserCommand.groupUuid"
                      label="Group UUID"
                      placeholder="Enter user group UUID"
                      :required="createUserAccount"
                      :error="formErrors.groupUuid"
                      hint="User group for permissions"
                    />

                    <!-- Tenant ID -->
                    <BaseInput
                      v-model="customerForm.createUserCommand.tenantId"
                      label="Tenant ID"
                      placeholder="e.g., 00001"
                      :required="createUserAccount"
                      :error="formErrors.tenantId"
                      class="md:col-span-2"
                    />
                  </div>
                </div>
              </div>
            </template>
          </FormStepper>

          <!-- Form Error -->
          <div v-if="formError" class="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ formError }}</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import DataTable from '@/components/ui/DataTable.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import FormStepper from '@/components/ui/FormStepper.vue'
import registryService from '@/services/registryService'
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

// State
const customers = ref([])
const loading = ref(false)
const error = ref(null)

// Dialog State
const showDialog = ref(false)
const editMode = ref(false)
const submitting = ref(false)
const formError = ref('')
const formErrors = ref({})
const createUserAccount = ref(true)
const stepperRef = ref(null)
const currentStep = ref(0)

// Customer Form
const customerForm = ref({
  name: '',
  customerType: 'INDIVIDUAL',
  address: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: ''
  },
  nationality: '',
  mobileNumber: '',
  email: '',
  branchUuid: '',
  status: 'ACTIVE',
  identifier: '',
  createUserCommand: {
    email: '',
    username: '',
    name: '',
    groupUuid: '',
    tenantId: '00001',
    mobileNumber: '',
    password: ''
  },
  branch: ''
})

// Watch for changes to auto-fill user account fields
watch(() => customerForm.value.email, (newEmail) => {
  customerForm.value.createUserCommand.email = newEmail
})

watch(() => customerForm.value.name, (newName) => {
  customerForm.value.createUserCommand.name = newName
})

watch(() => customerForm.value.mobileNumber, (newMobile) => {
  customerForm.value.createUserCommand.mobileNumber = newMobile
})

// Computed property to check if current step is valid
const canProceedToNextStep = computed(() => {
  if (currentStep.value === 0) {
    // Step 0: Basic Information
    return !!(
      customerForm.value.name &&
      customerForm.value.identifier &&
      customerForm.value.nationality
    )
  } else if (currentStep.value === 1) {
    // Step 1: Contact & Address
    return !!(
      customerForm.value.mobileNumber &&
      customerForm.value.email &&
      customerForm.value.address.addressLine1 &&
      customerForm.value.address.city &&
      customerForm.value.address.province
    )
  } else if (currentStep.value === 2) {
    // Step 2: Branch Information
    return !!(customerForm.value.branchUuid)
  } else if (currentStep.value === 3) {
    // Step 3: User Account (optional or required fields)
    if (!createUserAccount.value) {
      return true // Can proceed if not creating user account
    }
    return !!(
      customerForm.value.createUserCommand.username &&
      customerForm.value.createUserCommand.password &&
      customerForm.value.createUserCommand.groupUuid &&
      customerForm.value.createUserCommand.tenantId
    )
  }
  return false
})

// Handle step change
const handleStepChange = (step) => {
  currentStep.value = step
}

// Table Columns Configuration
const columns = [
  {
    key: 'name',
    label: 'Customer Name',
    sortable: true
  },
  {
    key: 'customerType',
    label: 'Type',
    sortable: true
  },
  {
    key: 'identifier',
    label: 'Identifier',
    sortable: true
  },
  {
    key: 'mobileNumber',
    label: 'Mobile Number',
    sortable: true
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true
  },
  {
    key: 'address.city',
    label: 'City',
    sortable: true
  },
  {
    key: 'status',
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
const fetchCustomers = async () => {
  loading.value = true
  error.value = null

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
    error.value = err.response?.data?.message || 'Failed to load customers'
    customers.value = []
  } finally {
    loading.value = false
  }
}

const handleTableAction = ({ action, item }) => {
  console.log('Table action:', action, item)

  if (action === 'add') {
    openCreateDialog()
  } else if (action === 'view') {
    viewCustomer(item)
  } else if (action === 'edit') {
    editCustomer(item)
  } else if (action === 'delete') {
    deleteCustomerConfirm(item)
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
  customerForm.value = {
    name: '',
    customerType: 'INDIVIDUAL',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      postalCode: ''
    },
    nationality: '',
    mobileNumber: '',
    email: '',
    branchUuid: '',
    status: 'ACTIVE',
    identifier: '',
    createUserCommand: {
      email: '',
      username: '',
      name: '',
      groupUuid: '',
      tenantId: '00001',
      mobileNumber: '',
      password: ''
    },
    branch: ''
  }
  formError.value = ''
  formErrors.value = {}
  createUserAccount.value = true
  currentStep.value = 0
  if (stepperRef.value) {
    stepperRef.value.currentStep = 0
  }
}

const submitCustomer = async () => {
  submitting.value = true
  formError.value = ''

  try {
    console.log('📤 Submitting customer data:', customerForm.value)
    console.log('🔑 Auth token:', localStorage.getItem('auth_token') ? 'Present' : 'Missing')

    // Prepare data - remove createUserCommand if not creating user account
    const dataToSubmit = { ...customerForm.value }
    if (!createUserAccount.value) {
      delete dataToSubmit.createUserCommand
    }

    if (editMode.value) {
      await registryService.updateCustomer(customerForm.value.uuid, dataToSubmit)
      console.log('✅ Customer updated successfully')
    } else {
      await registryService.createCustomer(dataToSubmit)
      console.log('✅ Customer created successfully')
    }

    closeDialog()
    fetchCustomers()
  } catch (err) {
    console.error('❌ Error submitting customer:', err)
    console.error('❌ Error response:', err.response)
    console.error('❌ Error status:', err.response?.status)
    console.error('❌ Error data:', err.response?.data)

    // Show more detailed error message
    let errorMsg = err.response?.data?.message ||
                   err.response?.data?.error ||
                   err.message ||
                   'Failed to save customer'

    // Handle 403 Forbidden specifically
    if (err.response?.status === 403) {
      errorMsg = 'Access Denied: You do not have permission to create customers. Please contact your administrator.'
    }

    formError.value = `${errorMsg} (Status: ${err.response?.status || 'Unknown'})`
  } finally {
    submitting.value = false
  }
}

const editCustomer = (customer) => {
  editMode.value = true
  customerForm.value = JSON.parse(JSON.stringify(customer))
  // Check if customer has user account
  createUserAccount.value = !!customer.createUserCommand
  showDialog.value = true
}

const viewCustomer = (customer) => {
  console.log('View customer:', customer)
  alert(`Customer Details:\nName: ${customer.name}\nType: ${customer.customerType}\nEmail: ${customer.email}\nMobile: ${customer.mobileNumber}\nStatus: ${customer.status}`)
}

const deleteCustomerConfirm = async (customer) => {
  const confirmed = confirm(`Are you sure you want to delete customer "${customer.name}"?`)

  if (confirmed) {
    try {
      await registryService.deleteCustomer(customer.uuid)
      console.log('✅ Customer deleted')
      fetchCustomers()
    } catch (err) {
      console.error('❌ Error deleting customer:', err)
      alert(err.response?.data?.message || 'Failed to delete customer')
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchCustomers()
})
</script>
