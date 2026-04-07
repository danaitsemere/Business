<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Verification Center</h1>
        <p class="text-[#475569] font-medium">Review and approve business applications</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <button v-for="tab in tabs" :key="tab.value"
        class="px-5 py-2.5 rounded-full text-[0.813rem] font-bold border-2 transition-all duration-200"
        :class="activeTab === tab.value
          ? 'bg-[#7630A3] border-[#7630A3] text-white shadow-soft'
          : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]/30'"
        @click="activeTab = tab.value">
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <!-- Business Verification Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="biz in displayedBusinesses" :key="biz.id"
        class="bg-white rounded-3xl border border-[#EEEAF2] p-6 shadow-sm hover:shadow-soft transition-all">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl bg-[#F8F6FB] border border-[#EEEAF2] flex items-center justify-center font-black text-[#7630A3] text-xl shrink-0">
            {{ biz.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-heading text-lg font-black text-[#1A1225] truncate">{{ biz.name }}</h3>
              <span :class="{
                'bg-[#64D2B1]/10 text-[#64D2B1]': biz.status === 'approved',
                'bg-amber-50 text-amber-600': biz.status === 'pending',
                'bg-red-50 text-red-500': biz.status === 'rejected'
              }" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.5rem] font-black uppercase tracking-widest shrink-0">
                {{ biz.status }}
              </span>
            </div>
            <p class="text-sm text-[#7C757E] mb-3">{{ biz.category }} • {{ biz.location }}</p>

            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
                <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Email</div>
                <div class="text-sm text-[#1A1225] font-medium truncate">{{ biz.email }}</div>
              </div>
              <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
                <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Phone</div>
                <div class="text-sm text-[#1A1225] font-medium">{{ biz.phone }}</div>
              </div>
              <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
                <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Applied</div>
                <div class="text-sm text-[#1A1225] font-medium">{{ biz.createdAt }}</div>
              </div>
              <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
                <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Products</div>
                <div class="text-sm text-[#1A1225] font-medium">{{ biz.productCount }}</div>
              </div>
            </div>

            <!-- Mock Documents -->
            <div v-if="biz.documents && biz.documents.length" class="mb-4">
              <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-2">Submitted Documents</p>
              <div class="flex flex-wrap gap-2">
                <div v-for="doc in biz.documents" :key="doc" class="flex items-center gap-2 px-3 py-2 bg-[#F8F6FB] rounded-xl text-sm text-[#475569] border border-[#EEEAF2]">
                  <span class="material-icons-round text-base text-[#7630A3]">description</span>
                  {{ doc }}
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="biz.status === 'pending'" class="flex items-center gap-3">
              <button class="flex-1 py-3 rounded-xl bg-[#64D2B1] text-white font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
                @click="adminStore.approveBusiness(biz.id)">
                <span class="material-icons-round text-base">check_circle</span>
                Approve
              </button>
              <button class="flex-1 py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                @click="adminStore.rejectBusiness(biz.id)">
                <span class="material-icons-round text-base">cancel</span>
                Reject
              </button>
            </div>
            <div v-else-if="biz.status === 'approved'" class="flex items-center gap-2 text-sm text-[#64D2B1] font-bold">
              <span class="material-icons-round text-base">verified</span>
              Business approved
            </div>
            <div v-else class="flex items-center gap-2 text-sm text-red-500 font-bold">
              <span class="material-icons-round text-base">cancel</span>
              Business rejected
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="displayedBusinesses.length === 0" class="text-center py-16 text-[#7C757E]">
      <span class="material-icons-round text-5xl mb-3 block text-[#EEEAF2]">verified</span>
      <p class="text-lg font-medium">{{ activeTab === 'pending' ? 'No pending verifications' : 'No businesses found' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const activeTab = ref('pending')

const tabs = computed(() => [
  { value: 'pending', label: 'Pending', count: adminStore.pendingBusinesses.length },
  { value: 'approved', label: 'Approved', count: adminStore.approvedBusinesses.length },
  { value: 'rejected', label: 'Rejected', count: adminStore.rejectedBusinesses.length },
  { value: 'all', label: 'All', count: adminStore.businesses.length }
])

const displayedBusinesses = computed(() => {
  if (activeTab.value === 'all') return adminStore.businesses
  return adminStore.businesses.filter(b => b.status === activeTab.value)
})
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.1); }
</style>
