<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Welcome back, Admin</h1>
      <p class="text-[#475569] font-medium">Here's what's happening on your platform today</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <router-link
        v-for="(stat, i) in stats"
        :key="i"
        :to="stat.route"
        class="bg-white rounded-2xl px-6 py-4 border border-[#EEEAF2] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer block no-underline"
      >
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" :style="{ background: stat.bg }">
            <component :is="stat.iconComp" class="w-5 h-5" :style="{ color: stat.color }" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs text-[#475569] font-medium">{{ stat.label }}</div>
            <div class="font-heading text-2xl font-black text-[#1A1225] leading-tight">{{ stat.value }}</div>
          </div>
          <div class="flex flex-col items-end gap-0.5 shrink-0">
            <div class="flex items-center gap-1 text-[0.688rem] font-black" :class="stat.trendUp ? 'text-[#64D2B1]' : 'text-amber-500'">
              <component :is="stat.trendUp ? TrendingUp : Clock" class="w-3.5 h-3.5" />
              {{ stat.trend }}
            </div>
            <span v-if="stat.trendLabel" class="text-[0.5rem] font-bold text-[#7C757E] uppercase tracking-wider">{{ stat.trendLabel }}</span>
          </div>
        </div>
        <div v-if="stat.detail" class="text-[0.625rem] text-[#7C757E] font-medium mt-2 pl-[60px]">{{ stat.detail }}</div>
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Revenue Overview</h3>
          <select class="select-gts max-w-[150px] text-sm" v-model="revenueFilter" @change="rebuildRevenueChart()">
            <option value="7m">Last 7 Months</option>
            <option value="3m">Last 3 Months</option>
            <option value="1m">Last 1 Month</option>
          </select>
        </div>
        <div class="flex items-center gap-4 mb-4">
          <span class="flex items-center gap-1.5 text-[0.688rem] font-bold text-[#7C757E]">
            <span class="w-3 h-3 rounded-sm bg-[#7630A3] inline-block"></span> Previous
          </span>
          <span class="flex items-center gap-1.5 text-[0.688rem] font-bold text-[#7C757E]">
            <span class="w-3 h-3 rounded-sm bg-[#64D2B1] inline-block"></span> Current
          </span>
        </div>
        <div class="h-[240px]">
          <canvas ref="revenueChartEl"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-heading text-lg font-black text-[#1A1225]">User Growth</h3>
            <p class="text-xs text-[#7C757E] font-medium mt-0.5">Monthly new registrations</p>
          </div>
          <span class="badge-primary">Monthly</span>
        </div>
        <div class="h-[240px]">
          <canvas ref="growthChartEl"></canvas>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Status Distribution</h3>
          <select class="select-gts max-w-[150px] text-sm" v-model="distFilter" @change="rebuildDistChart()">
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="business">Business</option>
            <option value="service">Service</option>
          </select>
        </div>
        <div class="h-[260px] flex items-center justify-center">
          <canvas ref="userDistChartEl"></canvas>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <h3 class="font-heading text-lg font-black text-[#1A1225] mb-6">Top Services</h3>
        <div v-if="topServices.length === 0" class="text-center py-8 text-[#7C757E]">
          <BarChart3 class="w-10 h-10 mx-auto mb-2 text-[#EEEAF2]" />
          <p class="font-medium">No service data available yet.</p>
        </div>
        <div v-else class="flex flex-col gap-4">
          <div v-for="(service, idx) in topServices" :key="service.name" class="flex items-center gap-4">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm font-bold text-[#1A1225]">{{ service.name }}</span>
                <span class="text-sm text-[#7C757E] font-medium">{{ service.count }} requests · {{ servicePercentage(service.count) }}%</span>
              </div>
              <div class="w-full h-2 bg-[#F8F6FB] rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" :style="{ width: `${servicePercentage(service.count)}%`, background: serviceColors[idx % serviceColors.length] }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Top Performing Businesses</h3>
          <router-link to="/admin/businesses" class="text-[#7630A3] font-black text-sm hover:underline flex items-center gap-1">
            View All <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
        <div v-if="topBusinesses.length === 0" class="text-center py-8 text-[#7C757E]">
          <Store class="w-10 h-10 mx-auto mb-2 text-[#EEEAF2]" />
          <p class="font-medium">No business data available yet.</p>
        </div>
        <div v-else class="flex flex-col gap-3">
          <router-link
            v-for="(biz, index) in topBusinesses"
            :key="biz.name"
            to="/admin/businesses"
            class="flex items-center gap-3 p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2] hover:border-[#7630A3]/20 transition-all no-underline block"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
              :class="index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-gray-200 text-gray-500' : index === 2 ? 'bg-amber-50 text-amber-500' : 'bg-[#F8F6FB] text-[#7C757E]'">
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-bold text-[#1A1225] truncate">{{ biz.name }}</span>
              <span class="block text-xs text-[#7C757E]">{{ biz.inquiries }} requests · {{ biz.products }} products</span>
            </div>
            <span class="flex items-center gap-1 text-xs text-amber-500 font-black">
              <Star class="w-4 h-4 fill-current" /> {{ biz.rating.toFixed(1) }} / 5
            </span>
          </router-link>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Pending Approvals</h3>
          <div class="flex items-center gap-2">
            <select class="select-gts max-w-[170px] text-sm" v-model="pendingFilter">
              <option value="business">Businesses</option>
              <option value="provider">Service Providers</option>
            </select>
            <router-link to="/admin/verifications" class="text-[#7630A3] font-black text-sm hover:underline flex items-center gap-1">
              <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>
        </div>
        <div v-if="filteredPendingItems.length === 0" class="text-center py-8 text-[#7C757E]">
          <BadgeCheck class="w-10 h-10 mx-auto mb-2 text-[#EEEAF2]" />
          <p class="font-medium">All caught up! No pending {{ pendingFilter === 'business' ? 'business' : 'service provider' }} approvals.</p>
        </div>
        <div v-else class="flex flex-col gap-3">
          <div v-for="item in filteredPendingItems" :key="item.id"
            class="flex items-center gap-4 p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2] hover:border-[#7630A3]/20 transition-all">
            <div class="w-11 h-11 bg-white rounded-xl flex items-center justify-center font-black text-sm border border-[#EEEAF2]"
              :class="pendingFilter === 'business' ? 'text-[#7630A3]' : 'text-[#64D2B1]'">
              {{ item.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-black text-[#1A1225] truncate">{{ item.name }}</span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[0.625rem] font-black uppercase tracking-wider"
                  :class="pendingFilter === 'business' ? 'bg-amber-100 text-amber-600' : 'bg-[#7630A3]/10 text-[#7630A3]'">
                  {{ item.type }}
                </span>
                <span class="text-[0.625rem] text-[#7C757E] font-medium">{{ formatDate(item.createdAt) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <router-link
                to="/admin/verifications"
                class="btn-gts-secondary !h-11"
              >
                Details
              </router-link>
              <button
                class="btn-gts-secondary !w-11 !h-11 !px-0 bg-[#64D2B1]/10 text-[#64D2B1] border-none hover:bg-[#64D2B1] hover:text-white"
                @click.prevent="handleApprove(item)"
                title="Approve"
              >
                <Check class="w-5 h-5" />
              </button>
              <button
                class="btn-gts-secondary !w-11 !h-11 !px-0 bg-red-50 text-red-500 border-none hover:bg-red-500 hover:text-white"
                @click.prevent="handleReject(item)"
                title="Reject"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Recent Activity</h3>
        </div>
        <div v-if="recentLogs.length === 0" class="text-center py-8 text-[#7C757E]">
          <Clock class="w-10 h-10 mx-auto mb-2 text-[#EEEAF2]" />
          <p class="font-medium">No recent activity.</p>
        </div>
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <router-link
            v-for="log in recentLogs"
            :key="log.id"
            :to="getLogRoute(log)"
            class="flex items-center gap-3 p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2] hover:border-[#7630A3]/20 transition-all no-underline block"
          >
            <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              :class="{
                'bg-[#7630A3]/10 text-[#7630A3]': log.severity === 'info',
                'bg-[#64D2B1]/10 text-[#64D2B1]': log.severity === 'success',
                'bg-amber-100 text-amber-600': log.severity === 'warning',
                'bg-red-50 text-red-500': log.severity === 'danger'
              }">
              <component :is="getLucideIcon(log.icon)" class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm text-[#475569] font-medium truncate">{{ log.message }}</span>
              <span class="block text-xs text-[#7C757E]">{{ formatDate(log.timestamp) }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'
import { getLucideIcon } from '../../utils/icons.js'
import {
  Users, Store, Wallet, TrendingUp,
  ArrowRight, BadgeCheck, Check, X, Star,
  Clock, CheckCircle2, XCircle, Ban, BarChart3
} from 'lucide-vue-next'
import {
  Chart,
  BarController, LineController, DoughnutController,
  BarElement, LineElement, PointElement, ArcElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
} from 'chart.js'

Chart.register(
  BarController, LineController, DoughnutController,
  BarElement, LineElement, PointElement, ArcElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
)

const adminStore = useAdminStore()

const ps = computed(() => adminStore.platformStats)
const revenueData = computed(() => adminStore.getRevenueData())
const userGrowthData = computed(() => adminStore.getUserGrowthData())
const topServices = computed(() => adminStore.getTopServices())
const topBusinesses = computed(() => adminStore.getTopBusinesses())
const recentLogs = computed(() => adminStore.getSystemLogs().slice(0, 5))

const serviceColors = ['#7630A3', '#64D2B1', '#475569', '#F59E0B', '#EF4444', '#3B82F6']
const totalServiceRequests = computed(() => topServices.value.reduce((sum, s) => sum + s.count, 0))
function servicePercentage(count) {
  return totalServiceRequests.value > 0 ? Math.round((count / totalServiceRequests.value) * 100) : 0
}

const stats = computed(() => {
  const pb = adminStore.pendingBusinesses.length
  return [
    {
      iconComp: Users, label: 'Total Users', value: adminStore.allUsers.length.toString(),
      bg: 'rgba(118,48,163,0.1)', color: '#7630A3',
      trend: `+${ps.value.monthlyGrowth}%`, trendLabel: 'vs last month', trendUp: true,
      route: '/admin/users',
      detail: `${adminStore.activeUsers.length} Active · ${adminStore.suspendedUsers.length} Suspended`
    },
    {
      iconComp: Store, label: 'Businesses', value: adminStore.businesses.length.toString(),
      bg: 'rgba(100,210,177,0.1)', color: '#64D2B1',
      trend: `${pb} Pending`, trendUp: false,
      route: '/admin/businesses',
      detail: `${adminStore.approvedBusinesses.length} Approved · ${adminStore.rejectedBusinesses.length} Rejected`
    },
    {
      iconComp: Wallet, label: 'Revenue', value: `ETB ${ps.value.totalRevenue.toLocaleString()}`,
      bg: 'rgba(100,210,177,0.1)', color: '#64D2B1',
      trend: '+24%', trendLabel: 'vs last month', trendUp: true,
      route: '/admin/reports'
    }
  ]
})

const revenueFilter = ref('7m')
const filteredRevenueData = computed(() => {
  const all = revenueData.value
  if (revenueFilter.value === '1m') return all.slice(-1)
  if (revenueFilter.value === '3m') return all.slice(-3)
  return all
})

const distFilter = ref('customer')
const distData = {
  customer: {
    labels: ['Active', 'Suspended'],
    data: [3, 1],
    colors: ['#64D2B1', '#7C757E']
  },
  admin: {
    labels: ['Active', 'Suspended'],
    data: [2, 1],
    colors: ['#64D2B1', '#7C757E']
  },
  business: {
    labels: ['Approved', 'Pending', 'Rejected', 'Suspended'],
    data: [5, 2, 1, 0],
    colors: ['#64D2B1', '#F59E0B', '#EF4444', '#7C757E']
  },
  service: {
    labels: ['Approved', 'Pending', 'Rejected', 'Suspended'],
    data: [3, 3, 1, 2],
    colors: ['#64D2B1', '#F59E0B', '#EF4444', '#7C757E']
  }
}

const pendingFilter = ref('business')
const pendingServiceProviders = ref([
  { id: 'sp1', name: 'Fasil Transport Co.', type: 'Service Provider', category: 'Logistics', createdAt: '2026-04-05' },
  { id: 'sp2', name: 'Kidist Cleaning Services', type: 'Service Provider', category: 'Cleaning', createdAt: '2026-04-03' },
  { id: 'sp3', name: 'Dawit Web Solutions', type: 'Service Provider', category: 'IT Services', createdAt: '2026-03-30' }
])

const filteredPendingItems = computed(() => {
  if (pendingFilter.value === 'business') {
    return adminStore.pendingBusinesses.map(b => ({
      id: b.id, name: b.name, type: 'Business Application',
      category: b.category, createdAt: b.createdAt, source: 'business'
    }))
  }
  return pendingServiceProviders.value.map(sp => ({ ...sp, source: 'provider' }))
})

function handleApprove(item) {
  if (item.source === 'business') {
    adminStore.approveBusiness(item.id)
  } else {
    pendingServiceProviders.value = pendingServiceProviders.value.filter(sp => sp.id !== item.id)
    adminStore.showToast(`Service provider "${item.name}" approved`)
  }
}

function handleReject(item) {
  if (item.source === 'business') {
    adminStore.rejectBusiness(item.id)
  } else {
    pendingServiceProviders.value = pendingServiceProviders.value.filter(sp => sp.id !== item.id)
    adminStore.showToast(`Service provider "${item.name}" rejected`, 'error')
  }
}

function getLogRoute(log) {
  if (log.type?.includes('user')) return '/admin/users'
  if (log.type?.includes('business')) return '/admin/businesses'
  if (log.type?.includes('request')) return '/admin/verifications'
  if (log.type?.includes('report')) return '/admin/reports'
  return '/admin/dashboard'
}

const revenueChartEl = ref(null)
const growthChartEl = ref(null)
const userDistChartEl = ref(null)
let revenueChart = null
let growthChart = null
let userDistChart = null

const tooltipConfig = {
  backgroundColor: '#1A1225',
  titleFont: { family: "'Inter', sans-serif", weight: '700', size: 12 },
  bodyFont: { family: "'Inter', sans-serif", weight: '600', size: 11 },
  padding: 10,
  cornerRadius: 10,
  displayColors: false
}

function buildRevenueChart() {
  if (!revenueChartEl.value) return
  const data = filteredRevenueData.value
  revenueChart = new Chart(revenueChartEl.value, {
    type: 'bar',
    data: {
      labels: data.map(d => d.month),
      datasets: [{
        label: 'Revenue (ETB)',
        data: data.map(d => d.revenue),
        backgroundColor: data.map((_, i) => i === data.length - 1 ? '#64D2B1' : '#7630A3'),
        borderRadius: 8, borderSkipped: false, maxBarThickness: 40
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipConfig, callbacks: { label: ctx => `Revenue: ETB ${ctx.parsed.y.toLocaleString()}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#7C757E', font: { weight: '700', size: 11 } } },
        y: { display: false }
      }
    }
  })
}

function rebuildRevenueChart() {
  revenueChart?.destroy()
  nextTick(() => buildRevenueChart())
}

function buildGrowthChart() {
  if (!growthChartEl.value) return
  const data = userGrowthData.value
  growthChart = new Chart(growthChartEl.value, {
    type: 'line',
    data: {
      labels: data.map(d => d.month),
      datasets: [{
        label: 'New Users', data: data.map(d => d.customers),
        borderColor: '#64D2B1', backgroundColor: 'rgba(100,210,177,0.08)',
        borderWidth: 3, pointBackgroundColor: '#64D2B1', pointBorderColor: '#fff',
        pointBorderWidth: 2, pointRadius: 5, pointHoverRadius: 7, tension: 0.4, fill: true
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipConfig, callbacks: { label: ctx => `${ctx.parsed.y} new users` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#7C757E', font: { weight: '700', size: 11 } } },
        y: { grid: { color: '#F8F6FB' }, ticks: { color: '#7C757E', font: { weight: '600', size: 12 }, stepSize: 1 }, border: { display: false }, beginAtZero: true }
      }
    }
  })
}

function buildUserDistChart() {
  if (!userDistChartEl.value) return
  const current = distData[distFilter.value]
  const total = current.data.reduce((a, b) => a + b, 0)
  userDistChart = new Chart(userDistChartEl.value, {
    type: 'doughnut',
    data: {
      labels: current.labels,
      datasets: [{ data: current.data, backgroundColor: current.colors, borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#475569', font: { family: "'Inter', sans-serif", weight: '700', size: 12 }, padding: 16, usePointStyle: true, pointStyleWidth: 10 }
        },
        tooltip: {
          ...tooltipConfig,
          callbacks: { label: ctx => { const pct = total > 0 ? Math.round((ctx.parsed / total) * 100) : 0; return `${ctx.label}: ${ctx.parsed} (${pct}%)` } }
        }
      }
    }
  })
}

function rebuildDistChart() {
  userDistChart?.destroy()
  nextTick(() => buildUserDistChart())
}

function destroyCharts() {
  revenueChart?.destroy()
  growthChart?.destroy()
  userDistChart?.destroy()
}

onMounted(() => {
  nextTick(() => {
    buildRevenueChart()
    buildGrowthChart()
    buildUserDistChart()
  })
})

onBeforeUnmount(() => destroyCharts())

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
