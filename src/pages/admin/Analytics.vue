<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Analytics</h1>
        <p class="text-[#475569] font-medium">Platform performance insights and metrics</p>
      </div>
      <div class="flex items-center gap-3">
      
        <select class="input-gts max-w-[180px]" v-model="timeRange">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
      
        <div class="relative">
          <button class="px-4 py-3 rounded-xl bg-white border border-[#EEEAF2] text-[#475569] text-sm font-bold hover:border-[#7630A3] hover:text-[#7630A3] transition-all flex items-center gap-2"
            @click="showExport = !showExport">
            <span class="material-icons-round text-lg">download</span> Export
          </button>
          <div v-if="showExport" class="absolute right-0 top-full mt-2 bg-white border border-[#EEEAF2] rounded-2xl shadow-2xl p-2 min-w-[160px] z-50">
            <button class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[#475569] hover:bg-[#F8F6FB] hover:text-[#7630A3] transition-all flex items-center gap-3"
              @click="handleExport('csv')">
              <span class="material-icons-round text-base">table_chart</span> Export CSV
            </button>
            <button class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[#475569] hover:bg-[#F8F6FB] hover:text-[#7630A3] transition-all flex items-center gap-3"
              @click="handleExport('pdf')">
              <span class="material-icons-round text-base">picture_as_pdf</span> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>

   
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-[#7630A3]/10">
          <span class="material-icons-round text-[#7630A3]">people</span>
        </div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ filteredUsers.length }}</div>
        <div class="text-sm text-[#7C757E] font-medium">Total Users</div>
      </div>
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-[#64D2B1]/10">
          <span class="material-icons-round text-[#64D2B1]">store</span>
        </div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ filteredBusinessCount }}</div>
        <div class="text-sm text-[#7C757E] font-medium">Approved Businesses</div>
      </div>
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-[#7630A3]/10">
          <span class="material-icons-round text-[#7630A3]">inventory_2</span>
        </div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ filteredProductCount }}</div>
        <div class="text-sm text-[#7C757E] font-medium">Total Products</div>
      </div>
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-[#64D2B1]/10">
          <span class="material-icons-round text-[#64D2B1]">assignment</span>
        </div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ filteredRequestCount }}</div>
        <div class="text-sm text-[#7C757E] font-medium">Service Requests</div>
      </div>
    </div>

  
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
   
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Revenue Trend</h3>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-[0.625rem] font-black uppercase tracking-widest bg-[#64D2B1]/10 text-[#64D2B1]">+24% vs last month</span>
        </div>
        <div class="flex items-end gap-4 h-[220px]">
          <div v-for="(item, i) in filteredRevenueData" :key="i" class="flex-1 flex flex-col items-center h-full">
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

    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
     
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
import { ref, computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const timeRange = ref('30d')
const showExport = ref(false)


const filteredRevenueData = computed(() => {
  const allData = adminStore.getRevenueData()
  if (timeRange.value === '7d') return allData.slice(-2)
  if (timeRange.value === '30d') return allData.slice(-4)
  if (timeRange.value === '90d') return allData.slice(-6)
  return allData
})

const requestsPerDay = computed(() => adminStore.getRequestsPerDay())
const topServices = computed(() => adminStore.getTopServices())
const topBusinesses = computed(() => adminStore.getTopBusinesses())

const filteredUsers = computed(() => {
  if (timeRange.value === 'all') return adminStore.allUsers
  const now = new Date()
  const daysMap = { '7d': 7, '30d': 30, '90d': 90 }
  const days = daysMap[timeRange.value] || 9999
  const cutoff = new Date(now.getTime() - days * 86400000)
  return adminStore.allUsers.filter(u => new Date(u.createdAt) >= cutoff)
})

const filteredBusinessCount = computed(() => {
  if (timeRange.value === 'all') return adminStore.approvedBusinesses.length
  const now = new Date()
  const daysMap = { '7d': 7, '30d': 30, '90d': 90 }
  const days = daysMap[timeRange.value] || 9999
  const cutoff = new Date(now.getTime() - days * 86400000)
  return adminStore.approvedBusinesses.filter(b => new Date(b.createdAt) >= cutoff).length || adminStore.approvedBusinesses.length
})

const filteredProductCount = computed(() => {
  if (timeRange.value === 'all') return adminStore.products.length
  const now = new Date()
  const daysMap = { '7d': 7, '30d': 30, '90d': 90 }
  const days = daysMap[timeRange.value] || 9999
  const cutoff = new Date(now.getTime() - days * 86400000)
  return adminStore.products.filter(p => new Date(p.createdAt) >= cutoff).length || adminStore.products.length
})

const filteredRequestCount = computed(() => {
  if (timeRange.value === 'all') return adminStore.serviceRequests.length
  const now = new Date()
  const daysMap = { '7d': 7, '30d': 30, '90d': 90 }
  const days = daysMap[timeRange.value] || 9999
  const cutoff = new Date(now.getTime() - days * 86400000)
  return adminStore.serviceRequests.filter(r => new Date(r.createdAt) >= cutoff).length || adminStore.serviceRequests.length
})

const maxRevenue = computed(() => Math.max(...filteredRevenueData.value.map(r => r.revenue)))
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

function generateExportData() {
  const rangeLabel = { '7d': 'Last 7 Days', '30d': 'Last 30 Days', '90d': 'Last 90 Days', 'all': 'All Time' }
  return {
    title: `GTS Platform Analytics Report – ${rangeLabel[timeRange.value]}`,
    generatedAt: new Date().toISOString().split('T')[0],
    metrics: {
      totalUsers: filteredUsers.value.length,
      approvedBusinesses: filteredBusinessCount.value,
      totalProducts: filteredProductCount.value,
      serviceRequests: filteredRequestCount.value
    },
    revenue: filteredRevenueData.value,
    topServices: topServices.value,
    topBusinesses: topBusinesses.value,
    requestsPerDay: requestsPerDay.value
  }
}

function handleExport(format) {
  showExport.value = false
  const data = generateExportData()

  if (format === 'csv') {
    let csv = 'GTS Platform Analytics Report\n'
    csv += `Period,${data.title}\n`
    csv += `Generated,${data.generatedAt}\n\n`
    csv += 'KEY METRICS\n'
    csv += `Total Users,${data.metrics.totalUsers}\n`
    csv += `Approved Businesses,${data.metrics.approvedBusinesses}\n`
    csv += `Total Products,${data.metrics.totalProducts}\n`
    csv += `Service Requests,${data.metrics.serviceRequests}\n\n`
    csv += 'REVENUE TREND\n'
    csv += 'Month,Revenue (ETB)\n'
    data.revenue.forEach(r => { csv += `${r.month},${r.revenue}\n` })
    csv += '\nTOP SERVICES\n'
    csv += 'Service,Request Count\n'
    data.topServices.forEach(s => { csv += `${s.name},${s.count}\n` })
    csv += '\nTOP BUSINESSES\n'
    csv += 'Business,Views,Inquiries,Rating\n'
    data.topBusinesses.forEach(b => { csv += `${b.name},${b.views},${b.inquiries},${b.rating}\n` })
    csv += '\nREQUESTS PER DAY\n'
    csv += 'Day,Requests\n'
    data.requestsPerDay.forEach(r => { csv += `${r.day},${r.requests}\n` })

    const blob = new Blob([csv], { type: 'text/csv' })
    downloadBlob(blob, `gts_analytics_${data.generatedAt}.csv`)
  } else {
  
    let report = `GTS PLATFORM ANALYTICS REPORT\n`
    report += `${'='.repeat(50)}\n`
    report += `Period: ${data.title}\n`
    report += `Generated: ${data.generatedAt}\n\n`
    report += `KEY METRICS\n${'-'.repeat(30)}\n`
    report += `Total Users: ${data.metrics.totalUsers}\n`
    report += `Approved Businesses: ${data.metrics.approvedBusinesses}\n`
    report += `Total Products: ${data.metrics.totalProducts}\n`
    report += `Service Requests: ${data.metrics.serviceRequests}\n\n`
    report += `REVENUE TREND (ETB)\n${'-'.repeat(30)}\n`
    data.revenue.forEach(r => { report += `${r.month}: ETB ${r.revenue.toLocaleString()}\n` })
    report += `\nTOP SERVICES\n${'-'.repeat(30)}\n`
    data.topServices.forEach(s => { report += `${s.name}: ${s.count} requests\n` })
    report += `\nTOP BUSINESSES\n${'-'.repeat(30)}\n`
    data.topBusinesses.forEach(b => { report += `${b.name} – ${b.views.toLocaleString()} views, ${b.inquiries} inquiries, ⭐ ${b.rating}\n` })

    const blob = new Blob([report], { type: 'text/plain' })
    downloadBlob(blob, `gts_analytics_${data.generatedAt}.txt`)
  }
  adminStore.showToast(`Analytics exported as ${format.toUpperCase()}`, 'success')
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
