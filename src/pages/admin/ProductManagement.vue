<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Product Reports</h1>
        <p class="text-[#475569] font-medium">Review products reported by customers</p>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Total Reports</div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ allReports.length }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Active</div>
        <div class="font-heading text-2xl font-black text-[#64D2B1]">{{ activeCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Suspended</div>
        <div class="font-heading text-2xl font-black text-red-500">{{ suspendedCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Pending Review</div>
        <div class="font-heading text-2xl font-black text-amber-500">{{ pendingReportCount }}</div>
      </div>
    </div>

    <div class="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#7630A3]/5 border border-[#7630A3]/10 text-sm text-[#7630A3] font-medium mb-6">
      <Flag class="w-5 h-5" />
      Showing only products reported by customers for review
    </div>

    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <Search class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7C757E]" />
        <input type="text" class="input-gts pl-12" v-model="searchQuery" placeholder="Search reported products..." id="admin-product-search">
      </div>
      <select class="select-gts max-w-[200px]" v-model="categoryFilter" id="admin-report-category-filter">
        <option value="">All Report Categories</option>
        <option v-for="cat in reportCategories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select class="select-gts max-w-[200px]" v-model="statusFilter" id="admin-report-status-filter">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
      <select class="select-gts max-w-[200px]" v-model="industryFilter" id="admin-report-industry-filter">
        <option value="">All Industries</option>
        <option v-for="ind in uniqueIndustries" :key="ind" :value="ind">{{ ind }}</option>
      </select>
    </div>

    <div class="bg-white rounded-3xl border border-[#EEEAF2] shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[#EEEAF2]">
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Product</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Report Category</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Reported By</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Date</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Status</th>
              <th class="text-right px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in paginatedReports" :key="report.id" class="border-b border-[#EEEAF2] last:border-0 hover:bg-[#F8F6FB] transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 border border-red-100 shrink-0">
                    <AlertTriangle class="w-5 h-5" />
                  </div>
                  <div class="min-w-0">
                    <span class="block text-sm font-bold text-[#1A1225] truncate max-w-[200px]">{{ report.productName }}</span>
                    <span class="block text-xs text-[#7C757E]">{{ report.industry }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-[#475569]">{{ report.reportCategory }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-[#475569]">{{ report.reportedBy }}</td>
              <td class="px-6 py-4 text-sm text-[#7C757E]">{{ formatDate(report.reportDate) }}</td>
              <td class="px-6 py-4">
                <span :class="{
                  'bg-[#64D2B1]/10 text-[#64D2B1]': report.productStatus === 'active',
                  'bg-red-50 text-red-500': report.productStatus === 'suspended'
                }" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.625rem] font-black uppercase tracking-widest">
                  <span class="w-1.5 h-1.5 rounded-full" :class="{
                    'bg-[#64D2B1]': report.productStatus === 'active',
                    'bg-red-500': report.productStatus === 'suspended'
                  }"></span>
                  {{ report.productStatus || 'active' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button v-if="report.productStatus !== 'suspended'"
                    class="btn-gts-secondary !w-11 !h-11 !px-0 bg-amber-50 text-amber-500 border-none hover:bg-amber-500"
                    @click="handleSuspendProduct(report)" title="Suspend Product">
                    <Ban class="w-5 h-5" />
                  </button>
                  <button v-if="report.productStatus === 'suspended'"
                    class="btn-gts-secondary !w-11 !h-11 !px-0 bg-[#64D2B1]/10 text-[#64D2B1] border-none hover:bg-[#64D2B1]"
                    @click="handleActivateProduct(report)" title="Activate Product">
                    <CheckCircle2 class="w-5 h-5" />
                  </button>
                  <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-[#F8F6FB] border-none"
                    @click="openDetailModal(report)" title="View Details">
                    <FileText class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredReports.length === 0">
              <td colspan="6" class="text-center py-16 text-[#7C757E]">
                <Package class="w-12 h-12 mx-auto mb-3 text-[#EEEAF2]" />
                <p class="font-medium">No reported products found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
      <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm"
        :disabled="currentPage === 1" @click="currentPage--">
        <ChevronLeft class="w-5 h-5" />
      </button>
      <button v-for="page in totalPages" :key="page"
        class="btn-gts !w-11 !h-11 !px-0"
        :class="currentPage === page ? 'bg-[#7630A3] text-white shadow-soft font-black' : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]'"
        @click="currentPage = page">
        {{ page }}
      </button>
      <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm"
        :disabled="currentPage === totalPages" @click="currentPage++">
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>

    <div v-if="selectedReport" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="selectedReport = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-lg animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Report Details</h3>
          <button class="btn-gts-secondary !w-10 !h-10 !px-0 !border-none" @click="selectedReport = null">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4">
          <div class="p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
            <div class="text-[0.625rem] text-[#7C757E] font-black uppercase tracking-widest mb-1">Product</div>
            <div class="text-sm font-bold text-[#1A1225]">{{ selectedReport.productName }}</div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
              <div class="text-[0.625rem] text-[#7C757E] font-black uppercase tracking-widest mb-1">Business</div>
              <div class="text-sm font-bold text-[#1A1225]">{{ selectedReport.businessName }}</div>
            </div>
            <div class="p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
              <div class="text-[0.625rem] text-[#7C757E] font-black uppercase tracking-widest mb-1">Industry</div>
              <div class="text-sm font-bold text-[#1A1225]">{{ selectedReport.industry }}</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
              <div class="text-[0.625rem] text-[#7C757E] font-black uppercase tracking-widest mb-1">Report Category</div>
              <div class="text-sm font-bold text-[#1A1225]">{{ selectedReport.reportCategory }}</div>
            </div>
            <div class="p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
              <div class="text-[0.625rem] text-[#7C757E] font-black uppercase tracking-widest mb-1">Reported By</div>
              <div class="text-sm font-bold text-[#1A1225]">{{ selectedReport.reportedBy }}</div>
            </div>
          </div>
          <div class="p-4 bg-red-50/50 rounded-2xl border border-red-100">
            <div class="text-[0.625rem] text-red-500 font-black uppercase tracking-widest mb-1">Description</div>
            <p class="text-sm text-[#475569] leading-relaxed">{{ selectedReport.description }}</p>
          </div>

          <div class="flex gap-3 pt-2">
            <button v-if="selectedReport.productStatus !== 'suspended'"
              class="flex-1 btn-gts bg-red-500 text-white hover:brightness-110 group"
              @click="handleSuspendProduct(selectedReport); selectedReport = null">
              <Ban class="w-5 h-5" /> Suspend Product
            </button>
            <button v-if="selectedReport.productStatus === 'suspended'"
              class="flex-1 btn-gts bg-[#64D2B1] text-white hover:brightness-110 group"
              @click="handleActivateProduct(selectedReport); selectedReport = null">
              <CheckCircle2 class="w-5 h-5" /> Activate Product
            </button>
            <button class="flex-1 btn-gts-secondary"
              @click="selectedReport = null">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'
import { Flag, Search, Package, AlertTriangle, CheckCircle2, Ban, FileText, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'

const adminStore = useAdminStore()
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const industryFilter = ref('')
const selectedReport = ref(null)
const currentPage = ref(1)
const perPage = 6

const allReports = computed(() => {
  return adminStore.reportedProducts.map(r => ({
    ...r,
    productStatus: r.productStatus || 'active'
  }))
})

const activeCount = computed(() => allReports.value.filter(r => r.productStatus === 'active').length)
const suspendedCount = computed(() => allReports.value.filter(r => r.productStatus === 'suspended').length)
const pendingReportCount = computed(() => allReports.value.filter(r => r.status === 'pending').length)

const reportCategories = computed(() => [...new Set(allReports.value.map(r => r.reportCategory))].sort())
const uniqueIndustries = computed(() => [...new Set(allReports.value.map(r => r.industry))].sort())

const filteredReports = computed(() => {
  let list = [...allReports.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r => r.productName.toLowerCase().includes(q) || r.businessName.toLowerCase().includes(q) || r.reportedBy.toLowerCase().includes(q))
  }
  if (categoryFilter.value) {
    list = list.filter(r => r.reportCategory === categoryFilter.value)
  }
  if (statusFilter.value) {
    list = list.filter(r => r.productStatus === statusFilter.value)
  }
  if (industryFilter.value) {
    list = list.filter(r => r.industry === industryFilter.value)
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredReports.value.length / perPage))
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredReports.value.slice(start, start + perPage)
})

watch([searchQuery, categoryFilter, statusFilter, industryFilter], () => { currentPage.value = 1 })

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function openDetailModal(report) {
  selectedReport.value = { ...report }
}

function handleSuspendProduct(report) {
  const rp = adminStore.reportedProducts.find(r => r.id === report.id)
  if (rp) {
    rp.productStatus = 'suspended'
    localStorage.setItem('gts_reported_products', JSON.stringify(adminStore.reportedProducts))
    adminStore.showToast(`Product "${report.productName}" suspended`, 'warning')
  }
}

function handleActivateProduct(report) {
  const rp = adminStore.reportedProducts.find(r => r.id === report.id)
  if (rp) {
    rp.productStatus = 'active'
    localStorage.setItem('gts_reported_products', JSON.stringify(adminStore.reportedProducts))
    adminStore.showToast(`Product "${report.productName}" activated`)
  }
}
</script>
