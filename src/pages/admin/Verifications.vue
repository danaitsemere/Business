<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Verification Center</h1>
        <p class="text-[#475569] font-medium">Review and approve business applications</p>
      </div>
      <!-- Bulk Approve -->
      <button v-if="selectedIds.length > 0" class="btn-gts-primary" @click="bulkApprove">
        <span class="material-icons-round">done_all</span> Approve Selected ({{ selectedIds.length }})
      </button>
    </div>

    <!-- Tabs (reordered: All first) -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <button v-for="tab in tabs" :key="tab.value"
        class="px-5 py-2.5 rounded-full text-[0.813rem] font-bold border-2 transition-all duration-200"
        :class="activeTab === tab.value
          ? 'bg-[#7630A3] border-[#7630A3] text-white shadow-soft'
          : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]/30'"
        @click="activeTab = tab.value">
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <!-- Business Verification Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="biz in paginatedBusinesses" :key="biz.id"
        class="bg-white rounded-3xl border border-[#EEEAF2] p-6 shadow-sm hover:shadow-soft transition-all">
        <div class="flex items-start gap-4">
          <!-- Bulk select checkbox -->
          <div v-if="biz.status === 'pending'" class="pt-1">
            <input type="checkbox" :checked="selectedIds.includes(biz.id)" @change="toggleSelect(biz.id)"
              class="w-5 h-5 rounded-lg accent-[#7630A3] cursor-pointer">
          </div>
          <div class="w-14 h-14 rounded-2xl bg-[#F8F6FB] border border-[#EEEAF2] flex items-center justify-center font-black text-[#7630A3] text-xl shrink-0">
            {{ biz.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-heading text-lg font-black text-[#1A1225] truncate">{{ biz.name }}</h3>
              <span :class="{
                'bg-[#64D2B1]/10 text-[#64D2B1]': biz.status === 'approved',
                'bg-amber-50 text-amber-600': biz.status === 'pending',
                'bg-red-50 text-red-500': biz.status === 'rejected'
              }" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.5rem] font-black uppercase tracking-widest shrink-0">
                {{ biz.status }}
              </span>
            </div>
            <p class="text-sm text-[#7C757E] mb-3">{{ biz.category }} • {{ biz.location }}</p>

            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
                <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Email</div>
                <div class="text-sm text-[#1A1225] font-medium truncate">{{ biz.email }}</div>
              </div>
              <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
                <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Phone</div>
                <div class="text-sm text-[#1A1225] font-medium">{{ biz.phone }}</div>
              </div>
              <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
                <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Applied</div>
                <div class="text-sm text-[#1A1225] font-medium">{{ formatDate(biz.createdAt) }}</div>
              </div>
              <div class="p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
                <div class="text-[0.625rem] text-[#7C757E] font-medium mb-0.5">Products{{ biz.status === 'pending' ? ' (pending)' : '' }}</div>
                <div class="text-sm text-[#1A1225] font-medium">{{ biz.productCount }}</div>
              </div>
            </div>

            <!-- Documents (clickable) -->
            <div v-if="biz.documents && biz.documents.length" class="mb-4">
              <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-2">Submitted Documents</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="doc in biz.documents" :key="doc"
                  class="flex items-center gap-2 px-3 py-2 bg-[#F8F6FB] rounded-xl text-sm text-[#475569] border border-[#EEEAF2] hover:border-[#7630A3]/30 hover:text-[#7630A3] transition-all cursor-pointer"
                  @click="openDocPreview(doc, biz.name)">
                  <span class="material-icons-round text-base text-[#7630A3]">description</span>
                  {{ doc }}
                  <span class="material-icons-round text-xs text-[#7C757E]">open_in_new</span>
                </button>
              </div>
            </div>

            <!-- Status history -->
            <div v-if="biz.status !== 'pending'" class="mb-4 p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
              <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-2">History</p>
              <div class="space-y-1 text-xs text-[#475569]">
                <div>📋 Applied: {{ formatDate(biz.createdAt) }}</div>
                <div v-if="biz.approvedAt">✅ Approved: {{ formatDate(biz.approvedAt) }}</div>
                <div v-if="biz.rejectedAt">❌ Rejected: {{ formatDate(biz.rejectedAt) }}</div>
                <div v-if="biz.rejectionReason" class="text-red-500 mt-1">Reason: {{ biz.rejectionReason }}</div>
              </div>
            </div>

            <!-- Verification Checklist (for pending) -->
            <div v-if="biz.status === 'pending'" class="mb-4 p-4 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
              <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-3">Verification Checklist</p>
              <div class="space-y-2">
                <label v-for="item in checklistItems" :key="item.key" class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" :checked="getChecklist(biz.id, item.key)" @change="toggleChecklist(biz.id, item.key)"
                    class="w-4 h-4 accent-[#64D2B1] rounded cursor-pointer">
                  <span class="text-sm text-[#475569] font-medium group-hover:text-[#1A1225] transition-colors">{{ item.label }}</span>
                </label>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="biz.status === 'pending'" class="flex items-center gap-3">
              <button class="flex-1 py-3 rounded-xl bg-[#64D2B1] text-white font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
                @click="confirmApprove(biz)">
                <span class="material-icons-round text-base">check_circle</span>
                Approve
              </button>
              <button class="flex-1 py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                @click="openRejectModal(biz)">
                <span class="material-icons-round text-base">cancel</span>
                Reject
              </button>
            </div>
            <div v-else-if="biz.status === 'approved'" class="flex items-center gap-2 text-sm text-[#64D2B1] font-bold">
              <span class="material-icons-round text-base">verified</span>
              Business verified & approved
            </div>
            <div v-else class="flex items-center gap-2 text-sm text-red-500 font-bold">
              <span class="material-icons-round text-base">cancel</span>
              Application rejected
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="displayedBusinesses.length === 0" class="text-center py-16 text-[#7C757E]">
      <span class="material-icons-round text-5xl mb-3 block text-[#EEEAF2]">verified</span>
      <p class="text-lg font-medium">{{ activeTab === 'pending' ? 'No pending verifications' : 'No businesses found' }}</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
      <button class="w-10 h-10 rounded-xl border border-[#EEEAF2] flex items-center justify-center text-[#7C757E] hover:border-[#7630A3] hover:text-[#7630A3] transition-all disabled:opacity-30"
        :disabled="currentPage === 1" @click="currentPage--">
        <span class="material-icons-round text-lg">chevron_left</span>
      </button>
      <button v-for="page in totalPages" :key="page"
        class="w-10 h-10 rounded-xl text-sm font-black flex items-center justify-center transition-all"
        :class="currentPage === page ? 'bg-[#7630A3] text-white' : 'border border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]'"
        @click="currentPage = page">
        {{ page }}
      </button>
      <button class="w-10 h-10 rounded-xl border border-[#EEEAF2] flex items-center justify-center text-[#7C757E] hover:border-[#7630A3] hover:text-[#7630A3] transition-all disabled:opacity-30"
        :disabled="currentPage === totalPages" @click="currentPage++">
        <span class="material-icons-round text-lg">chevron_right</span>
      </button>
    </div>

    <!-- Approve Confirmation Modal -->
    <div v-if="approveTarget" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="approveTarget = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-sm animate-scale-in shadow-2xl text-center">
        <div class="w-16 h-16 bg-[#64D2B1]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="material-icons-round text-3xl text-[#64D2B1]">verified</span>
        </div>
        <h3 class="font-heading text-xl font-black text-[#1A1225] mb-2">Approve Business?</h3>
        <p class="text-sm text-[#475569] mb-6">Are you sure you want to approve <strong>{{ approveTarget.name }}</strong>?</p>
        <div class="flex gap-3">
          <button class="flex-1 py-3 rounded-xl bg-[#F8F6FB] text-[#475569] font-bold text-sm" @click="approveTarget = null">Cancel</button>
          <button class="flex-1 py-3 rounded-xl bg-[#64D2B1] text-white font-bold text-sm hover:brightness-110 transition-all" @click="handleApprove">Approve</button>
        </div>
      </div>
    </div>

    <!-- Reject Modal with reason -->
    <div v-if="rejectTarget" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="rejectTarget = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Reject Business</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225]" @click="rejectTarget = null"><span class="material-icons-round">close</span></button>
        </div>
        <p class="text-sm text-[#475569] mb-4">Rejecting <strong>{{ rejectTarget.name }}</strong>. Please provide a reason:</p>
        <div class="space-y-2 mb-6">
          <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Reason for Rejection</label>
          <textarea class="input-gts min-h-[100px] resize-none" v-model="rejectReason" placeholder="e.g., Invalid documentation, suspicious activity..."></textarea>
        </div>
        <button class="w-full py-4 rounded-xl bg-red-500 text-white font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2" @click="handleReject">
          <span class="material-icons-round">cancel</span> Submit Rejection
        </button>
      </div>
    </div>

    <!-- Document Preview Modal -->
    <div v-if="docPreview" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="docPreview = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-lg animate-scale-in shadow-2xl max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-lg font-black text-[#1A1225]">{{ docPreview.name }}</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225]" @click="docPreview = null"><span class="material-icons-round">close</span></button>
        </div>

        <!-- Document Header -->
        <div class="bg-[#F8F6FB] border border-[#EEEAF2] rounded-2xl p-6 mb-4">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 bg-[#7630A3]/10 rounded-2xl flex items-center justify-center">
              <span class="material-icons-round text-3xl text-[#7630A3]">picture_as_pdf</span>
            </div>
            <div>
              <p class="font-heading text-base font-black text-[#1A1225]">{{ docPreview.name }}</p>
              <p class="text-sm text-[#7C757E] font-medium">From: {{ docPreview.business }}</p>
              <p class="text-xs text-[#7C757E]">PDF • {{ docPreview.size }} • Uploaded {{ docPreview.uploadDate }}</p>
            </div>
          </div>
        </div>

        <!-- Mock Document Content -->
        <div class="border border-[#EEEAF2] rounded-2xl overflow-hidden mb-4">
          <div class="bg-white p-6 space-y-4">
            <!-- Simulated document header -->
            <div class="text-center pb-4 border-b border-[#EEEAF2]">
              <p class="text-[0.625rem] font-black uppercase tracking-widest text-[#7C757E] mb-1">Federal Democratic Republic of Ethiopia</p>
              <p class="font-heading text-base font-black text-[#1A1225]">{{ docPreview.docTitle }}</p>
              <p class="text-xs text-[#7C757E] mt-1">{{ docPreview.docSubtitle }}</p>
            </div>

            <!-- Document fields -->
            <div class="space-y-3">
              <div v-for="field in docPreview.fields" :key="field.label" class="flex justify-between items-start py-2 border-b border-[#F8F6FB]">
                <span class="text-xs text-[#7C757E] font-bold uppercase tracking-wider">{{ field.label }}</span>
                <span class="text-sm font-bold text-[#1A1225] text-right max-w-[60%]">{{ field.value }}</span>
              </div>
            </div>

            <!-- Validity section -->
            <div class="mt-4 p-3 bg-[#64D2B1]/5 border border-[#64D2B1]/20 rounded-xl">
              <div class="flex items-center gap-2">
                <span class="material-icons-round text-[#64D2B1] text-base">verified</span>
                <span class="text-xs font-bold text-[#64D2B1]">{{ docPreview.validityStatus }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button class="flex-1 py-3 rounded-xl bg-[#7630A3] text-white font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
            @click="downloadMockDoc">
            <span class="material-icons-round text-base">download</span> Download
          </button>
          <button class="flex-1 py-3 rounded-xl bg-[#64D2B1] text-white font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
            @click="approveDoc">
            <span class="material-icons-round text-base">check_circle</span> Approve
          </button>
          <button class="py-3 px-4 rounded-xl bg-amber-50 text-amber-500 font-bold text-sm hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center"
            @click="flagDoc" title="Flag for review">
            <span class="material-icons-round text-base">flag</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const activeTab = ref('all')
const approveTarget = ref(null)
const rejectTarget = ref(null)
const rejectReason = ref('')
const docPreview = ref(null)
const selectedIds = ref([])
const currentPage = ref(1)
const perPage = 6
const checklists = reactive({})

const checklistItems = [
  { key: 'trade_license', label: 'Trade License valid' },
  { key: 'identity', label: 'Identity verified' },
  { key: 'contact', label: 'Contact info matches' },
  { key: 'no_suspicious', label: 'No suspicious activity' }
]

// Tabs: All first
const tabs = computed(() => [
  { value: 'all', label: 'All', count: adminStore.businesses.length },
  { value: 'pending', label: 'Pending', count: adminStore.pendingBusinesses.length },
  { value: 'approved', label: 'Approved', count: adminStore.approvedBusinesses.length },
  { value: 'rejected', label: 'Rejected', count: adminStore.rejectedBusinesses.length }
])

const displayedBusinesses = computed(() => {
  if (activeTab.value === 'all') return adminStore.businesses
  return adminStore.businesses.filter(b => b.status === activeTab.value)
})

const totalPages = computed(() => Math.ceil(displayedBusinesses.value.length / perPage))
const paginatedBusinesses = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return displayedBusinesses.value.slice(start, start + perPage)
})

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

function openDocPreview(docName, bizName) {
  const mockDocs = {
    'Trade_License.pdf': {
      docTitle: 'Trade License Certificate',
      docSubtitle: 'Ministry of Trade and Regional Integration',
      size: '1.2 MB',
      uploadDate: 'Mar 15, 2026',
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
      size: '856 KB',
      uploadDate: 'Mar 12, 2026',
      validityStatus: 'Registration active – Renewed annually',
      fields: [
        { label: 'Registration No.', value: 'BR-ETH-' + Math.floor(100000 + Math.random() * 900000) },
        { label: 'Business Name', value: bizName },
        { label: 'Business Type', value: 'Private Limited Company (PLC)' },
        { label: 'Capital (ETB)', value: 'ETB ' + (Math.floor(500 + Math.random() * 5000) * 1000).toLocaleString() },
        { label: 'Registration Date', value: 'August 20, 2024' },
        { label: 'Registered Address', value: 'Addis Ababa, Bole Sub-City' }
      ]
    },
    'Tax_Certificate.pdf': {
      docTitle: 'Tax Clearance Certificate',
      docSubtitle: 'Ethiopian Revenue & Customs Authority',
      size: '740 KB',
      uploadDate: 'Mar 10, 2026',
      validityStatus: 'Tax clearance valid for current fiscal year',
      fields: [
        { label: 'TIN', value: Math.floor(1000000000 + Math.random() * 9000000000).toString() },
        { label: 'Business Name', value: bizName },
        { label: 'Tax Category', value: 'Category A – Gross income > ETB 500,000' },
        { label: 'Fiscal Year', value: '2025/2026' },
        { label: 'Status', value: 'Paid in Full' },
        { label: 'Outstanding Balance', value: 'ETB 0.00' }
      ]
    },
    'ID_Document.pdf': {
      docTitle: 'National Identity Document',
      docSubtitle: 'National ID Authority of Ethiopia',
      size: '520 KB',
      uploadDate: 'Mar 14, 2026',
      validityStatus: 'Identity document verified',
      fields: [
        { label: 'ID Number', value: 'ETH-ID-' + Math.floor(10000000 + Math.random() * 90000000) },
        { label: 'Full Name', value: 'Owner of ' + bizName },
        { label: 'Nationality', value: 'Ethiopian' },
        { label: 'Date of Birth', value: 'June 12, 1988' },
        { label: 'Address', value: 'Addis Ababa, Ethiopia' }
      ]
    },
    'Contractor_License.pdf': {
      docTitle: 'Contractor Grade Certificate',
      docSubtitle: 'Ministry of Urban Development & Construction',
      size: '980 KB',
      uploadDate: 'Mar 20, 2026',
      validityStatus: 'Grade 3 Contractor – Active License',
      fields: [
        { label: 'License No.', value: 'CL-' + Math.floor(10000 + Math.random() * 90000) },
        { label: 'Company Name', value: bizName },
        { label: 'Grade', value: 'Grade 3 – Building Construction' },
        { label: 'Issued', value: 'February 1, 2025' },
        { label: 'Valid Until', value: 'January 31, 2028' }
      ]
    }
  }
  
  const defaultDoc = {
    docTitle: 'Official Document',
    docSubtitle: 'Government of Ethiopia',
    size: '1.0 MB',
    uploadDate: 'Mar 2026',
    validityStatus: 'Document pending verification',
    fields: [
      { label: 'Document Name', value: docName },
      { label: 'Business', value: bizName },
      { label: 'Status', value: 'Under Review' }
    ]
  }
  
  const docData = mockDocs[docName] || defaultDoc
  docPreview.value = { name: docName, business: bizName, ...docData }
}

function downloadMockDoc() {
  if (!docPreview.value) return
  let content = `${docPreview.value.docTitle}\n${'='.repeat(50)}\n${docPreview.value.docSubtitle}\n\n`
  docPreview.value.fields.forEach(f => {
    content += `${f.label}: ${f.value}\n`
  })
  content += `\n${docPreview.value.validityStatus}\n`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = docPreview.value.name.replace('.pdf', '.txt')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  adminStore.showToast(`Downloaded ${docPreview.value.name}`)
}

function approveDoc() {
  adminStore.showToast(`Document "${docPreview.value.name}" approved`, 'success')
  docPreview.value = null
}

function flagDoc() {
  adminStore.showToast(`Document "${docPreview.value.name}" flagged for review`, 'warning')
  docPreview.value = null
}

function getChecklist(bizId, key) {
  return checklists[`${bizId}_${key}`] || false
}

function toggleChecklist(bizId, key) {
  checklists[`${bizId}_${key}`] = !checklists[`${bizId}_${key}`]
}
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.1); }
</style>
