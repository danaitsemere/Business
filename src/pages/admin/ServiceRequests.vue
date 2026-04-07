<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-extrabold mb-2">Service Requests</h1>
        <p class="text-neutral-500">Monitor all service requests across the platform</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      <div class="stat-card-gts">
        <div class="text-sm text-neutral-500 mb-1">Total Requests</div>
        <div class="font-heading text-2xl font-extrabold text-white">{{ allRequests.length }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-neutral-500 mb-1">Pending</div>
        <div class="font-heading text-2xl font-extrabold text-amber-400">{{ pendingCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-neutral-500 mb-1">Active</div>
        <div class="font-heading text-2xl font-extrabold text-blue-400">{{ activeCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-neutral-500 mb-1">Completed</div>
        <div class="font-heading text-2xl font-extrabold text-green-400">{{ completedCount }}</div>
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <button v-for="tab in statusTabs" :key="tab.value"
        class="chip-gts" :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value">
        {{ tab.label }}
      </button>
    </div>

    <!-- Requests Table -->
    <div class="card-gts p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table-gts">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Service Type</th>
              <th>Provider</th>
              <th>Location</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in filteredRequests" :key="req.id">
              <td class="text-sm font-semibold text-white">#{{ req.id }}</td>
              <td class="text-sm">{{ req.customerName }}</td>
              <td><span class="badge-primary">{{ req.serviceType }}</span></td>
              <td class="text-sm">{{ getProviderName(req.providerId) }}</td>
              <td class="text-sm text-neutral-500">{{ req.location }}</td>
              <td class="text-sm font-semibold text-tertiary-300">${{ (req.actualCost || req.estimatedCost).toFixed(2) }}</td>
              <td>
                <span :class="{
                  'badge-warning': req.status === 'pending',
                  'badge-info': req.status === 'active',
                  'badge-success': req.status === 'completed',
                  'badge-danger': req.status === 'rejected'
                }">{{ req.status }}</span>
              </td>
              <td class="text-sm text-neutral-500">{{ req.createdAt }}</td>
            </tr>
            <tr v-if="filteredRequests.length === 0">
              <td colspan="8" class="text-center py-12 text-neutral-500">
                <span class="material-icons-round text-4xl mb-2 block">assignment</span>
                No requests found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const activeTab = ref('all')

const allRequests = computed(() => adminStore.serviceRequests)
const pendingCount = computed(() => allRequests.value.filter(r => r.status === 'pending').length)
const activeCount = computed(() => allRequests.value.filter(r => r.status === 'active').length)
const completedCount = computed(() => allRequests.value.filter(r => r.status === 'completed').length)

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' }
]

const providers = { 3: 'Omar Khalil', 4: 'Fatima Noor' }
function getProviderName(id) { return providers[id] || 'Unassigned' }

const filteredRequests = computed(() => {
  if (activeTab.value === 'all') return allRequests.value
  return allRequests.value.filter(r => r.status === activeTab.value)
})
</script>
