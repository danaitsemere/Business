<template>
  <div class="animate-fade-in">
   
    <button @click="$router.push('/admin/service-requests')" class="flex items-center gap-2 text-[#7630A3] font-black text-sm hover:gap-3 transition-all mb-6">
      <span class="material-icons-round text-base">arrow_back</span> Back to Requests
    </button>

    <div v-if="request" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
     
      <div class="lg:col-span-2 space-y-6">
        
        <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <h1 class="font-heading text-2xl font-black text-[#1A1225]">Request #{{ request.id }}</h1>
              <span class="text-lg">{{ request.priority === 'high' ? '🔴' : request.priority === 'medium' ? '🟡' : '🟢' }}</span>
              <span :class="statusBadgeClass(request.status)" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[0.625rem] font-black uppercase tracking-widest">
                <span class="w-2 h-2 rounded-full" :class="statusDotClass(request.status)"></span>
                {{ formatStatus(request.status) }}
              </span>
            </div>
            <span class="text-xs text-[#7C757E] font-medium uppercase tracking-widest">{{ request.priority }} priority</span>
          </div>

          <h2 class="font-heading text-lg font-black text-[#1A1225] mb-3">{{ request.serviceType }}</h2>
          <p class="text-[#475569] leading-relaxed mb-6">{{ request.description }}</p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
              <div class="text-[0.625rem] text-[#7C757E] font-black uppercase tracking-widest mb-1">Customer</div>
              <div class="text-sm font-bold text-[#1A1225]">{{ request.customerName }}</div>
            </div>
            <div class="p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
              <div class="text-[0.625rem] text-[#7C757E] font-black uppercase tracking-widest mb-1">Location</div>
              <div class="text-sm font-bold text-[#1A1225]">{{ request.location }}</div>
            </div>
            <div class="p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
              <div class="text-[0.625rem] text-[#7C757E] font-black uppercase tracking-widest mb-1">Estimated Cost</div>
              <div class="text-sm font-bold text-[#7630A3]">ETB {{ request.estimatedCost?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
            </div>
            <div class="p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
              <div class="text-[0.625rem] text-[#7C757E] font-black uppercase tracking-widest mb-1">Payment</div>
              <div class="text-sm font-bold" :class="{
                'text-[#64D2B1]': request.paymentStatus === 'paid',
                'text-amber-500': request.paymentStatus === 'pending',
                'text-red-500': request.paymentStatus === 'refunded'
              }">{{ (request.paymentStatus || 'pending').toUpperCase() }}</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
          <h3 class="font-heading text-lg font-black text-[#1A1225] mb-6">Status Timeline</h3>
          <div class="relative">
            <div class="absolute left-[18px] top-2 bottom-2 w-0.5 bg-[#EEEAF2]"></div>
            <div v-for="(entry, i) in (request.statusHistory || [])" :key="i" class="flex items-start gap-4 mb-6 last:mb-0 relative">
              <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10"
                :class="i === (request.statusHistory || []).length - 1 ? 'bg-[#7630A3] text-white' : 'bg-[#F8F6FB] text-[#7C757E] border border-[#EEEAF2]'">
                <span class="material-icons-round text-base">{{ getStatusIcon(entry.status) }}</span>
              </div>
              <div class="flex-1 pt-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold text-[#1A1225] capitalize">{{ entry.status.replace(/_/g, ' ') }}</span>
                  <span class="text-xs text-[#7C757E] font-medium">{{ formatDate(entry.date) }}</span>
                </div>
                <p class="text-xs text-[#475569] mt-0.5">{{ entry.note }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
  
        <div class="bg-white rounded-3xl p-6 border border-[#EEEAF2] shadow-sm">
          <h3 class="font-heading text-base font-black text-[#1A1225] mb-4">Assigned Provider</h3>
          <div v-if="request.providerName" class="flex items-center gap-3 p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
            <div class="w-12 h-12 rounded-xl bg-[#7630A3] flex items-center justify-center text-white font-black text-sm">
              {{ request.providerName.charAt(0) }}
            </div>
            <div>
              <span class="block text-sm font-bold text-[#1A1225]">{{ request.providerName }}</span>
              <span class="block text-xs text-[#7C757E]">Assigned {{ formatDate(request.assignedAt) }}</span>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <span class="material-icons-round text-3xl text-[#EEEAF2] block mb-2">person_off</span>
            <p class="text-sm text-[#7C757E] font-medium mb-4">No provider assigned</p>
            <button v-if="request.status === 'pending'" class="btn-gts-primary w-full py-3 text-sm" @click="showAssign = true">
              <span class="material-icons-round text-base">person_add</span> Assign Provider
            </button>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 border border-[#EEEAF2] shadow-sm">
          <h3 class="font-heading text-base font-black text-[#1A1225] mb-4">Admin Actions</h3>
          <div class="flex flex-col gap-3">
            <button v-if="request.status === 'pending' && !request.providerName"
              class="w-full py-3 rounded-xl bg-[#7630A3]/10 text-[#7630A3] font-bold text-sm hover:bg-[#7630A3] hover:text-white transition-all flex items-center justify-center gap-2"
              @click="showAssign = true">
              <span class="material-icons-round text-base">person_add</span> Assign Provider
            </button>
            <button v-if="request.status === 'pending' || request.status === 'assigned'"
              class="w-full py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
              @click="showReject = true">
              <span class="material-icons-round text-base">cancel</span> Reject Request
            </button>
            <div v-if="request.status === 'completed'" class="text-center py-4">
              <span class="material-icons-round text-3xl text-[#64D2B1] block mb-1">task_alt</span>
              <span class="text-sm font-bold text-[#64D2B1]">Completed {{ formatDate(request.completedAt) }}</span>
            </div>
            <div v-if="request.status === 'rejected'" class="text-center py-4">
              <span class="material-icons-round text-3xl text-red-500 block mb-1">cancel</span>
              <span class="text-sm font-bold text-red-500">Rejected</span>
              <p v-if="request.rejectionReason" class="text-xs text-[#7C757E] mt-1">{{ request.rejectionReason }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 border border-[#EEEAF2] shadow-sm">
          <h3 class="font-heading text-base font-black text-[#1A1225] mb-4">Key Dates</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-[#7C757E] font-medium">Created</span>
              <span class="text-xs font-bold text-[#1A1225]">{{ formatDate(request.createdAt) }}</span>
            </div>
            <div v-if="request.assignedAt" class="flex items-center justify-between">
              <span class="text-xs text-[#7C757E] font-medium">Assigned</span>
              <span class="text-xs font-bold text-[#1A1225]">{{ formatDate(request.assignedAt) }}</span>
            </div>
            <div v-if="request.completedAt" class="flex items-center justify-between">
              <span class="text-xs text-[#7C757E] font-medium">Completed</span>
              <span class="text-xs font-bold text-[#64D2B1]">{{ formatDate(request.completedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16 text-[#7C757E]">
      <span class="material-icons-round text-5xl mb-3 block text-[#EEEAF2]">search_off</span>
      <p class="text-lg font-medium">Request not found</p>
      <router-link to="/admin/service-requests" class="text-[#7630A3] font-black text-sm mt-2 inline-block hover:underline">← Back to requests</router-link>
    </div>

    <div v-if="showAssign" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showAssign = false">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Assign Provider</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225]" @click="showAssign = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
          <div v-for="provider in adminStore.providers" :key="provider.id"
            class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all"
            :class="selectedProvider?.id === provider.id ? 'border-[#7630A3] bg-[#7630A3]/5' : 'border-[#EEEAF2] hover:border-[#7630A3]/30'"
            @click="selectedProvider = provider">
            <div class="w-10 h-10 rounded-xl bg-[#F8F6FB] flex items-center justify-center text-[#7630A3] font-black text-sm border border-[#EEEAF2]">{{ provider.name.charAt(0) }}</div>
            <div class="flex-1"><span class="block text-sm font-bold text-[#1A1225]">{{ provider.name }}</span><span class="block text-xs text-[#7C757E]">{{ provider.category }} • ⭐ {{ provider.rating }}</span></div>
            <span v-if="selectedProvider?.id === provider.id" class="material-icons-round text-[#7630A3]">check_circle</span>
          </div>
        </div>
        <button class="btn-gts-primary w-full py-4 rounded-xl" @click="handleAssign" :disabled="!selectedProvider">
          <span class="material-icons-round">assignment_ind</span> Assign Provider
        </button>
      </div>
    </div>

    <div v-if="showReject" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showReject = false">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Reject Request</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225]" @click="showReject = false"><span class="material-icons-round">close</span></button>
        </div>
        <div class="space-y-2 mb-6">
          <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Reason</label>
          <textarea class="input-gts min-h-[100px] resize-none" v-model="rejectReason" placeholder="Enter reason..."></textarea>
        </div>
        <button class="w-full py-4 rounded-xl bg-red-500 text-white font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2" @click="handleReject">
          <span class="material-icons-round">cancel</span> Reject
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '../../store/adminStore.js'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const showAssign = ref(false)
const showReject = ref(false)
const selectedProvider = ref(null)
const rejectReason = ref('')

const request = computed(() => {
  const id = parseInt(route.params.id)
  return adminStore.serviceRequests.find(r => r.id === id)
})

function statusBadgeClass(status) {
  const map = { pending: 'bg-amber-50 text-amber-600', assigned: 'bg-blue-50 text-blue-600', in_progress: 'bg-[#7630A3]/10 text-[#7630A3]', completed: 'bg-[#64D2B1]/10 text-[#64D2B1]', rejected: 'bg-red-50 text-red-500' }
  return map[status] || ''
}
function statusDotClass(status) {
  const map = { pending: 'bg-amber-500', assigned: 'bg-blue-500', in_progress: 'bg-[#7630A3]', completed: 'bg-[#64D2B1]', rejected: 'bg-red-500' }
  return map[status] || ''
}
function formatStatus(s) { return s.replace(/_/g, ' ') }
function getStatusIcon(status) {
  const map = { pending: 'schedule', assigned: 'person_add', in_progress: 'play_circle', completed: 'check_circle', rejected: 'cancel' }
  return map[status] || 'info'
}
function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function handleAssign() {
  if (request.value && selectedProvider.value) {
    adminStore.assignProvider(request.value.id, selectedProvider.value.id, selectedProvider.value.name)
    showAssign.value = false
    selectedProvider.value = null
  }
}
function handleReject() {
  if (request.value) {
    adminStore.rejectRequest(request.value.id, rejectReason.value)
    showReject.value = false
    rejectReason.value = ''
  }
}
</script>
