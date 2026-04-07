<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Analytics</h1>
        <p class="text-[#475569] font-medium">Platform performance insights and metrics</p>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-[#7630A3]/10">
          <span class="material-icons-round text-[#7630A3]">people</span>
        </div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ adminStore.allUsers.length }}</div>
        <div class="text-sm text-[#7C757E] font-medium">Total Users</div>
      </div>
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-[#64D2B1]/10">
          <span class="material-icons-round text-[#64D2B1]">store</span>
        </div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ adminStore.approvedBusinesses.length }}</div>
        <div class="text-sm text-[#7C757E] font-medium">Approved Businesses</div>
      </div>
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-[#7630A3]/10">
          <span class="material-icons-round text-[#7630A3]">inventory_2</span>
        </div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ adminStore.products.length }}</div>
        <div class="text-sm text-[#7C757E] font-medium">Total Products</div>
      </div>
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-[#64D2B1]/10">
          <span class="material-icons-round text-[#64D2B1]">assignment</span>
        </div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ adminStore.serviceRequests.length }}</div>
        <div class="text-sm text-[#7C757E] font-medium">Service Requests</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Revenue Trend</h3>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-[0.625rem] font-black uppercase tracking-widest bg-[#64D2B1]/10 text-[#64D2B1]">+24% growth</span>
        </div>
        <div class="flex items-end gap-4 h-[220px]">
          <div v-for="(item, i) in revenueData" :key="i" class="flex-1 flex flex-col items-center h-full">
            <div class="flex-1 w-full flex items-end justify-center">
              <div class="w-[60%] min-w-[24px] max-w-[40px] rounded-t-lg transition-all duration-700 relative group cursor-pointer bg-[#7630A3] hover:bg-[#64D2B1]"
                :style="{ height: `${(item.revenue / maxRevenue) * 100}%` }">
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1225] text-white px-2.5 py-1 rounded-lg text-[0.688rem] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">${{ item.revenue }}</span>
              </div>
            </div>
            <span class="text-xs text-[#7C757E] font-bold mt-2">{{ item.month }}</span>
          </div>
        </div>
      </div>

      <!-- Requests Per Day -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Requests Per Day</h3>
          <span class="badge-primary">This Week</span>
        </div>
        <div class="flex items-end gap-4 h-[220px]">
          <div v-for="(item, i) in requestsPerDay" :key="i" class="flex-1 flex flex-col items-center h-full">
            <div class="flex-1 w-full flex items-end justify-center">
              <div class="w-[60%] min-w-[24px] max-w-[40px] rounded-t-lg transition-all duration-700 relative group cursor-pointer bg-[#64D2B1] hover:bg-[#7630A3]"
                :style="{ height: `${(item.requests / maxRequests) * 100}%`, minHeight: '12px' }">
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1225] text-white px-2.5 py-1 rounded-lg text-[0.688rem] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{{ item.requests }}</span>
              </div>
            </div>
            <span class="text-xs text-[#7C757E] font-bold mt-2">{{ item.day }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Services & Top Businesses -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Services -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <h3 class="font-heading text-lg font-black text-[#1A1225] mb-6">Top Services</h3>
        <div class="flex flex-col gap-4">
          <div v-for="service in topServices" :key="service.name" class="flex items-center gap-4">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm font-bold text-[#1A1225]">{{ service.name }}</span>
                <span class="text-sm text-[#7C757E] font-medium">{{ service.count }} requests</span>
              </div>
              <div class="w-full h-2 bg-[#F8F6FB] rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" :style="{ width: `${(service.count / maxServiceCount) * 100}%`, background: service.color }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Businesses -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <h3 class="font-heading text-lg font-black text-[#1A1225] mb-6">Top Performing Businesses</h3>
        <div class="flex flex-col gap-3">
          <div v-for="(biz, index) in topBusinesses" :key="biz.name"
            class="flex items-center gap-3 p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
              :class="index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-gray-200 text-gray-500' : index === 2 ? 'bg-amber-50 text-amber-500' : 'bg-[#F8F6FB] text-[#7C757E]'">
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-bold text-[#1A1225] truncate">{{ biz.name }}</span>
              <span class="block text-xs text-[#7C757E]">{{ biz.views.toLocaleString() }} views • {{ biz.inquiries }} inquiries</span>
            </div>
            <span class="flex items-center gap-1 text-xs text-amber-500 font-black">
              <span class="material-icons-round text-sm">star</span> {{ biz.rating }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Users Chart -->
    <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm mt-6">
      <h3 class="font-heading text-lg font-black text-[#1A1225] mb-6">User Status Distribution</h3>
      <div class="flex flex-col gap-5">
        <div v-for="segment in userDistribution" :key="segment.label">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2.5">
              <span class="material-icons-round" :style="{ color: segment.color }">{{ segment.icon }}</span>
              <span class="text-sm font-bold text-[#1A1225]">{{ segment.label }}</span>
            </div>
            <span class="text-sm text-[#7C757E]">{{ segment.count }} users ({{ segment.percentage }}%)</span>
          </div>
          <div class="w-full h-2.5 bg-[#F8F6FB] rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700" :style="{ width: `${segment.percentage}%`, background: segment.color }"></div>
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
const revenueData = computed(() => adminStore.getRevenueData())
const requestsPerDay = computed(() => adminStore.getRequestsPerDay())
const topServices = computed(() => adminStore.getTopServices())
const topBusinesses = computed(() => adminStore.getTopBusinesses())

const maxRevenue = computed(() => Math.max(...revenueData.value.map(r => r.revenue)))
const maxRequests = computed(() => Math.max(...requestsPerDay.value.map(r => r.requests)))
const maxServiceCount = computed(() => Math.max(...topServices.value.map(s => s.count)))

const userDistribution = computed(() => {
  const total = adminStore.allUsers.length
  const active = adminStore.activeUsers.length
  const suspended = adminStore.suspendedUsers.length
  const customers = adminStore.customerUsers.length
  return [
    { label: 'Active Users', count: active, percentage: total > 0 ? Math.round((active / total) * 100) : 0, color: '#64D2B1', icon: 'check_circle' },
    { label: 'Suspended', count: suspended, percentage: total > 0 ? Math.round((suspended / total) * 100) : 0, color: '#ef4444', icon: 'block' },
    { label: 'Customers', count: customers, percentage: total > 0 ? Math.round((customers / total) * 100) : 0, color: '#7630A3', icon: 'person' }
  ]
})
</script>
