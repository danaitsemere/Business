<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-extrabold mb-2">Platform Analytics</h1>
        <p class="text-neutral-500">Comprehensive insights into platform performance</p>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-red-500/15">
          <span class="material-icons-round text-red-400">people</span>
        </div>
        <div class="font-heading text-2xl font-extrabold text-white">{{ platformStats.totalUsers }}</div>
        <div class="text-sm text-neutral-500">Total Users</div>
      </div>
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-orange-500/15">
          <span class="material-icons-round text-orange-400">store</span>
        </div>
        <div class="font-heading text-2xl font-extrabold text-white">{{ platformStats.totalBusinesses }}</div>
        <div class="text-sm text-neutral-500">Active Businesses</div>
      </div>
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-green-500/15">
          <span class="material-icons-round text-green-400">inventory_2</span>
        </div>
        <div class="font-heading text-2xl font-extrabold text-white">{{ platformStats.totalProducts }}</div>
        <div class="text-sm text-neutral-500">Total Products</div>
      </div>
      <div class="stat-card-gts">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-blue-500/15">
          <span class="material-icons-round text-blue-400">assignment</span>
        </div>
        <div class="font-heading text-2xl font-extrabold text-white">{{ platformStats.totalServiceRequests }}</div>
        <div class="text-sm text-neutral-500">Service Requests</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Revenue Chart -->
      <div class="card-gts">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-bold">Revenue Trend</h3>
          <span class="badge-success">+24% growth</span>
        </div>
        <div class="flex items-end gap-4 h-[220px]">
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

      <!-- Subscription Breakdown -->
      <div class="card-gts">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-bold">Subscription Breakdown</h3>
          <span class="badge-primary">{{ platformStats.activeSubscriptions }} active</span>
        </div>
        <div class="flex flex-col gap-4">
          <div v-for="plan in subscriptionBreakdown" :key="plan.plan" class="flex items-center gap-4">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm font-semibold text-white">{{ plan.plan }}</span>
                <span class="text-sm text-neutral-500">{{ plan.count }} users</span>
              </div>
              <div class="progress-gts">
                <div class="progress-fill-gts" :style="{ width: `${(plan.count / 6) * 100}%`, background: plan.color }"></div>
              </div>
            </div>
            <span class="text-sm font-bold text-tertiary-300 min-w-[70px] text-right">${{ plan.revenue }}/mo</span>
          </div>
        </div>
        <div class="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span class="text-sm text-neutral-500">Total Monthly Revenue</span>
          <span class="font-heading text-xl font-extrabold text-white">${{ totalSubRevenue }}/mo</span>
        </div>
      </div>
    </div>

    <!-- Top Businesses & Demographics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Businesses -->
      <div class="card-gts">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-bold">Top Performing Businesses</h3>
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="(biz, index) in topBusinesses" :key="biz.name"
            class="flex items-center gap-3 p-3 bg-surface-secondary rounded-lg">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
              :class="index === 0 ? 'bg-amber-500/20 text-amber-400' : index === 1 ? 'bg-gray-400/20 text-gray-300' : index === 2 ? 'bg-orange-600/20 text-orange-400' : 'bg-surface-elevated text-neutral-500'">
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-semibold text-white truncate">{{ biz.name }}</span>
              <span class="block text-xs text-neutral-500">{{ biz.views.toLocaleString() }} views • {{ biz.inquiries }} inquiries</span>
            </div>
            <span class="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <span class="material-icons-round text-sm">star</span> {{ biz.rating }}
            </span>
          </div>
        </div>
      </div>

      <!-- User Distribution -->
      <div class="card-gts">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-heading text-lg font-bold">User Distribution</h3>
        </div>
        <div class="flex flex-col gap-5">
          <div v-for="segment in userDistribution" :key="segment.label">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2.5">
                <span class="material-icons-round" :style="{ color: segment.color }">{{ segment.icon }}</span>
                <span class="text-sm font-semibold text-white">{{ segment.label }}</span>
              </div>
              <span class="text-sm text-neutral-500">{{ segment.count }} users ({{ segment.percentage }}%)</span>
            </div>
            <div class="progress-gts h-2.5">
              <div class="h-full rounded-full transition-all duration-700" :style="{ width: `${segment.percentage}%`, background: segment.color }"></div>
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
const platformStats = computed(() => adminStore.platformStats)
const revenueData = computed(() => adminStore.getRevenueData())
const subscriptionBreakdown = computed(() => adminStore.getSubscriptionBreakdown())
const topBusinesses = computed(() => adminStore.getTopBusinesses())

const maxRevenue = computed(() => Math.max(...revenueData.value.map(r => r.revenue)))
const totalSubRevenue = computed(() => subscriptionBreakdown.value.reduce((s, p) => s + p.revenue, 0))

const userDistribution = computed(() => {
  const total = platformStats.value.totalUsers
  return [
    { label: 'Merchants', count: platformStats.value.totalMerchants, percentage: Math.round((platformStats.value.totalMerchants / total) * 100), color: '#a854dc', icon: 'storefront' },
    { label: 'Service Providers', count: platformStats.value.totalServiceProviders, percentage: Math.round((platformStats.value.totalServiceProviders / total) * 100), color: '#64D2B1', icon: 'local_shipping' },
    { label: 'Customers', count: platformStats.value.totalCustomers, percentage: Math.round((platformStats.value.totalCustomers / total) * 100), color: '#60a5fa', icon: 'person' }
  ]
})
</script>
