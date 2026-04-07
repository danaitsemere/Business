<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Welcome back, Admin</h1>
      <p class="text-[#475569] font-medium">Here's what's happening on your platform today</p>
    </div>

    <!-- Key Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(stat, i) in stats" :key="i" class="stat-card-gts group cursor-pointer">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" :style="{ background: stat.bg }">
            <span class="material-icons-round text-2xl" :style="{ color: stat.color }">{{ stat.icon }}</span>
          </div>
          <div class="flex flex-col items-end gap-0.5">
            <div class="flex items-center gap-1 text-xs font-black" :class="stat.trendUp ? 'text-[#64D2B1]' : 'text-[#7C757E]'">
              <span class="material-icons-round text-base">{{ stat.trendUp ? 'trending_up' : 'trending_flat' }}</span>
              {{ stat.trend }}
            </div>
            <span v-if="stat.trendLabel" class="text-[0.5rem] font-bold text-[#7C757E] uppercase tracking-wider">{{ stat.trendLabel }}</span>
          </div>
        </div>
        <div class="font-heading text-3xl font-black text-[#1A1225]">{{ stat.value }}</div>
        <div class="text-sm text-[#475569] font-medium mt-1">{{ stat.label }}</div>
      </div>
    </div>


    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Revenue Overview</h3>
          <span class="badge-primary">Last 7 months</span>
        </div>
        <div class="flex items-end gap-4 h-[200px]">
          <div v-for="(item, i) in revenueData" :key="i" class="flex-1 flex flex-col items-center h-full">
            <div class="flex-1 w-full flex items-end justify-center">
              <div class="w-[60%] min-w-[24px] max-w-[40px] rounded-t-lg transition-all duration-700 relative group cursor-pointer bg-[#7630A3] hover:bg-[#64D2B1]"
                :style="{ height: `${(item.revenue / maxRevenue) * 100}%` }">
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1225] text-white px-2.5 py-1 rounded-lg text-[0.688rem] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">ETB {{ item.revenue.toLocaleString() }}</span>
              </div>
            </div>
            <span class="text-xs text-[#7C757E] font-bold mt-2">{{ item.month }}</span>
          </div>
        </div>
      </div>

      <!-- User Growth -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Customer Growth</h3>
          <span class="badge-primary">Monthly new users</span>
        </div>
        <div class="flex items-end gap-4 h-[200px]">
          <div v-for="(item, i) in userGrowthData" :key="i" class="flex-1 flex flex-col items-center h-full">
            <div class="flex-1 w-full flex items-end justify-center">
              <div class="w-[60%] min-w-[24px] max-w-[40px] bg-[#64D2B1] rounded-t-lg transition-all duration-700 relative group cursor-pointer hover:bg-[#7630A3]"
                :style="{ height: `${(item.customers / maxCustomers) * 100}%`, minHeight: item.customers > 0 ? '12px' : '4px' }">
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1225] text-white px-2.5 py-1 rounded-lg text-[0.688rem] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{{ item.customers }} users</span>
              </div>
            </div>
            <span class="text-xs text-[#7C757E] font-bold mt-2">{{ item.month }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Items + Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Pending Businesses -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Pending Approvals</h3>
          <router-link to="/admin/verifications" class="text-[#7630A3] font-black text-sm hover:underline flex items-center gap-1">
            View All <span class="material-icons-round text-base">arrow_forward</span>
          </router-link>
        </div>
        <div v-if="pendingBusinesses.length === 0" class="text-center py-8 text-[#7C757E]">
          <span class="material-icons-round text-4xl mb-2 block text-[#EEEAF2]">verified</span>
          <p class="font-medium">All caught up! No pending approvals.</p>
        </div>
        <div v-else class="flex flex-col gap-3">
          <div v-for="biz in pendingBusinesses" :key="biz.id"
            class="flex items-center gap-4 p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2] hover:border-[#7630A3]/20 transition-all">
            <div class="w-11 h-11 bg-white rounded-xl flex items-center justify-center font-black text-[#7630A3] text-sm border border-[#EEEAF2]">
              {{ biz.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-black text-[#1A1225] truncate">{{ biz.name }}</span>
              <span class="block text-xs text-[#7C757E] font-medium">{{ biz.category }} • Submitted {{ formatRelativeDate(biz.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button class="w-8 h-8 rounded-lg bg-[#64D2B1]/10 text-[#64D2B1] flex items-center justify-center hover:bg-[#64D2B1] hover:text-white transition-all"
                @click="adminStore.approveBusiness(biz.id)" title="Approve">
                <span class="material-icons-round text-lg">check</span>
              </button>
              <button class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                @click="adminStore.rejectBusiness(biz.id)" title="Reject">
                <span class="material-icons-round text-lg">close</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Recent Activity</h3>
        </div>
        <div class="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          <div v-for="log in recentLogs" :key="log.id"
            class="flex items-center gap-3 p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              :class="{
                'bg-[#7630A3]/10 text-[#7630A3]': log.severity === 'info',
                'bg-[#64D2B1]/10 text-[#64D2B1]': log.severity === 'success',
                'bg-amber-100 text-amber-600': log.severity === 'warning',
                'bg-red-50 text-red-500': log.severity === 'danger'
              }">
              <span class="material-icons-round text-lg">{{ log.icon }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm text-[#475569] font-medium truncate">{{ log.message }}</span>
              <span class="block text-xs text-[#7C757E]">{{ formatTime(log.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const ps = computed(() => adminStore.platformStats)
const pendingBusinesses = computed(() => adminStore.pendingBusinesses)
const revenueData = computed(() => adminStore.getRevenueData())
const userGrowthData = computed(() => adminStore.getUserGrowthData())
const recentLogs = computed(() => adminStore.getSystemLogs().slice(0, 6))

const maxRevenue = computed(() => Math.max(...revenueData.value.map(r => r.revenue)))
const maxCustomers = computed(() => Math.max(...userGrowthData.value.map(u => u.customers), 1))

const stats = computed(() => [
  { icon: 'people', label: 'Total Users', value: adminStore.allUsers.length.toString(), bg: 'rgba(118,48,163,0.1)', color: '#7630A3', trend: '+18.5%', trendLabel: 'vs last month', trendUp: true },
  { icon: 'store', label: 'Businesses', value: adminStore.businesses.length.toString(), bg: 'rgba(100,210,177,0.1)', color: '#64D2B1', trend: adminStore.pendingBusinesses.length + ' pending', trendUp: false },
  { icon: 'assignment', label: 'Service Requests', value: adminStore.serviceRequests.length.toString(), bg: 'rgba(118,48,163,0.1)', color: '#7630A3', trend: adminStore.pendingRequests.length + ' pending', trendUp: false },
  { icon: 'payments', label: 'Revenue', value: `ETB ${ps.value.totalRevenue.toLocaleString()}`, bg: 'rgba(100,210,177,0.1)', color: '#64D2B1', trend: '+24%', trendLabel: 'vs last month', trendUp: true }
])


function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 60000)
  if (diff < 60) return `${diff}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return date.toLocaleDateString()
}

function formatRelativeDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now - date) / 86400000)
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.1); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #7630A320; border-radius: 10px; }
</style>
