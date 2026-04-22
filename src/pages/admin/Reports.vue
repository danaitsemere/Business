<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Reports</h1>
        <p class="text-[#475569] font-medium">Generate, preview, and download platform reports</p>
      </div>
      <button class="btn-gts-primary" @click="openReportBuilder">
        <BarChart3 class="w-5 h-5" />
        Generate Report
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="type in reportTypes" :key="type.label"
        class="bg-white rounded-3xl p-6 border border-[#EEEAF2] shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all group"
        @click="openReportBuilder(type.value)">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" :style="{ background: type.bg }">
          <component :is="type.iconComp" class="w-6 h-6" :style="{ color: type.color }" />
        </div>
        <h4 class="text-sm font-black text-[#1A1225] mb-1">{{ type.label }}</h4>
        <p class="text-xs text-[#7C757E] font-medium">{{ type.description }}</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <Search class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7C757E]" />
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
            <component :is="getReportIcon(report.status)" class="w-5 h-5"
              :class="{
                'text-[#7630A3]': report.status === 'ready',
                'text-amber-500 animate-spin': report.status === 'generating',
                'text-red-500': report.status === 'failed'
              }" />
          </div>
          <div class="flex-1 min-w-0">
            <span class="block text-sm font-bold text-[#1A1225] truncate">{{ report.name }}</span>
            <div class="flex items-center gap-3 mt-0.5">
              <span class="badge-primary text-[0.625rem]">{{ report.type }}</span>
              <span class="text-xs text-[#7C757E]">{{ report.generatedAt }}</span>
              <span class="text-xs text-[#7C757E]">{{ report.range }} · PDF</span>
            </div>
            <div v-if="report.status === 'ready' && report.preview" class="mt-2 p-2 bg-white rounded-lg border border-[#EEEAF2] text-xs text-[#475569]">
              {{ report.preview }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[0.5rem] font-black uppercase tracking-widest"
              :class="{
                'bg-[#64D2B1]/10 text-[#64D2B1]': report.status === 'ready',
                'bg-amber-50 text-amber-500': report.status === 'generating',
                'bg-red-50 text-red-500': report.status === 'failed'
              }">
              {{ report.status }}
            </span>
            <button v-if="report.status === 'ready'"
              class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white border-none shadow-sm"
              @click="openPreview(report)" title="Preview">
              <Eye class="w-5 h-5" />
            </button>
            <button v-if="report.status === 'ready'"
              class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white border-none shadow-sm"
              @click="downloadReport(report)" title="Download PDF">
              <Download class="w-5 h-5" />
            </button>
            <button v-if="report.status === 'failed'"
              class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white border-none shadow-sm text-amber-500"
              @click="retryReport(report)" title="Retry">
              <RefreshCw class="w-5 h-5" />
            </button>
            <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white border-none shadow-sm text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
              @click="deleteReport(report.id)" title="Delete">
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredReports.length === 0" class="text-center py-12 text-[#7C757E]">
        <FileText class="w-10 h-10 mx-auto mb-2 text-[#EEEAF2]" />
        <p class="font-medium">No reports found</p>
      </div>
    </div>

    <div v-if="showBuilder" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showBuilder = false">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Report Builder</h3>
          <button class="btn-gts-secondary !w-11 !h-11 !px-0 !border-none" @click="showBuilder = false">
            <X class="w-5 h-5" />
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
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
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

          <button class="btn-gts-primary w-full mt-2" @click="handleGenerate">
            <BarChart3 class="w-5 h-5" />
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <div v-if="previewReport" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="previewReport = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-lg animate-scale-in shadow-2xl max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Report Preview</h3>
          <button class="btn-gts-secondary !w-11 !h-11 !px-0 !border-none" @click="previewReport = null"><X class="w-5 h-5" /></button>
        </div>
        <div class="bg-[#F8F6FB] rounded-2xl p-6 border border-[#EEEAF2]">
          <h4 class="font-heading text-base font-black text-[#1A1225] mb-4">{{ previewReport.name }}</h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-[#7C757E]">Type:</span><span class="font-bold text-[#1A1225]">{{ previewReport.type }}</span></div>
            <div class="flex justify-between"><span class="text-[#7C757E]">Range:</span><span class="font-bold text-[#1A1225]">{{ previewReport.range }}</span></div>
            <div class="flex justify-between"><span class="text-[#7C757E]">Generated:</span><span class="font-bold text-[#1A1225]">{{ previewReport.generatedAt }}</span></div>
            <div class="flex justify-between"><span class="text-[#7C757E]">Format:</span><span class="font-bold text-[#1A1225]">PDF</span></div>
          </div>
        
          <div v-if="previewReport.previewData" class="mt-4">
            <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-2">Data Summary</p>
            <div class="overflow-x-auto bg-white rounded-xl border border-[#EEEAF2]">
              <table class="w-full text-xs">
                <thead>
                  <tr class="border-b border-[#EEEAF2]">
                    <th v-for="col in previewReport.previewData.columns" :key="col" class="text-left px-3 py-2 font-black text-[#7C757E] uppercase tracking-wider">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in previewReport.previewData.rows.slice(0, 5)" :key="idx" class="border-b border-[#F8F6FB]">
                    <td v-for="(val, ci) in row" :key="ci" class="px-3 py-2 text-[#475569]">{{ val }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-if="previewReport.previewData.rows.length > 5" class="text-center py-2 text-xs text-[#7C757E]">
                + {{ previewReport.previewData.rows.length - 5 }} more rows in full report
              </div>
            </div>
          </div>
          <div v-else class="mt-4 p-4 bg-white rounded-xl border border-[#EEEAF2]">
            <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-2">Summary</p>
            <p class="text-sm text-[#475569]">{{ previewReport.preview || 'Comprehensive report with detailed analysis.' }}</p>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button class="flex-1 btn-gts-secondary" @click="previewReport = null">Close</button>
          <button class="flex-1 btn-gts-primary !bg-[#7630A3]" @click="downloadReport(previewReport); previewReport = null">
            <Download class="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'
import { jsPDF } from 'jspdf'
import {
  BarChart3, Search, FileText, Eye, Download, RefreshCw, Trash2, X,
  Users, Wallet, Package, Zap, Loader2, AlertCircle
} from 'lucide-vue-next'

const adminStore = useAdminStore()
const showBuilder = ref(false)
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const previewReport = ref(null)

const newReport = ref({
  type: 'Users', range: '30',
  includeCharts: true, includeRaw: false
})

function getMockData(type, rangeDays) {
  const range = parseInt(rangeDays)
  if (type === 'Users') {
    const base = range === 7 ? 12 : range === 30 ? 48 : 156
    return {
      summary: { totalUsers: base, newRegistrations: Math.round(base * 0.3), activeUsers: Math.round(base * 0.8), suspendedUsers: Math.round(base * 0.05) },
      columns: ['Name', 'Email', 'Role', 'Status', 'Joined'],
      rows: [
        ['Abreham Desta', 'abreham@email.com', 'Customer', 'Active', '2026-04-15'],
        ['Sara Mengistu', 'sara.m@email.com', 'Admin', 'Active', '2026-04-12'],
        ['Dawit Kebede', 'dawit.k@email.com', 'Customer', 'Active', '2026-04-10'],
        ['Hana Tesfaye', 'hana.t@email.com', 'Customer', 'Suspended', '2026-04-08'],
        ['Yonas Bekele', 'yonas.b@email.com', 'Customer', 'Active', '2026-03-28'],
        ['Meron Tadesse', 'meron.t@email.com', 'Admin', 'Active', '2026-03-20'],
        ...(range >= 30 ? [['Kidist Alemu', 'kidist@email.com', 'Customer', 'Active', '2026-03-15']] : []),
        ...(range >= 90 ? [['Fasil Hailu', 'fasil@email.com', 'Customer', 'Active', '2026-02-10'], ['Tigist Worku', 'tigist@email.com', 'Customer', 'Active', '2026-01-25']] : [])
      ]
    }
  }
  if (type === 'Revenue') {
    const months = range === 7 ? 1 : range === 30 ? 1 : 3
    return {
      summary: { totalRevenue: range === 7 ? 42500 : range === 30 ? 185000 : 520000, avgDaily: range === 7 ? 6071 : range === 30 ? 6167 : 5778, topCategory: 'Electronics', growthRate: range === 7 ? '+5%' : range === 30 ? '+12%' : '+24%' },
      columns: ['Period', 'Revenue (ETB)', 'Transactions', 'Top Category'],
      rows: [
        ...(range >= 7 ? [['Apr 12-18', 'ETB 42,500', '34', 'Electronics']] : []),
        ...(range >= 30 ? [['Mar 19 - Apr 18', 'ETB 185,000', '142', 'Electronics'], ['Mar 1-18', 'ETB 78,000', '63', 'Fashion']] : []),
        ...(range >= 90 ? [['Feb 2026', 'ETB 165,000', '128', 'Electronics'], ['Jan 2026', 'ETB 170,000', '135', 'Food & Beverage']] : [])
      ]
    }
  }
  if (type === 'Products') {
    const base = range === 7 ? 5 : range === 30 ? 18 : 45
    return {
      summary: { totalProducts: base, newListings: Math.round(base * 0.4), reportedProducts: Math.round(base * 0.1), avgPrice: 'ETB 2,340' },
      columns: ['Product', 'Category', 'Price (ETB)', 'Business', 'Status'],
      rows: [
        ['Premium Coffee Beans', 'Food & Beverage', '1,250', 'Addis Coffee', 'Active'],
        ['Leather Messenger Bag', 'Fashion', '3,800', 'Habesha Leather', 'Active'],
        ['Organic Honey 500g', 'Food & Beverage', '650', 'Tigray Honey', 'Active'],
        ['Handwoven Scarf', 'Fashion', '1,200', 'Ethiopian Textiles', 'Active'],
        ...(range >= 30 ? [['Solar Power Bank', 'Electronics', '4,500', 'Sun Tech', 'Active'], ['Traditional Basket Set', 'Home & Living', '2,100', 'Meskel Crafts', 'Active']] : []),
        ...(range >= 90 ? [['Silver Necklace', 'Jewelry', '8,200', 'Sheba Silver', 'Suspended'], ['Teff Flour 5kg', 'Food & Beverage', '450', 'Amhara Grain', 'Active']] : [])
      ]
    }
  }
  return {
    summary: { totalBusinesses: range === 7 ? 3 : range === 30 ? 8 : 15, avgRating: 4.2, topPerformer: 'Addis Fresh Market', pendingVerifications: range === 7 ? 1 : range === 30 ? 3 : 5 },
    columns: ['Business', 'Category', 'Rating', 'Products', 'Inquiries'],
    rows: [
      ['Addis Fresh Market', 'Food & Beverage', '4.8', '24', '89'],
      ['Habesha Leather', 'Fashion', '4.5', '18', '65'],
      ['Abyssinia Electronics', 'Electronics', '4.2', '32', '112'],
      ...(range >= 30 ? [['Tigray Honey Co', 'Food & Beverage', '4.6', '8', '42'], ['Sun Tech Ethiopia', 'Electronics', '3.9', '15', '38']] : []),
      ...(range >= 90 ? [['Ethiopian Textiles', 'Fashion', '4.1', '22', '55'], ['Meskel Crafts', 'Home & Living', '4.4', '12', '33']] : [])
    ]
  }
}

const reportTypes = [
  { value: 'Users', label: 'User Reports', iconComp: Users, description: 'User activity and growth', bg: 'rgba(118,48,163,0.1)', color: '#7630A3' },
  { value: 'Revenue', label: 'Revenue Reports', iconComp: Wallet, description: 'Revenue and earnings', bg: 'rgba(100,210,177,0.1)', color: '#64D2B1' },
  { value: 'Products', label: 'Product Reports', iconComp: Package, description: 'Product listings overview', bg: 'rgba(118,48,163,0.1)', color: '#7630A3' },
  { value: 'Performance', label: 'Performance', iconComp: Zap, description: 'Platform metrics', bg: 'rgba(100,210,177,0.1)', color: '#64D2B1' }
]

function getReportIcon(status) {
  if (status === 'generating') return Loader2
  if (status === 'failed') return AlertCircle
  return FileText
}

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

function handleGenerate() {
  const rangeLabels = { '7': 'Last 7 Days', '30': 'Last 30 Days', '90': 'Last 90 Days' }
  const mockData = getMockData(newReport.value.type, newReport.value.range)
  const report = {
    id: Date.now(),
    name: `${newReport.value.type} Report – ${rangeLabels[newReport.value.range]}`,
    type: newReport.value.type,
    range: rangeLabels[newReport.value.range],
    rangeDays: newReport.value.range,
    generatedAt: new Date().toISOString().split('T')[0],
    status: 'ready',
    preview: `${newReport.value.type} analysis for ${rangeLabels[newReport.value.range]}. ${Object.entries(mockData.summary).map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').trim()}: ${v}`).join(', ')}.`,
    previewData: { columns: mockData.columns, rows: mockData.rows },
    mockData
  }
  adminStore.reports.unshift(report)
  showBuilder.value = false
  adminStore.showToast('Report generated successfully')
}

function openPreview(report) { previewReport.value = report }

function downloadReport(report) {
  const mockData = report.mockData || getMockData(report.type, report.rangeDays || '30')
  function safeText(str) {
    return String(str)
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u00B7/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u2026/g, '...')
      .replace(/&/g, '&')
  }
  const doc = new jsPDF()
  const reportName = safeText(report.name)
  const reportRange = safeText(report.range || 'Last 30 Days')
  doc.setFillColor(118, 48, 163)
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('GTS PLATFORM', 15, 20)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(reportName, 15, 30)
  doc.setTextColor(71, 85, 105)
  doc.setFontSize(10)
  doc.text('Generated: ' + safeText(report.generatedAt || new Date().toISOString().split('T')[0]), 15, 50)
  doc.text('Range: ' + reportRange, 15, 57)
  doc.text('Type: ' + safeText(report.type), 15, 64)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 18, 37)
  doc.text('Summary', 15, 80)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  let yPos = 90
  Object.entries(mockData.summary).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim()
    doc.setFont('helvetica', 'bold')
    doc.text(safeText(label + ':'), 15, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(safeText(value), 80, yPos)
    yPos += 8
  })
  yPos += 10
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 18, 37)
  doc.text('Detailed Data', 15, yPos)
  yPos += 8
  doc.setFillColor(248, 246, 251)
  doc.rect(15, yPos, 180, 8, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(124, 117, 126)
  const colWidth = 180 / mockData.columns.length
  mockData.columns.forEach((col, i) => {
    doc.text(safeText(col).toUpperCase(), 17 + i * colWidth, yPos + 5.5)
  })
  yPos += 10
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.setFontSize(9)
  mockData.rows.forEach((row) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    row.forEach((cell, i) => {
      doc.text(safeText(cell), 17 + i * colWidth, yPos + 4)
    })
    doc.setDrawColor(238, 234, 242)
    doc.line(15, yPos + 7, 195, yPos + 7)
    yPos += 9
  })
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(124, 117, 126)
    doc.text('GTS Platform - Page ' + i + ' of ' + pageCount, 15, 290)
    doc.text('Generated on ' + safeText(report.generatedAt || new Date().toISOString().split('T')[0]), 145, 290)
  }
  const safeFileName = reportName.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_')
  doc.save(safeFileName + '.pdf')
  adminStore.showToast('Downloaded "' + report.name + '" as PDF')
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
