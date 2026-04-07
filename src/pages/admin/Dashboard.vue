<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="font-heading text-3xl font-extrabold mb-2">System Overview 🛡️</h1>
      <p class="text-neutral-500">Monitor and manage the entire GTS platform from here</p>
    </div>

    <!-- Key Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(stat, i) in stats" :key="i" class="stat-card-gts" style="--tw-gradient-from: rgba(239,68,68,0.12); --tw-gradient-to: rgba(249,115,22,0.06);">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" :style="{ background: stat.bg }">
          <span class="material-icons-round text-2xl" :style="{ color: stat.color }">{{ stat.icon }}</span>
        </div>
        <div class="font-heading text-3xl font-extrabold text-white">{{ stat.value }}</div>
        <div class="text-sm text-neutral-500 mt-1">{{ stat.label }}</div>
        <div class="flex items-center gap-1 text-xs font-semibold mt-2" :class="stat.trendUp ? 'text-green-400' : 'text-red-400'">
          <span class="material-icons-round text-base">{{ stat.trendUp ? 'trending_up' : 'trending_down' }}</span>
          {{ stat.trend }}
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Revenue Chart -->
      <div class="card-gts">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-bold">Platform Revenue</h3>
          <span class="badge-primary">Last 7 months</span>
        </div>
        <div class="flex items-end gap-4 h-[200px]">
          <div v-for="(item, i) in revenueData" :key="i" class="flex-1 flex flex-col items-center h-full">
            <div class="flex-1 w-full flex items-end justify-center">
              <div class="w-[60%] min-w-[24px] max-w-[40px] rounded-t-md transition-all duration-700 relative group cursor-pointer"
                style="background: linear-gradient(to top, #ef4444, #f97316);"
                :style="{ height: `${(item.revenue / maxRevenue) * 100}%` }">
                <span class="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-elevated px-2 py-0.5 rounded text-[0.688rem] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">${{ item.revenue }}</span>
              </div>
            </div>
            <span class="text-xs text-neutral-500 mt-2">{{ item.month }}</span>
          </div>
        </div>
      </div>

      <!-- User Growth -->
      <div class="card-gts">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-bold">User Growth</h3>
          <span class="badge-primary">Cumulative</span>
        </div>
        <div class="flex items-end gap-4 h-[200px]">
          <div v-for="(item, i) in userGrowthData" :key="i" class="flex-1 flex flex-col items-center h-full">
            <div class="flex-1 w-full flex items-end justify-center gap-0.5">
              <div class="w-1/3 bg-primary-500 rounded-t-sm transition-all duration-700"
                :style="{ height: `${(item.merchants / maxTotal) * 100}%` }"></div>
              <div class="w-1/3 bg-tertiary-300 rounded-t-sm transition-all duration-700"
                :style="{ height: `${(item.providers / maxTotal) * 100}%` }"></div>
              <div class="w-1/3 bg-blue-400 rounded-t-sm transition-all duration-700"
                :style="{ height: `${(item.customers / maxTotal) * 100}%` }"></div>
            </div>
            <span class="text-xs text-neutral-500 mt-2">{{ item.month }}</span>
          </div>
        </div>
        <div class="flex items-center justify-center gap-6 mt-4">
          <div class="flex items-center gap-2"><span class="w-3 h-3 bg-primary-500 rounded-sm"></span><span class="text-xs text-neutral-500">Merchants</span></div>
          <div class="flex items-center gap-2"><span class="w-3 h-3 bg-tertiary-300 rounded-sm"></span><span class="text-xs text-neutral-500">Providers</span></div>
          <div class="flex items-center gap-2"><span class="w-3 h-3 bg-blue-400 rounded-sm"></span><span class="text-xs text-neutral-500">Customers</span></div>
        </div>
      </div>
    </div>

    <!-- Pending Verifications + System Logs -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Pending Verifications -->
      <div class="card-gts">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-bold">Pending Verifications</h3>
          <router-link to="/admin/verifications" class="btn-gts-secondary btn-gts-sm">View All</router-link>
        </div>
        <div v-if="pendingVerifications.length === 0" class="text-center py-8 text-neutral-500">
          <span class="material-icons-round text-4xl mb-2 block">verified</span>
          <p>All verifications are up to date!</p>
        </div>
        <div v-else class="flex flex-col gap-3">
          <div v-for="user in pendingVerifications" :key="user.id"
            class="flex items-center gap-3.5 p-3 bg-surface-secondary rounded-lg">
            <div class="avatar-gts w-10 h-10 text-sm">{{ user.avatar }}</div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-semibold truncate">{{ user.fullName }}</span>
              <span class="block text-xs text-neutral-500 capitalize">{{ user.role.replace('-', ' ') }}</span>
            </div>
            <span class="badge-warning">Pending</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card-gts">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-bold">Recent Activity</h3>
        </div>
        <div class="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
          <div v-for="log in recentLogs" :key="log.id"
            class="flex items-center gap-3 p-3 bg-surface-secondary rounded-lg">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              :class="{
                'bg-blue-500/15 text-blue-400': log.severity === 'info',
                'bg-green-500/15 text-green-400': log.severity === 'success',
                'bg-amber-500/15 text-amber-400': log.severity === 'warning',
                'bg-red-500/15 text-red-400': log.severity === 'danger'
              }">
              <span class="material-icons-round text-lg">{{ log.icon }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm text-[#b8b0c4] truncate">{{ log.message }}</span>
              <span class="block text-xs text-neutral-500">{{ formatTime(log.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card-gts mt-6">
      <h3 class="font-heading text-lg font-bold mb-5">Quick Admin Actions</h3>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link v-for="action in quickActions" :key="action.path" :to="action.path"
          class="flex flex-col items-center gap-2.5 p-6 bg-surface-secondary border border-white/[0.06] rounded-xl transition-all duration-250 hover:border-red-400 hover:bg-red-500/[0.08] hover:-translate-y-0.5 text-[#b8b0c4] hover:text-red-300 no-underline text-sm font-medium">
          <span class="material-icons-round text-3xl text-red-400">{{ action.icon }}</span>
          <span>{{ action.label }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const ps = computed(() => adminStore.platformStats)
const pendingVerifications = computed(() => adminStore.pendingVerifications)
const revenueData = computed(() => adminStore.getRevenueData())
const userGrowthData = computed(() => adminStore.getUserGrowthData())
const recentLogs = computed(() => adminStore.getSystemLogs().slice(0, 6))

const maxRevenue = computed(() => Math.max(...revenueData.value.map(r => r.revenue)))
const maxTotal = computed(() => Math.max(...userGrowthData.value.map(u => u.merchants + u.providers + u.customers)))

const stats = computed(() => [
  { icon: 'people', label: 'Total Users', value: ps.value.totalUsers.toString(), bg: 'rgba(239,68,68,0.15)', color: '#f87171', trend: '+18.5%', trendUp: true },
  { icon: 'store', label: 'Businesses', value: ps.value.totalBusinesses.toString(), bg: 'rgba(249,115,22,0.15)', color: '#fb923c', trend: '+12%', trendUp: true },
  { icon: 'payments', label: 'Revenue', value: `$${ps.value.totalRevenue.toLocaleString()}`, bg: 'rgba(34,197,94,0.15)', color: '#4ade80', trend: '+24%', trendUp: true },
  { icon: 'verified_user', label: 'Pending Verifications', value: ps.value.pendingVerifications.toString(), bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', trend: '1 new', trendUp: false }
])

const quickActions = [
  { path: '/admin/users', icon: 'group_add', label: 'Manage Users' },
  { path: '/admin/verifications', icon: 'verified_user', label: 'Verifications' },
  { path: '/admin/analytics', icon: 'analytics', label: 'Analytics' },
  { path: '/admin/settings', icon: 'settings', label: 'Settings' }
]

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 60000)
  if (diff < 60) return `${diff}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return date.toLocaleDateString()
}
</script>
