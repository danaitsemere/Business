<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Verification Center</h1>
        <p class="text-[#475569] font-medium">Review and approve business & service provider applications</p>
      </div>
      <button v-if="selectedIds.length > 0" class="btn-gts-primary" @click="bulkApprove">
        <ClipboardCheck class="w-5 h-5" /> Approve Selected ({{ selectedIds.length }})
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-3 mb-6">
      <button v-for="tab in tabs" :key="tab.value"
        class="btn-gts !rounded-full !px-5"
        :class="activeTab === tab.value
          ? 'bg-primary-500 text-white shadow-soft font-black'
          : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-primary-500/30 font-bold'"
        @click="activeTab = tab.value; currentPage = 1">
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <Search class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7C757E]" />
        <input type="text" class="input-gts pl-12" v-model="searchQuery"
          placeholder="Search by name or email..." id="admin-verification-search">
      </div>
      <select class="input-gts max-w-[200px]" v-model="typeFilter" id="admin-verification-type-filter">
        <option value="">All Types</option>
        <option value="merchant">Business</option>
        <option value="service_provider">Service Provider</option>
      </select>
      <select class="input-gts max-w-[200px]" v-model="categoryFilter" id="admin-verification-category-filter">
        <option value="">All Categories</option>
        <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select class="input-gts max-w-[200px]" v-model="locationFilter" id="admin-verification-location-filter">
        <option value="">All Locations</option>
        <option v-for="loc in uniqueLocations" :key="loc" :value="loc">{{ loc }}</option>
      </select>
      <button v-if="searchQuery || typeFilter || categoryFilter || locationFilter"
        class="btn-gts-secondary !rounded-full !px-5"
        @click="resetFilters">
        <RotateCcw class="w-4 h-4" /> Reset
      </button>
    </div>

    <div class="bg-white rounded-3xl border border-[#EEEAF2] shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[#EEEAF2]">
              <th class="text-left px-4 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E] w-10">
                <input v-if="activeTab === 'pending'" type="checkbox"
                  class="w-4 h-4 accent-[#7630A3] rounded cursor-pointer"
                  :checked="allPendingSelected"
                  @change="toggleSelectAll">
              </th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Organization</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Type</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Category</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Location</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Status</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Applied</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Documents</th>
              <th class="text-right px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="biz in paginatedBusinesses" :key="biz.id"
              class="border-b border-[#EEEAF2] last:border-0 hover:bg-[#F8F6FB] transition-colors">
              <td class="px-4 py-4">
                <input v-if="biz.status === 'pending'" type="checkbox"
                  :checked="selectedIds.includes(biz.id)"
                  @change="toggleSelect(biz.id)"
                  class="w-4 h-4 accent-[#7630A3] rounded cursor-pointer">
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-[#F8F6FB] rounded-xl flex items-center justify-center font-black text-[#7630A3] border border-[#EEEAF2] shrink-0">
                    {{ biz.name.charAt(0) }}
                  </div>
                  <div class="min-w-0">
                    <span class="block text-sm font-bold text-[#1A1225] truncate max-w-[160px]">{{ biz.name }}</span>
                    <span class="block text-xs text-[#7C757E] truncate max-w-[160px]">{{ biz.email }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-[#475569] font-medium">
                  {{ biz.businessType === 'service_provider' ? 'Service Provider' : 'Business' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-[#475569]">{{ biz.category }}</td>
              <td class="px-6 py-4 text-sm text-[#7C757E]">{{ biz.location }}</td>
              <td class="px-6 py-4">
                <span :class="{
                  'bg-[#64D2B1]/10 text-[#64D2B1]': biz.status === 'approved',
                  'bg-amber-50 text-amber-600': biz.status === 'pending',
                  'bg-red-50 text-red-500': biz.status === 'rejected'
                }" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.5rem] font-black uppercase tracking-widest">
                  <span class="w-1.5 h-1.5 rounded-full" :class="{
                    'bg-[#64D2B1]': biz.status === 'approved',
                    'bg-amber-500': biz.status === 'pending',
                    'bg-red-500': biz.status === 'rejected'
                  }"></span>
                  {{ biz.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-[#7C757E]">{{ formatDate(biz.createdAt) }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <button v-for="doc in (biz.documents || []).slice(0, 2)" :key="doc"
                    class="btn-gts-secondary !h-9 !px-2.5 !text-[0.625rem] !gap-1"
                    @click="openDocPreview(doc, biz.name)">
                    <FileText class="w-3 h-3" />
                    <span class="max-w-[60px] truncate">{{ doc.replace('.pdf', '') }}</span>
                  </button>
                  <span v-if="(biz.documents || []).length > 2" class="text-xs text-[#7C757E] self-center">
                    +{{ biz.documents.length - 2 }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button v-if="biz.status === 'pending'"
                    class="btn-gts-secondary !w-11 !h-11 !px-0 bg-[#64D2B1]/10 text-[#64D2B1] border-none hover:bg-[#64D2B1] hover:text-white"
                    @click="confirmApprove(biz)" title="Approve">
                    <CheckCircle2 class="w-5 h-5" />
                  </button>
                  <button v-if="biz.status === 'pending'"
                    class="btn-gts-secondary !w-11 !h-11 !px-0 bg-red-50 text-red-500 border-none hover:bg-red-500 hover:text-white"
                    @click="openRejectModal(biz)" title="Reject">
                    <XCircle class="w-5 h-5" />
                  </button>
                  <button
                    class="btn-gts-secondary !w-11 !h-11 !px-0 bg-[#F8F6FB] text-[#7C757E] border-none hover:bg-[#7630A3]/10 hover:text-[#7630A3]"
                    @click="openDetails(biz)" title="View Details">
                    <Eye class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredBusinesses.length === 0">
              <td colspan="9" class="text-center py-16 text-[#7C757E]">
                <BadgeCheck class="w-12 h-12 mx-auto mb-3 text-[#EEEAF2]" />
                <p class="text-lg font-medium">{{ activeTab === 'pending' ? 'No pending verifications' : 'No businesses found' }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
      <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm"
        :disabled="currentPage === 1" @click="currentPage--">
        <ChevronLeft class="w-5 h-5" />
      </button>
      <button v-for="page in totalPages" :key="page"
        class="btn-gts !w-11 !h-11 !px-0"
        :class="currentPage === page ? 'bg-[#7630A3] text-white shadow-soft font-black' : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-[#7630A3] font-bold'"
        @click="currentPage = page">
        {{ page }}
      </button>
      <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm"
        :disabled="currentPage === totalPages" @click="currentPage++">
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>

    <div v-if="detailTarget" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="detailTarget = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-lg animate-scale-in shadow-2xl max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">{{ detailTarget.name }}</h3>
          <button class="btn-gts-secondary !w-11 !h-11 !px-0 !border-none" @click="detailTarget = null"><X class="w-5 h-5" /></button>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
            <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Email</div>
            <div class="text-sm text-[#1A1225] font-medium truncate">{{ detailTarget.email }}</div>
          </div>
          <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
            <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Phone</div>
            <div class="text-sm text-[#1A1225] font-medium">{{ detailTarget.phone }}</div>
          </div>
          <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
            <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Category</div>
            <div class="text-sm text-[#1A1225] font-medium">{{ detailTarget.category }}</div>
          </div>
          <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
            <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Location</div>
            <div class="text-sm text-[#1A1225] font-medium">{{ detailTarget.location }}</div>
          </div>
          <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
            <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Applied</div>
            <div class="text-sm text-[#1A1225] font-medium">{{ formatDate(detailTarget.createdAt) }}</div>
          </div>
          <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
            <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Products</div>
            <div class="text-sm text-[#1A1225] font-medium">{{ detailTarget.productCount }}</div>
          </div>
        </div>

        <div v-if="detailTarget.status === 'pending'" class="mb-4 p-4 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
          <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-3">Verification Checklist</p>
          <div class="space-y-2">
            <label v-for="item in checklistItems" :key="item.key" class="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" :checked="getChecklist(detailTarget.id, item.key)" @change="toggleChecklist(detailTarget.id, item.key)"
                class="w-4 h-4 accent-[#64D2B1] rounded cursor-pointer">
              <span class="text-sm text-[#475569] font-medium group-hover:text-[#1A1225] transition-colors">{{ item.label }}</span>
            </label>
          </div>
        </div>

        <div v-if="detailTarget.documents?.length" class="mb-4">
          <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-2">Documents</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="doc in detailTarget.documents" :key="doc"
              class="btn-gts-secondary !h-11 border-[#EEEAF2] hover:border-[#7630A3]/30 hover:text-[#7630A3]"
              @click="openDocPreview(doc, detailTarget.name)">
              <FileText class="w-4 h-4 text-[#7630A3]" />
              {{ doc }}
              <ExternalLink class="w-3 h-3 text-[#7C757E]" />
            </button>
          </div>
        </div>

        <div v-if="detailTarget.status !== 'pending'" class="mb-4 p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
          <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-2">History</p>
          <div class="space-y-1 text-xs text-[#475569]">
            <div>📋 Applied: {{ formatDate(detailTarget.createdAt) }}</div>
            <div v-if="detailTarget.approvedAt">✅ Approved: {{ formatDate(detailTarget.approvedAt) }}</div>
            <div v-if="detailTarget.rejectedAt">❌ Rejected: {{ formatDate(detailTarget.rejectedAt) }}</div>
            <div v-if="detailTarget.rejectionReason" class="text-red-500 mt-1">Reason: {{ detailTarget.rejectionReason }}</div>
          </div>
        </div>

        <div v-if="detailTarget.status === 'pending'" class="flex gap-3">
          <button class="flex-1 btn-gts-primary !bg-[#64D2B1]"
            @click="confirmApprove(detailTarget); detailTarget = null">
            <CheckCircle2 class="w-5 h-5" /> Approve
          </button>
          <button class="flex-1 btn-gts-secondary text-red-500 hover:bg-red-500 hover:text-white"
            @click="openRejectModal(detailTarget); detailTarget = null">
            <XCircle class="w-5 h-5" /> Reject
          </button>
        </div>
        <div v-else-if="detailTarget.status === 'approved'" class="flex items-center gap-2 text-sm text-[#64D2B1] font-bold">
          <BadgeCheck class="w-5 h-5" /> Business verified & approved
        </div>
        <div v-else class="flex items-center gap-2 text-sm text-red-500 font-bold">
          <XCircle class="w-5 h-5" /> Application rejected
        </div>
      </div>
    </div>

    <div v-if="approveTarget" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="approveTarget = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-sm animate-scale-in shadow-2xl text-center">
        <div class="w-16 h-16 bg-[#64D2B1]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BadgeCheck class="w-8 h-8 text-[#64D2B1]" />
        </div>
        <h3 class="font-heading text-xl font-black text-[#1A1225] mb-2">Approve Business?</h3>
        <p class="text-sm text-[#475569] mb-6">Are you sure you want to approve <strong>{{ approveTarget.name }}</strong>?</p>
        <div class="flex gap-3">
          <button class="flex-1 btn-gts-secondary" @click="approveTarget = null">Cancel</button>
          <button class="flex-1 btn-gts-primary !bg-[#64D2B1]" @click="handleApprove">Approve</button>
        </div>
      </div>
    </div>

    <div v-if="rejectTarget" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="rejectTarget = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Reject Business</h3>
          <button class="btn-gts-secondary !w-11 !h-11 !px-0 !border-none" @click="rejectTarget = null"><X class="w-5 h-5" /></button>
        </div>
        <p class="text-sm text-[#475569] mb-4">Rejecting <strong>{{ rejectTarget.name }}</strong>. Please provide a reason:</p>
        <div class="space-y-2 mb-6">
          <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Reason for Rejection</label>
          <textarea class="input-gts min-h-[100px] resize-none" v-model="rejectReason" placeholder="e.g., Invalid documentation, suspicious activity..."></textarea>
        </div>
        <button class="btn-gts-primary w-full mt-2 !bg-red-500" @click="handleReject">
          <XCircle class="w-5 h-5" /> Submit Rejection
        </button>
      </div>
    </div>

    <div v-if="docPreview" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="docPreview = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-lg animate-scale-in shadow-2xl max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">{{ docPreview.name }}</h3>
          <button class="btn-gts-secondary !w-11 !h-11 !px-0 !border-none" @click="docPreview = null"><X class="w-5 h-5" /></button>
        </div>

        <div class="bg-[#F8F6FB] border border-[#EEEAF2] rounded-2xl p-6 mb-4">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 bg-[#7630A3]/10 rounded-2xl flex items-center justify-center">
              <FileText class="w-8 h-8 text-[#7630A3]" />
            </div>
            <div>
              <p class="font-heading text-base font-black text-[#1A1225]">{{ docPreview.name }}</p>
              <p class="text-sm text-[#7C757E] font-medium">From: {{ docPreview.business }}</p>
              <p class="text-xs text-[#7C757E]">PDF • {{ docPreview.size }} • Uploaded {{ docPreview.uploadDate }}</p>
            </div>
          </div>
        </div>

        <div class="border border-[#EEEAF2] rounded-2xl overflow-hidden mb-4">
          <div class="bg-white p-6 space-y-4">
            <div class="text-center pb-4 border-b border-[#EEEAF2]">
              <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-1">Federal Democratic Republic of Ethiopia</p>
              <p class="font-heading text-base font-black text-[#1A1225]">{{ docPreview.docTitle }}</p>
              <p class="text-xs text-[#7C757E] mt-1">{{ docPreview.docSubtitle }}</p>
            </div>
            <div class="space-y-3">
              <div v-for="field in docPreview.fields" :key="field.label" class="flex justify-between items-start py-2 border-b border-[#F8F6FB]">
                <span class="text-xs text-[#7C757E] font-bold uppercase tracking-wider">{{ field.label }}</span>
                <span class="text-sm font-bold text-[#1A1225] text-right max-w-[60%]">{{ field.value }}</span>
              </div>
            </div>
            <div class="mt-4 p-3 bg-[#64D2B1]/5 border border-[#64D2B1]/20 rounded-xl">
              <div class="flex items-center gap-2">
                <BadgeCheck class="w-4 h-4 text-[#64D2B1]" />
                <span class="text-xs font-bold text-[#64D2B1]">{{ docPreview.validityStatus }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button class="flex-1 btn-gts-primary !bg-primary-500"
            @click="downloadMockDoc">
            <Download class="w-4 h-4" /> Download
          </button>
          <button class="flex-1 btn-gts-primary !bg-[#64D2B1]"
            @click="approveDoc">
            <CheckCircle2 class="w-4 h-4" /> Approve
          </button>
          <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm !text-amber-500"
            @click="flagDoc" title="Flag for review">
            <Flag class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'
import { jsPDF } from 'jspdf'
import {
  ClipboardCheck, CheckCircle2, XCircle, BadgeCheck, FileText,
  ExternalLink, ChevronLeft, ChevronRight, X, Download, Flag,
  Search, RotateCcw, Eye
} from 'lucide-vue-next'

const adminStore = useAdminStore()
const activeTab = ref('all')
const searchQuery = ref('')
const typeFilter = ref('')
const categoryFilter = ref('')
const locationFilter = ref('')
const approveTarget = ref(null)
const rejectTarget = ref(null)
const rejectReason = ref('')
const docPreview = ref(null)
const detailTarget = ref(null)
const selectedIds = ref([])
const currentPage = ref(1)
const perPage = 8
const checklists = reactive({})

const checklistItems = [
  { key: 'trade_license', label: 'Trade License valid' },
  { key: 'identity', label: 'Identity verified' },
  { key: 'contact', label: 'Contact info matches' },
  { key: 'no_suspicious', label: 'No suspicious activity' }
]

const tabs = computed(() => [
  { value: 'all', label: 'All', count: adminStore.businesses.length },
  { value: 'pending', label: 'Pending', count: adminStore.pendingBusinesses.length },
  { value: 'approved', label: 'Approved', count: adminStore.approvedBusinesses.length },
  { value: 'rejected', label: 'Rejected', count: adminStore.rejectedBusinesses.length }
])

const uniqueCategories = computed(() => [...new Set(adminStore.businesses.map(b => b.category))].sort())
const uniqueLocations = computed(() => [...new Set(adminStore.businesses.map(b => b.location).filter(Boolean))].sort())

const baseList = computed(() => {
  if (activeTab.value === 'all') return adminStore.businesses
  return adminStore.businesses.filter(b => b.status === activeTab.value)
})

const filteredBusinesses = computed(() => {
  let list = [...baseList.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(b => b.name.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q))
  }
  if (typeFilter.value) list = list.filter(b => b.businessType === typeFilter.value)
  if (categoryFilter.value) list = list.filter(b => b.category === categoryFilter.value)
  if (locationFilter.value) list = list.filter(b => b.location === locationFilter.value)
  return list
})

const totalPages = computed(() => Math.ceil(filteredBusinesses.value.length / perPage))
const paginatedBusinesses = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredBusinesses.value.slice(start, start + perPage)
})

watch([activeTab, searchQuery, typeFilter, categoryFilter, locationFilter], () => { currentPage.value = 1 })

const allPendingSelected = computed(() => {
  const pendingIds = filteredBusinesses.value.filter(b => b.status === 'pending').map(b => b.id)
  return pendingIds.length > 0 && pendingIds.every(id => selectedIds.value.includes(id))
})

function resetFilters() {
  searchQuery.value = ''
  typeFilter.value = ''
  categoryFilter.value = ''
  locationFilter.value = ''
}

function toggleSelectAll(e) {
  const pendingIds = filteredBusinesses.value.filter(b => b.status === 'pending').map(b => b.id)
  if (e.target.checked) {
    selectedIds.value = [...new Set([...selectedIds.value, ...pendingIds])]
  } else {
    selectedIds.value = selectedIds.value.filter(id => !pendingIds.includes(id))
  }
}

function toggleSelect(id) {
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

function confirmApprove(biz) { approveTarget.value = biz }

function handleApprove() {
  if (approveTarget.value) {
    adminStore.approveBusiness(approveTarget.value.id)
    approveTarget.value = null
  }
}

function openRejectModal(biz) {
  rejectTarget.value = biz
  rejectReason.value = ''
}

function handleReject() {
  if (rejectTarget.value) {
    adminStore.rejectBusiness(rejectTarget.value.id, rejectReason.value)
    rejectTarget.value = null
    rejectReason.value = ''
  }
}

function bulkApprove() {
  selectedIds.value.forEach(id => adminStore.approveBusiness(id))
  adminStore.showToast(`${selectedIds.value.length} businesses approved`)
  selectedIds.value = []
}

function openDetails(biz) { detailTarget.value = biz }

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getChecklist(bizId, key) { return checklists[`${bizId}_${key}`] || false }
function toggleChecklist(bizId, key) { checklists[`${bizId}_${key}`] = !checklists[`${bizId}_${key}`] }

function openDocPreview(docName, bizName) {
  const mockDocs = {
    'Trade_License.pdf': {
      docTitle: 'Trade License Certificate',
      docSubtitle: 'Ministry of Trade and Regional Integration',
      size: '1.2 MB', uploadDate: 'Mar 15, 2026',
      validityStatus: 'Document verified – Valid until Dec 2027',
      fields: [
        { label: 'License Number', value: 'TL-2025-ETH-' + Math.floor(10000 + Math.random() * 90000) },
        { label: 'Business Name', value: bizName },
        { label: 'Trade Category', value: 'General Import & Export' },
        { label: 'Issued Date', value: 'January 15, 2025' },
        { label: 'Expiry Date', value: 'December 31, 2027' },
        { label: 'Registered City', value: 'Addis Ababa' },
        { label: 'Tax ID (TIN)', value: Math.floor(1000000000 + Math.random() * 9000000000).toString() }
      ]
    },
    'Business_Registration.pdf': {
      docTitle: 'Certificate of Business Registration',
      docSubtitle: 'Ethiopian Investment Commission',
      size: '856 KB', uploadDate: 'Mar 12, 2026',
      validityStatus: 'Registration active – Renewed annually',
      fields: [
        { label: 'Registration No.', value: 'BR-ETH-' + Math.floor(100000 + Math.random() * 900000) },
        { label: 'Business Name', value: bizName },
        { label: 'Business Type', value: 'Private Limited Company (PLC)' },
        { label: 'Capital (ETB)', value: 'ETB ' + (Math.floor(500 + Math.random() * 5000) * 1000).toLocaleString() },
        { label: 'Registration Date', value: 'August 20, 2024' },
        { label: 'Registered Address', value: 'Addis Ababa, Bole Sub-City' }
      ]
    }
  }
  const defaultDoc = {
    docTitle: 'Official Document', docSubtitle: 'Government of Ethiopia',
    size: '1.0 MB', uploadDate: 'Mar 2026',
    validityStatus: 'Document pending verification',
    fields: [{ label: 'Document Name', value: docName }, { label: 'Business', value: bizName }, { label: 'Status', value: 'Under Review' }]
  }
  const docData = mockDocs[docName] || defaultDoc
  docPreview.value = { name: docName, business: bizName, ...docData }
}

function downloadMockDoc() {
  if (!docPreview.value) return
  function safeText(str) {
    return String(str)
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u00B7/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u2026/g, '...')
  }
  const doc = new jsPDF()
  const d = docPreview.value
  doc.setFillColor(118, 48, 163)
  doc.rect(0, 0, 210, 35, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('GTS PLATFORM', 15, 18)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Verification Document', 15, 28)
  doc.setTextColor(26, 18, 37)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(safeText(d.docTitle), 105, 52, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(124, 117, 126)
  doc.text(safeText(d.docSubtitle), 105, 60, { align: 'center' })
  doc.setDrawColor(238, 234, 242)
  doc.setLineWidth(0.5)
  doc.line(15, 66, 195, 66)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105)
  doc.text('Business: ' + safeText(d.business), 15, 76)
  doc.setFont('helvetica', 'normal')
  doc.text('Uploaded: ' + safeText(d.uploadDate || 'N/A'), 15, 83)
  doc.text('File Size: ' + safeText(d.size || 'N/A'), 15, 90)
  let yPos = 105
  doc.setFillColor(248, 246, 251)
  doc.rect(15, yPos - 5, 180, 10, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(124, 117, 126)
  doc.text('FIELD', 20, yPos + 1)
  doc.text('VALUE', 100, yPos + 1)
  yPos += 12
  doc.setFontSize(10)
  d.fields.forEach((field) => {
    if (yPos > 260) {
      doc.addPage()
      yPos = 25
    }
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(124, 117, 126)
    doc.text(safeText(field.label), 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(26, 18, 37)
    doc.text(safeText(field.value), 100, yPos)
    doc.setDrawColor(248, 246, 251)
    doc.line(15, yPos + 4, 195, yPos + 4)
    yPos += 10
  })
  yPos += 8
  doc.setFillColor(240, 253, 244)
  doc.roundedRect(15, yPos - 4, 180, 14, 3, 3, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(100, 210, 177)
  doc.text(safeText(d.validityStatus), 25, yPos + 5)
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(124, 117, 126)
    doc.text('GTS Platform - Verification Document', 15, 290)
    doc.text('Page ' + i + ' of ' + pageCount, 175, 290)
  }
  const safeFileName = safeText(d.name).replace(/[^a-zA-Z0-9_\-.]/g, '_').replace(/_+/g, '_')
  doc.save(safeFileName)
  adminStore.showToast('Downloaded ' + d.name + ' as PDF')
}

function approveDoc() { adminStore.showToast(`Document "${docPreview.value.name}" approved`, 'success'); docPreview.value = null }
function flagDoc() { adminStore.showToast(`Document "${docPreview.value.name}" flagged for review`, 'warning'); docPreview.value = null }
</script>
