<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-extrabold mb-2">Reports</h1>
        <p class="text-neutral-500">Generate and download platform reports</p>
      </div>
      <button class="btn-gts-primary" @click="generateReport">
        <span class="material-icons-round">add_chart</span>
        Generate Report
      </button>
    </div>

    <!-- Report Types -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="type in reportTypes" :key="type.label"
        class="card-gts cursor-pointer hover:-translate-y-1 transition-all"
        @click="selectedType = type.value">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-3" :style="{ background: type.bg }">
          <span class="material-icons-round text-2xl" :style="{ color: type.color }">{{ type.icon }}</span>
        </div>
        <h4 class="text-sm font-bold text-white mb-1">{{ type.label }}</h4>
        <p class="text-xs text-neutral-500">{{ type.description }}</p>
      </div>
    </div>

    <!-- Reports List -->
    <div class="card-gts">
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-heading text-lg font-bold">Generated Reports</h3>
        <span class="text-sm text-neutral-500">{{ reports.length }} reports</span>
      </div>

      <div class="flex flex-col gap-3">
        <div v-for="report in reports" :key="report.id"
          class="flex items-center gap-4 p-4 bg-surface-secondary rounded-lg hover:bg-surface-elevated transition-colors">
          <div class="w-11 h-11 rounded-lg flex items-center justify-center bg-primary-500/15 shrink-0">
            <span class="material-icons-round text-primary-300">description</span>
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-sm font-semibold text-white truncate">{{ report.name }}</span>
            <div class="flex items-center gap-3 mt-0.5">
              <span class="badge-primary text-[0.688rem]">{{ report.type }}</span>
              <span class="text-xs text-neutral-500">Generated {{ report.generatedAt }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge-success">{{ report.status }}</span>
            <button class="btn-gts-icon bg-surface-elevated text-[#b8b0c4] hover:text-primary-300 hover:bg-primary-500/10 transition-colors" title="Download">
              <span class="material-icons-round text-lg">download</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Generate Report Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showModal = false">
      <div class="bg-surface-card border border-white/[0.08] rounded-2xl p-8 w-full max-w-md animate-scale-in">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-bold">Generate New Report</h3>
          <button class="text-neutral-500 hover:text-white transition-colors" @click="showModal = false">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#b8b0c4]">Report Type</label>
            <select class="select-gts" v-model="newReport.type">
              <option value="Users">User Report</option>
              <option value="Revenue">Revenue Report</option>
              <option value="Products">Product Report</option>
              <option value="Performance">Performance Report</option>
              <option value="Compliance">Compliance Report</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#b8b0c4]">Date Range</label>
            <select class="select-gts" v-model="newReport.range">
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <button class="btn-gts-primary w-full mt-2" @click="handleGenerate">
            <span class="material-icons-round">assessment</span>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const reports = computed(() => adminStore.getReports())
const showModal = ref(false)
const selectedType = ref('')
const newReport = ref({ type: 'Users', range: 'month' })

const reportTypes = [
  { value: 'Users', label: 'User Reports', icon: 'people', description: 'User activity and growth', bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  { value: 'Revenue', label: 'Revenue Reports', icon: 'payments', description: 'Revenue and subscriptions', bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  { value: 'Products', label: 'Product Reports', icon: 'inventory_2', description: 'Product listings and activity', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  { value: 'Performance', label: 'Performance', icon: 'speed', description: 'Platform metrics overview', bg: 'rgba(249,115,22,0.15)', color: '#fb923c' }
]

function generateReport() { showModal.value = true }

function handleGenerate() {
  const report = {
    id: reports.value.length + 1,
    name: `${newReport.value.type} Report – ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    type: newReport.value.type,
    generatedAt: new Date().toISOString().split('T')[0],
    status: 'ready'
  }
  adminStore.reports.push(report)
  showModal.value = false
}
</script>
