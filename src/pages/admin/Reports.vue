<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Reports</h1>
        <p class="text-[#475569] font-medium">Generate and download platform reports</p>
      </div>
      <button class="btn-gts-primary" @click="generateReport">
        <span class="material-icons-round">add_chart</span>
        Generate Report
      </button>
    </div>

    <!-- Report Types -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="type in reportTypes" :key="type.label"
        class="bg-white rounded-3xl p-6 border border-[#EEEAF2] shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-soft transition-all group"
        @click="selectedType = type.value">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" :style="{ background: type.bg }">
          <span class="material-icons-round text-2xl" :style="{ color: type.color }">{{ type.icon }}</span>
        </div>
        <h4 class="text-sm font-black text-[#1A1225] mb-1">{{ type.label }}</h4>
        <p class="text-xs text-[#7C757E] font-medium">{{ type.description }}</p>
      </div>
    </div>

    <!-- Reports List -->
    <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-heading text-lg font-black text-[#1A1225]">Generated Reports</h3>
        <span class="text-sm text-[#7C757E] font-bold">{{ reports.length }} reports</span>
      </div>

      <div class="flex flex-col gap-3">
        <div v-for="report in reports" :key="report.id"
          class="flex items-center gap-4 p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2] hover:border-[#7630A3]/20 transition-colors">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center bg-[#7630A3]/10 shrink-0">
            <span class="material-icons-round text-[#7630A3]">description</span>
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-sm font-bold text-[#1A1225] truncate">{{ report.name }}</span>
            <div class="flex items-center gap-3 mt-0.5">
              <span class="badge-primary text-[0.625rem]">{{ report.type }}</span>
              <span class="text-xs text-[#7C757E]">Generated {{ report.generatedAt }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[0.625rem] font-black uppercase tracking-widest bg-[#64D2B1]/10 text-[#64D2B1]">{{ report.status }}</span>
            <button class="w-9 h-9 rounded-xl bg-white text-[#475569] hover:text-[#7630A3] hover:bg-[#7630A3]/10 transition-colors flex items-center justify-center border border-[#EEEAF2]" title="Download">
              <span class="material-icons-round text-lg">download</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Generate Report Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showModal = false">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Generate New Report</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225] transition-colors" @click="showModal = false">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Report Type</label>
            <select class="input-gts" v-model="newReport.type">
              <option value="Users">User Report</option>
              <option value="Revenue">Revenue Report</option>
              <option value="Products">Product Report</option>
              <option value="Performance">Performance Report</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Date Range</label>
            <select class="input-gts" v-model="newReport.range">
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <button class="btn-gts-primary w-full py-4 rounded-xl mt-2" @click="handleGenerate">
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
  { value: 'Users', label: 'User Reports', icon: 'people', description: 'User activity and growth', bg: 'rgba(118,48,163,0.1)', color: '#7630A3' },
  { value: 'Revenue', label: 'Revenue Reports', icon: 'payments', description: 'Revenue and earnings', bg: 'rgba(100,210,177,0.1)', color: '#64D2B1' },
  { value: 'Products', label: 'Product Reports', icon: 'inventory_2', description: 'Product listings overview', bg: 'rgba(118,48,163,0.1)', color: '#7630A3' },
  { value: 'Performance', label: 'Performance', icon: 'speed', description: 'Platform metrics', bg: 'rgba(100,210,177,0.1)', color: '#64D2B1' }
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

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.1); }
</style>
