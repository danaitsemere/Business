<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Service Requests</h1>
        <p class="text-[#475569] font-medium">Monitor, assign providers, and manage all service requests</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Total</div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ allRequests.length }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Pending</div>
        <div class="font-heading text-2xl font-black text-amber-500">{{ pendingCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">In Progress</div>
        <div class="font-heading text-2xl font-black text-[#7630A3]">{{ inProgressCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Completed</div>
        <div class="font-heading text-2xl font-black text-[#64D2B1]">{{ completedCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Rejected</div>
        <div class="font-heading text-2xl font-black text-red-500">{{ rejectedCount }}</div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-[#7C757E]">search</span>
        <input type="text" class="input-gts pl-12" v-model="searchQuery" placeholder="Search requests..." id="admin-request-search">
      </div>
      <select class="input-gts max-w-[180px]" v-model="categoryFilter">
        <option value="">All Categories</option>
        <option v-for="cat in serviceCategories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select class="input-gts max-w-[160px]" v-model="priorityFilter">
        <option value="">All Priorities</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>
    </div>

    <!-- Filter tabs -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <button v-for="tab in statusTabs" :key="tab.value"
        class="px-5 py-2.5 rounded-full text-[0.813rem] font-bold border-2 transition-all duration-200"
        :class="activeTab === tab.value
          ? 'bg-[#7630A3] border-[#7630A3] text-white shadow-soft'
          : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]/30'"
        @click="activeTab = tab.value">
        {{ tab.label }}
      </button>
    </div>

    <!-- Requests Cards -->
    <div class="space-y-4">
      <div v-for="req in paginatedRequests" :key="req.id"
        class="bg-white rounded-2xl border border-[#EEEAF2] p-6 shadow-sm hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        @click="$router.push(`/admin/service-requests/${req.id}`)">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <!-- Left: Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <span class="font-heading text-lg font-black text-[#1A1225]">{{ req.customerName }}</span>
              <!-- Priority indicator -->
              <span class="text-base">{{ req.priority === 'high' ? '🔴' : req.priority === 'medium' ? '🟡' : '🟢' }}</span>
              <span :class="statusBadgeClass(req.status)" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.5rem] font-black uppercase tracking-widest">
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(req.status)"></span>
                {{ formatStatus(req.status) }}
              </span>
              <span class="badge-primary">{{ req.serviceType }}</span>
            </div>
            <p class="text-sm text-[#475569] mb-2 line-clamp-1">{{ req.description }}</p>
            <div class="flex flex-wrap items-center gap-4 text-xs text-[#7C757E] font-medium">
              <span class="flex items-center gap-1"><span class="material-icons-round text-sm">person</span> {{ req.customerName }}</span>
              <span class="flex items-center gap-1"><span class="material-icons-round text-sm">location_on</span> {{ req.location }}</span>
              <span class="flex items-center gap-1"><span class="material-icons-round text-sm">calendar_today</span> {{ formatDate(req.createdAt) }}</span>
              <span class="flex items-center gap-1 text-[#7630A3] font-bold"><span class="material-icons-round text-sm">payments</span> ETB {{ (req.actualCost || req.estimatedCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              <!-- Payment status -->
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.5rem] font-black uppercase tracking-widest"
                :class="{
                  'bg-[#64D2B1]/10 text-[#64D2B1]': req.paymentStatus === 'paid',
                  'bg-amber-50 text-amber-500': req.paymentStatus === 'pending',
                  'bg-red-50 text-red-500': req.paymentStatus === 'refunded'
                }">
                {{ req.paymentStatus || 'pending' }}
              </span>
            </div>
          </div>

          <!-- Right: Provider + Actions -->
          <div class="flex flex-col items-end gap-3 shrink-0" @click.stop>
            <!-- Provider -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-[#7C757E] font-medium">Provider:</span>
              <span v-if="req.providerName" class="text-sm font-bold text-[#1A1225]">{{ req.providerName }}</span>
              <span v-else class="text-sm font-medium text-amber-500">Unassigned</span>
            </div>

            <!-- Admin Actions Only -->
            <div class="flex items-center gap-2">
              <!-- Assign Provider -->
              <button v-if="!req.providerName && (req.status === 'pending')"
                class="px-3 py-2 rounded-xl bg-[#7630A3]/10 text-[#7630A3] text-xs font-bold hover:bg-[#7630A3] hover:text-white transition-all flex items-center gap-1"
                @click.stop="openAssignModal(req)">
                <span class="material-icons-round text-base">person_add</span> Assign
              </button>

              <!-- Reject (admin action) -->
              <button v-if="req.status === 'pending' || req.status === 'assigned'"
                class="px-3 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
                @click.stop="openRejectModal(req)">
                <span class="material-icons-round text-base">close</span> Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredRequests.length === 0" class="text-center py-16 text-[#7C757E]">
      <span class="material-icons-round text-5xl mb-3 block text-[#EEEAF2]">assignment</span>
      <p class="text-lg font-medium">No requests found</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
      <button class="w-10 h-10 rounded-xl border border-[#EEEAF2] flex items-center justify-center text-[#7C757E] hover:border-[#7630A3] hover:text-[#7630A3] transition-all disabled:opacity-30"
        :disabled="currentPage === 1" @click="currentPage--">
        <span class="material-icons-round text-lg">chevron_left</span>
      </button>
      <button v-for="page in totalPages" :key="page"
        class="w-10 h-10 rounded-xl text-sm font-black flex items-center justify-center transition-all"
        :class="currentPage === page ? 'bg-[#7630A3] text-white' : 'border border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]'"
        @click="currentPage = page">
        {{ page }}
      </button>
      <button class="w-10 h-10 rounded-xl border border-[#EEEAF2] flex items-center justify-center text-[#7C757E] hover:border-[#7630A3] hover:text-[#7630A3] transition-all disabled:opacity-30"
        :disabled="currentPage === totalPages" @click="currentPage++">
        <span class="material-icons-round text-lg">chevron_right</span>
      </button>
    </div>

    <!-- Assign Provider Modal -->
    <div v-if="assignModal" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="assignModal = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Assign Provider</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225] transition-colors" @click="assignModal = null">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        <p class="text-sm text-[#475569] mb-4">Assign a provider for request <strong>#{{ assignModal?.id }}</strong> ({{ assignModal?.serviceType }})</p>
        
        <!-- Provider list -->
        <div class="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
          <div v-for="provider in filteredProviders" :key="provider.id"
            class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all"
            :class="selectedProvider?.id === provider.id ? 'border-[#7630A3] bg-[#7630A3]/5' : 'border-[#EEEAF2] hover:border-[#7630A3]/30'"
            @click="selectedProvider = provider">
            <div class="w-10 h-10 rounded-xl bg-[#F8F6FB] flex items-center justify-center text-[#7630A3] font-black text-sm border border-[#EEEAF2]">
              {{ provider.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-bold text-[#1A1225]">{{ provider.name }}</span>
              <span class="block text-xs text-[#7C757E]">{{ provider.category }} • {{ provider.completedJobs }} jobs • ⭐ {{ provider.rating }}</span>
            </div>
            <span v-if="selectedProvider?.id === provider.id" class="material-icons-round text-[#7630A3]">check_circle</span>
          </div>
        </div>

        <button class="btn-gts-primary w-full py-4 rounded-xl" @click="handleAssign" :disabled="!selectedProvider">
          <span class="material-icons-round">assignment_ind</span>
          Assign Provider
        </button>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="rejectModal" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="rejectModal = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Reject Request</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225] transition-colors" @click="rejectModal = null">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        <p class="text-sm text-[#475569] mb-4">Rejecting request <strong>#{{ rejectModal?.id }}</strong>. Please provide a reason:</p>
        <div class="space-y-2 mb-6">
          <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Reason for Rejection</label>
          <textarea class="input-gts min-h-[100px] resize-none" v-model="rejectReason" placeholder="Enter reason for rejection..."></textarea>
        </div>
        <button class="w-full py-4 rounded-xl bg-red-500 text-white font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2" @click="handleReject">
          <span class="material-icons-round">cancel</span>
          Reject Request
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const activeTab = ref('all')
const searchQuery = ref('')
const categoryFilter = ref('')
const priorityFilter = ref('')
const assignModal = ref(null)
const selectedProvider = ref(null)
const rejectModal = ref(null)
const rejectReason = ref('')
const currentPage = ref(1)
const perPage = 8

const allRequests = computed(() => adminStore.serviceRequests)
const pendingCount = computed(() => allRequests.value.filter(r => r.status === 'pending').length)
const inProgressCount = computed(() => allRequests.value.filter(r => r.status === 'assigned' || r.status === 'in_progress').length)
const completedCount = computed(() => allRequests.value.filter(r => r.status === 'completed').length)
const rejectedCount = computed(() => allRequests.value.filter(r => r.status === 'rejected').length)

const serviceCategories = ['Delivery', 'Payment Processing', 'Marketing', 'Web Development', 'Photography', 'Consulting']

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' }
]

const filteredRequests = computed(() => {
  let list = [...allRequests.value]
  
  // Status filter
  if (activeTab.value !== 'all') {
    if (activeTab.value === 'in_progress') {
      list = list.filter(r => r.status === 'assigned' || r.status === 'in_progress')
    } else {
      list = list.filter(r => r.status === activeTab.value)
    }
  }
  
  // Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r => r.customerName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.serviceType.toLowerCase().includes(q))
  }
  
  // Category
  if (categoryFilter.value) {
    list = list.filter(r => r.serviceType === categoryFilter.value)
  }
  
  // Priority
  if (priorityFilter.value) {
    list = list.filter(r => r.priority === priorityFilter.value)
  }
  
  // Sort by priority (high first)
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  list.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2))
  
  return list
})

const totalPages = computed(() => Math.ceil(filteredRequests.value.length / perPage))
const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredRequests.value.slice(start, start + perPage)
})

const filteredProviders = computed(() => {
  if (!assignModal.value) return adminStore.providers
  return adminStore.providers
})

function statusBadgeClass(status) {
  const map = {
    pending: 'bg-amber-50 text-amber-600',
    assigned: 'bg-blue-50 text-blue-600',
    in_progress: 'bg-[#7630A3]/10 text-[#7630A3]',
    completed: 'bg-[#64D2B1]/10 text-[#64D2B1]',
    rejected: 'bg-red-50 text-red-500'
  }
  return map[status] || ''
}

function statusDotClass(status) {
  const map = {
    pending: 'bg-amber-500',
    assigned: 'bg-blue-500',
    in_progress: 'bg-[#7630A3]',
    completed: 'bg-[#64D2B1]',
    rejected: 'bg-red-500'
  }
  return map[status] || ''
}

function formatStatus(status) {
  return status.replace(/_/g, ' ')
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function openAssignModal(req) {
  assignModal.value = req
  selectedProvider.value = null
}

function handleAssign() {
  if (assignModal.value && selectedProvider.value) {
    adminStore.assignProvider(assignModal.value.id, selectedProvider.value.id, selectedProvider.value.name)
    assignModal.value = null
    selectedProvider.value = null
  }
}

function openRejectModal(req) {
  rejectModal.value = req
  rejectReason.value = ''
}

function handleReject() {
  if (rejectModal.value) {
    adminStore.rejectRequest(rejectModal.value.id, rejectReason.value)
    rejectModal.value = null
    rejectReason.value = ''
  }
}
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.1); }
</style>
