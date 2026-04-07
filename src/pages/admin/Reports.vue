<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Reports</h1>
        <p class="text-[#475569] font-medium">Generate, preview, and download platform reports</p>
      </div>
      <button class="btn-gts-primary" @click="openReportBuilder">
        <span class="material-icons-round">add_chart</span>
        Generate Report
      </button>
    </div>

    <!-- Report Types (clickable → opens report builder) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="type in reportTypes" :key="type.label"
        class="bg-white rounded-3xl p-6 border border-[#EEEAF2] shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-soft transition-all group"
        @click="openReportBuilder(type.value)">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" :style="{ background: type.bg }">
          <span class="material-icons-round text-2xl" :style="{ color: type.color }">{{ type.icon }}</span>
        </div>
        <h4 class="text-sm font-black text-[#1A1225] mb-1">{{ type.label }}</h4>
        <p class="text-xs text-[#7C757E] font-medium">{{ type.description }}</p>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-[#7C757E]">search</span>
        <input type="text" class="input-gts pl-12" v-model="searchQuery" placeholder="Search reports..." id="admin-report-search">
      </div>
      <select class="input-gts max-w-[160px]" v-model="typeFilter">
        <option value="">All Types</option>
        <option value="Users">Users</option>
        <option value="Revenue">Revenue</option>
        <option value="Products">Products</option>
        <option value="Performance">Performance</option>
      </select>
      <select class="input-gts max-w-[160px]" v-model="statusFilter">
        <option value="">All Statuses</option>
        <option value="ready">Ready</option>
        <option value="generating">Generating</option>
        <option value="failed">Failed</option>
      </select>
    </div>

    <!-- Reports List -->
    <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-heading text-lg font-black text-[#1A1225]">Generated Reports</h3>
        <span class="text-sm text-[#7C757E] font-bold">{{ filteredReports.length }} reports</span>
      </div>

      <div class="flex flex-col gap-3">
        <div v-for="report in filteredReports" :key="report.id"
          class="flex items-center gap-4 p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2] hover:border-[#7630A3]/20 transition-colors group">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            :class="{
              'bg-[#7630A3]/10': report.status === 'ready',
              'bg-amber-50': report.status === 'generating',
              'bg-red-50': report.status === 'failed'
            }">
            <span class="material-icons-round" :class="{
              'text-[#7630A3]': report.status === 'ready',
              'text-amber-500 animate-spin': report.status === 'generating',
              'text-red-500': report.status === 'failed'
            }">{{ report.status === 'generating' ? 'sync' : report.status === 'failed' ? 'error' : 'description' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-sm font-bold text-[#1A1225] truncate">{{ report.name }}</span>
            <div class="flex items-center gap-3 mt-0.5">
              <span class="badge-primary text-[0.625rem]">{{ report.type }}</span>
              <span class="text-xs text-[#7C757E]">{{ report.generatedAt }}</span>
              <span class="text-xs text-[#7C757E]">{{ report.format || 'PDF' }} • {{ report.size || '2.4 MB' }}</span>
            </div>
            <!-- Mini preview for ready reports -->
            <div v-if="report.status === 'ready' && report.preview" class="mt-2 p-2 bg-white rounded-lg border border-[#EEEAF2] text-xs text-[#475569]">
              {{ report.preview }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[0.625rem] font-black uppercase tracking-widest"
              :class="{
                'bg-[#64D2B1]/10 text-[#64D2B1]': report.status === 'ready',
                'bg-amber-50 text-amber-500': report.status === 'generating',
                'bg-red-50 text-red-500': report.status === 'failed'
              }">
              {{ report.status }}
            </span>
            <!-- Preview button -->
            <button v-if="report.status === 'ready'"
              class="w-9 h-9 rounded-xl bg-white text-[#475569] hover:text-[#7630A3] hover:bg-[#7630A3]/10 transition-colors flex items-center justify-center border border-[#EEEAF2]"
              title="Preview" @click="openPreview(report)">
              <span class="material-icons-round text-lg">visibility</span>
            </button>
            <!-- Download dropdown -->
            <div v-if="report.status === 'ready'" class="relative">
              <button class="w-9 h-9 rounded-xl bg-white text-[#475569] hover:text-[#7630A3] hover:bg-[#7630A3]/10 transition-colors flex items-center justify-center border border-[#EEEAF2]"
                title="Download" @click="downloadReport(report)">
                <span class="material-icons-round text-lg">download</span>
              </button>
            </div>
            <!-- Retry for failed -->
            <button v-if="report.status === 'failed'"
              class="w-9 h-9 rounded-xl bg-white text-amber-500 hover:bg-amber-50 transition-colors flex items-center justify-center border border-[#EEEAF2]"
              title="Retry" @click="retryReport(report)">
              <span class="material-icons-round text-lg">refresh</span>
            </button>
            <!-- Delete/Archive -->
            <button class="w-9 h-9 rounded-xl bg-white text-[#7C757E] hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center border border-[#EEEAF2] opacity-0 group-hover:opacity-100"
              title="Delete" @click="deleteReport(report.id)">
              <span class="material-icons-round text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredReports.length === 0" class="text-center py-12 text-[#7C757E]">
        <span class="material-icons-round text-4xl mb-2 block text-[#EEEAF2]">description</span>
        <p class="font-medium">No reports found</p>
      </div>
    </div>

    <!-- Saved Templates -->
    <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm mt-6">
      <h3 class="font-heading text-lg font-black text-[#1A1225] mb-4">Saved Templates</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="tpl in templates" :key="tpl.name"
          class="flex items-center gap-3 p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2] hover:border-[#7630A3]/20 cursor-pointer transition-all"
          @click="useTemplate(tpl)">
          <span class="material-icons-round text-[#7630A3]">article</span>
          <div>
            <span class="block text-sm font-bold text-[#1A1225]">{{ tpl.name }}</span>
            <span class="block text-xs text-[#7C757E]">{{ tpl.desc }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Builder Modal -->
    <div v-if="showBuilder" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showBuilder = false">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Report Builder</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225] transition-colors" @click="showBuilder = false">
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
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Format</label>
            <div class="flex gap-3">
              <button v-for="fmt in ['PDF', 'CSV', 'Excel']" :key="fmt"
                class="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all"
                :class="newReport.format === fmt ? 'bg-[#7630A3] border-[#7630A3] text-white' : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]/30'"
                @click="newReport.format = fmt">
                {{ fmt }}
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Include</label>
            <div class="space-y-2">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="newReport.includeCharts" class="w-4 h-4 accent-[#7630A3] rounded">
                <span class="text-sm text-[#475569] font-medium">Charts & Visualizations</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="newReport.includeRaw" class="w-4 h-4 accent-[#7630A3] rounded">
                <span class="text-sm text-[#475569] font-medium">Raw Data Tables</span>
              </label>
            </div>
          </div>

          <!-- Schedule -->
          <div class="space-y-2 pt-2 border-t border-[#EEEAF2]">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="newReport.scheduled" class="w-4 h-4 accent-[#7630A3] rounded">
              <span class="text-sm text-[#475569] font-bold">Schedule recurring report</span>
            </label>
            <select v-if="newReport.scheduled" class="input-gts" v-model="newReport.frequency">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <button class="btn-gts-primary w-full py-4 rounded-xl mt-2" @click="handleGenerate">
            <span class="material-icons-round">assessment</span>
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="previewReport" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="previewReport = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-lg animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Report Preview</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225]" @click="previewReport = null"><span class="material-icons-round">close</span></button>
        </div>
        <div class="bg-[#F8F6FB] rounded-2xl p-6 border border-[#EEEAF2]">
          <h4 class="font-heading text-base font-black text-[#1A1225] mb-4">{{ previewReport.name }}</h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-[#7C757E]">Type:</span><span class="font-bold text-[#1A1225]">{{ previewReport.type }}</span></div>
            <div class="flex justify-between"><span class="text-[#7C757E]">Generated:</span><span class="font-bold text-[#1A1225]">{{ previewReport.generatedAt }}</span></div>
            <div class="flex justify-between"><span class="text-[#7C757E]">Format:</span><span class="font-bold text-[#1A1225]">{{ previewReport.format || 'PDF' }}</span></div>
            <div class="flex justify-between"><span class="text-[#7C757E]">Size:</span><span class="font-bold text-[#1A1225]">{{ previewReport.size || '2.4 MB' }}</span></div>
          </div>
          <div class="mt-4 p-4 bg-white rounded-xl border border-[#EEEAF2]">
            <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-2">Summary</p>
            <p class="text-sm text-[#475569]">{{ previewReport.preview || 'Comprehensive report with detailed analysis and visualizations.' }}</p>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button class="flex-1 py-3 rounded-xl bg-[#F8F6FB] text-[#475569] font-bold text-sm hover:bg-[#EEEAF2] transition-all flex items-center justify-center gap-2" @click="previewReport = null">Close</button>
          <button class="flex-1 py-3 rounded-xl bg-[#7630A3] text-white font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2" @click="downloadReport(previewReport); previewReport = null">
            <span class="material-icons-round text-base">download</span> Download
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
const showBuilder = ref(false)
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const previewReport = ref(null)

const newReport = ref({
  type: 'Users', range: 'month', format: 'PDF',
  includeCharts: true, includeRaw: false,
  scheduled: false, frequency: 'weekly'
})

const templates = [
  { name: 'Monthly Revenue', desc: 'Revenue summary & trends', type: 'Revenue', range: 'month' },
  { name: 'User Growth', desc: 'User registration trends', type: 'Users', range: 'quarter' },
  { name: 'Service Performance', desc: 'Request completion metrics', type: 'Performance', range: 'month' }
]

const reportTypes = [
  { value: 'Users', label: 'User Reports', icon: 'people', description: 'User activity and growth', bg: 'rgba(118,48,163,0.1)', color: '#7630A3' },
  { value: 'Revenue', label: 'Revenue Reports', icon: 'payments', description: 'Revenue and earnings', bg: 'rgba(100,210,177,0.1)', color: '#64D2B1' },
  { value: 'Products', label: 'Product Reports', icon: 'inventory_2', description: 'Product listings overview', bg: 'rgba(118,48,163,0.1)', color: '#7630A3' },
  { value: 'Performance', label: 'Performance', icon: 'speed', description: 'Platform metrics', bg: 'rgba(100,210,177,0.1)', color: '#64D2B1' }
]

const allReports = computed(() => adminStore.getReports())

const filteredReports = computed(() => {
  let list = [...allReports.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r => r.name.toLowerCase().includes(q))
  }
  if (typeFilter.value) list = list.filter(r => r.type === typeFilter.value)
  if (statusFilter.value) list = list.filter(r => r.status === statusFilter.value)
  return list
})

function openReportBuilder(type) {
  if (type && typeof type === 'string') newReport.value.type = type
  showBuilder.value = true
}

function useTemplate(tpl) {
  newReport.value.type = tpl.type
  newReport.value.range = tpl.range
  showBuilder.value = true
}

function handleGenerate() {
  const rangeLabel = { week: 'Week', month: 'Month', quarter: 'Quarter', year: 'Year' }
  const report = {
    id: Date.now(),
    name: `${newReport.value.type} Report – ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    type: newReport.value.type,
    generatedAt: new Date().toISOString().split('T')[0],
    status: 'ready',
    format: newReport.value.format,
    size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
    preview: `${newReport.value.type} analysis for the last ${rangeLabel[newReport.value.range] || 'month'}. ${newReport.value.includeCharts ? 'Includes charts.' : ''} ${newReport.value.includeRaw ? 'Includes raw data.' : ''}`
  }
  adminStore.reports.unshift(report)
  showBuilder.value = false
  adminStore.showToast('Report generated successfully')
}

function openPreview(report) { previewReport.value = report }

function downloadReport(report) {
  const format = (report.format || 'PDF').toLowerCase()
  let content = ''
  const adminData = adminStore

  if (report.type === 'Users') {
    content = `GTS PLATFORM – ${report.name}\n${'='.repeat(50)}\nGenerated: ${report.generatedAt}\n\n`
    content += `USER SUMMARY\n${'-'.repeat(30)}\n`
    content += `Total Users: ${adminData.allUsers.length}\n`
    content += `Active Users: ${adminData.activeUsers.length}\n`
    content += `Suspended Users: ${adminData.suspendedUsers.length}\n`
    content += `Customers: ${adminData.customerUsers.length}\n\n`
    content += `USER DETAILS\n${'-'.repeat(30)}\n`
    content += 'Name,Email,Role,Status,Joined\n'
    adminData.allUsers.forEach(u => {
      content += `${u.fullName},${u.email},${u.role},${u.status},${u.createdAt}\n`
    })
  } else if (report.type === 'Revenue') {
    content = `GTS PLATFORM – ${report.name}\n${'='.repeat(50)}\nGenerated: ${report.generatedAt}\n\n`
    content += `REVENUE OVERVIEW (ETB)\n${'-'.repeat(30)}\n`
    adminData.getRevenueData().forEach(r => {
      content += `${r.month}: ETB ${r.revenue.toLocaleString()}\n`
    })
    content += `\nTOP BUSINESSES BY REVENUE\n${'-'.repeat(30)}\n`
    adminData.getTopBusinesses().forEach((b, i) => {
      content += `${i + 1}. ${b.name} – ${b.views.toLocaleString()} views, ${b.inquiries} inquiries\n`
    })
  } else if (report.type === 'Products') {
    content = `GTS PLATFORM – ${report.name}\n${'='.repeat(50)}\nGenerated: ${report.generatedAt}\n\n`
    content += `PRODUCT SUMMARY\n${'-'.repeat(30)}\n`
    content += `Total Products: ${adminData.products.length}\n`
    content += `Active Products: ${adminData.products.filter(p => p.status === 'active').length}\n\n`
    content += `PRODUCT DETAILS\n${'-'.repeat(30)}\n`
    content += 'Name,Category,Price (ETB),Views,Status\n'
    adminData.products.forEach(p => {
      content += `${p.name},${p.category},${p.price},${p.views},${p.status}\n`
    })
  } else if (report.type === 'Performance') {
    content = `GTS PLATFORM – ${report.name}\n${'='.repeat(50)}\nGenerated: ${report.generatedAt}\n\n`
    content += `SERVICE REQUEST SUMMARY\n${'-'.repeat(30)}\n`
    content += `Total Requests: ${adminData.serviceRequests.length}\n`
    content += `Pending: ${adminData.pendingRequests.length}\n`
    content += `In Progress: ${adminData.activeRequests.length}\n`
    content += `Completed: ${adminData.completedRequests.length}\n`
    content += `Rejected: ${adminData.rejectedRequests.length}\n\n`
    content += `TOP SERVICES\n${'-'.repeat(30)}\n`
    adminData.getTopServices().forEach(s => {
      content += `${s.name}: ${s.count} requests\n`
    })
    content += `\nREQUESTS PER DAY\n${'-'.repeat(30)}\n`
    adminData.getRequestsPerDay().forEach(r => {
      content += `${r.day}: ${r.requests}\n`
    })
  } else {
    content = `GTS PLATFORM – ${report.name}\n${'='.repeat(50)}\nGenerated: ${report.generatedAt}\n\n`
    content += `BUSINESS COMPLIANCE REPORT\n${'-'.repeat(30)}\n`
    content += `Total Businesses: ${adminData.businesses.length}\n`
    content += `Approved: ${adminData.approvedBusinesses.length}\n`
    content += `Pending: ${adminData.pendingBusinesses.length}\n`
    content += `Rejected: ${adminData.rejectedBusinesses.length}\n\n`
    content += `BUSINESS DETAILS\n${'-'.repeat(30)}\n`
    adminData.businesses.forEach(b => {
      content += `${b.name} – ${b.category} – ${b.status} – ${b.location}\n`
    })
  }

  const ext = format === 'csv' ? 'csv' : format === 'excel' ? 'csv' : 'txt'
  const mimeType = format === 'csv' || format === 'excel' ? 'text/csv' : 'text/plain'
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${report.name.replace(/[–—\s]+/g, '_')}.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  adminStore.showToast(`Downloaded ${report.name} as ${(report.format || 'PDF').toUpperCase()}`)
}

function retryReport(report) {
  report.status = 'ready'
  adminStore.showToast('Report regenerated successfully')
}

function deleteReport(id) {
  const idx = adminStore.reports.findIndex(r => r.id === id)
  if (idx > -1) {
    adminStore.reports.splice(idx, 1)
    adminStore.showToast('Report deleted', 'warning')
  }
}
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.1); }
</style>
