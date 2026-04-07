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
        <div class="font-heading text-2xl font-black text-[#7630A3]">{{ activeCount }}</div>
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
      <div v-for="req in filteredRequests" :key="req.id"
        class="bg-white rounded-2xl border border-[#EEEAF2] p-6 shadow-sm hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <!-- Left: Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <span class="font-heading text-lg font-black text-[#1A1225]">#{{ req.id }}</span>
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
              <span class="flex items-center gap-1"><span class="material-icons-round text-sm">calendar_today</span> {{ req.createdAt }}</span>
              <span class="flex items-center gap-1 text-[#7630A3] font-bold"><span class="material-icons-round text-sm">payments</span> ${{ (req.actualCost || req.estimatedCost).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Right: Provider + Actions -->
          <div class="flex flex-col items-end gap-3 shrink-0">
            <!-- Provider -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-[#7C757E] font-medium">Provider:</span>
              <span v-if="req.providerName" class="text-sm font-bold text-[#1A1225]">{{ req.providerName }}</span>
              <span v-else class="text-sm font-medium text-amber-500">Unassigned</span>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <!-- Assign Provider -->
              <button v-if="!req.providerName && req.status === 'pending'"
                class="px-3 py-2 rounded-xl bg-[#7630A3]/10 text-[#7630A3] text-xs font-bold hover:bg-[#7630A3] hover:text-white transition-all flex items-center gap-1"
                @click="openAssignModal(req)">
                <span class="material-icons-round text-base">person_add</span> Assign
              </button>

              <!-- Status Changes -->
              <button v-if="req.status === 'pending'"
                class="px-3 py-2 rounded-xl bg-[#64D2B1]/10 text-[#64D2B1] text-xs font-bold hover:bg-[#64D2B1] hover:text-white transition-all flex items-center gap-1"
                @click="adminStore.updateRequestStatus(req.id, 'accepted')">
                <span class="material-icons-round text-base">check</span> Accept
              </button>
              <button v-if="req.status === 'accepted'"
                class="px-3 py-2 rounded-xl bg-[#7630A3]/10 text-[#7630A3] text-xs font-bold hover:bg-[#7630A3] hover:text-white transition-all flex items-center gap-1"
                @click="adminStore.updateRequestStatus(req.id, 'in_progress')">
                <span class="material-icons-round text-base">play_arrow</span> Start
              </button>
              <button v-if="req.status === 'in_progress'"
                class="px-3 py-2 rounded-xl bg-[#64D2B1]/10 text-[#64D2B1] text-xs font-bold hover:bg-[#64D2B1] hover:text-white transition-all flex items-center gap-1"
                @click="adminStore.updateRequestStatus(req.id, 'completed')">
                <span class="material-icons-round text-base">done_all</span> Complete
              </button>
              <button v-if="req.status === 'pending' || req.status === 'accepted'"
                class="px-3 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
                @click="adminStore.updateRequestStatus(req.id, 'rejected')">
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

    <!-- Assign Provider Modal -->
    <div v-if="assignModal" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="assignModal = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Assign Provider</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225] transition-colors" @click="assignModal = null">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        <p class="text-sm text-[#475569] mb-4">Assign a provider for request <strong>#{{ assignModal?.id }}</strong></p>
        <div class="space-y-2 mb-6">
          <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Provider Name</label>
          <input type="text" class="input-gts" v-model="providerInput" placeholder="Enter provider name...">
        </div>
        <button class="btn-gts-primary w-full py-4 rounded-xl" @click="handleAssign" :disabled="!providerInput.trim()">
          <span class="material-icons-round">assignment_ind</span>
          Assign Provider
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
const assignModal = ref(null)
const providerInput = ref('')

const allRequests = computed(() => adminStore.serviceRequests)
const pendingCount = computed(() => allRequests.value.filter(r => r.status === 'pending').length)
const activeCount = computed(() => allRequests.value.filter(r => r.status === 'accepted' || r.status === 'in_progress').length)
const completedCount = computed(() => allRequests.value.filter(r => r.status === 'completed').length)
const rejectedCount = computed(() => allRequests.value.filter(r => r.status === 'rejected').length)

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' }
]

const filteredRequests = computed(() => {
  if (activeTab.value === 'all') return allRequests.value
  if (activeTab.value === 'active') return allRequests.value.filter(r => r.status === 'accepted' || r.status === 'in_progress')
  return allRequests.value.filter(r => r.status === activeTab.value)
})

function statusBadgeClass(status) {
  const map = {
    pending: 'bg-amber-50 text-amber-600',
    accepted: 'bg-[#7630A3]/10 text-[#7630A3]',
    in_progress: 'bg-[#7630A3]/10 text-[#7630A3]',
    completed: 'bg-[#64D2B1]/10 text-[#64D2B1]',
    rejected: 'bg-red-50 text-red-500'
  }
  return map[status] || ''
}

function statusDotClass(status) {
  const map = {
    pending: 'bg-amber-500',
    accepted: 'bg-[#7630A3]',
    in_progress: 'bg-[#7630A3]',
    completed: 'bg-[#64D2B1]',
    rejected: 'bg-red-500'
  }
  return map[status] || ''
}

function formatStatus(status) {
  return status.replace('_', ' ')
}

function openAssignModal(req) {
  assignModal.value = req
  providerInput.value = ''
}

function handleAssign() {
  if (assignModal.value && providerInput.value.trim()) {
    adminStore.assignProvider(assignModal.value.id, providerInput.value.trim())
    assignModal.value = null
  }
}
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.1); }
</style>
