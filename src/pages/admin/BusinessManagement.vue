<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Business Management</h1>
        <p class="text-[#475569] font-medium">Approve, suspend, and manage all registered businesses</p>
      </div>
      <button class="btn-gts-primary" @click="showPlansModal = true">
        <Wallet class="w-5 h-5" /> Subscription Plans
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
      <div class="stat-card-gts cursor-pointer transition-all hover:shadow-md" :class="statusFilter === '' ? 'ring-2 ring-[#7630A3]' : ''" @click="statusFilter = ''">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Total</div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ businesses.length }}</div>
      </div>
      <div class="stat-card-gts cursor-pointer transition-all hover:shadow-md" :class="statusFilter === 'approved' ? 'ring-2 ring-[#64D2B1]' : ''" @click="statusFilter = 'approved'">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Approved</div>
        <div class="font-heading text-2xl font-black text-[#64D2B1]">{{ approvedCount }}</div>
      </div>
      <div class="stat-card-gts cursor-pointer transition-all hover:shadow-md" :class="statusFilter === 'pending' ? 'ring-2 ring-amber-500' : ''" @click="statusFilter = 'pending'">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Pending</div>
        <div class="font-heading text-2xl font-black text-amber-500">{{ pendingCount }}</div>
      </div>
      <div class="stat-card-gts cursor-pointer transition-all hover:shadow-md" :class="statusFilter === 'suspended' ? 'ring-2 ring-red-500' : ''" @click="statusFilter = 'suspended'">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Suspended</div>
        <div class="font-heading text-2xl font-black text-red-500">{{ suspendedCount }}</div>
      </div>
      <div class="stat-card-gts cursor-pointer transition-all hover:shadow-md" :class="statusFilter === 'rejected' ? 'ring-2 ring-red-400' : ''" @click="statusFilter = 'rejected'">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Rejected</div>
        <div class="font-heading text-2xl font-black text-red-400">{{ rejectedCount }}</div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <Search class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7C757E]" />
        <input type="text" class="input-gts pl-12" v-model="searchQuery" placeholder="Search businesses..." id="admin-business-search">
      </div>
      <select class="input-gts max-w-[200px]" v-model="filterCategory">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select class="input-gts max-w-[200px]" v-model="businessTypeFilter" id="admin-business-type-filter">
        <option value="">All Types</option>
        <option value="merchant">Business</option>
        <option value="service_provider">Service Provider</option>
      </select>
    </div>

    <div class="bg-white rounded-3xl border border-[#EEEAF2] shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[#EEEAF2]">
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Organization</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Type</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Category</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Location</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Status</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Rating</th>
              <th class="text-right px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="biz in paginatedBusinesses" :key="biz.id" class="border-b border-[#EEEAF2] last:border-0 hover:bg-[#F8F6FB] transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-[#F8F6FB] rounded-xl flex items-center justify-center border border-[#EEEAF2]">
                    <span class="font-black text-[#7630A3] text-sm">{{ biz.name.charAt(0) }}</span>
                  </div>
                  <div class="min-w-0">
                    <span class="block text-sm font-bold text-[#1A1225] truncate max-w-[180px]">{{ biz.name }}</span>
                    <span class="block text-xs text-[#7C757E]">{{ biz.email }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-[#475569] font-medium">
                  {{ biz.businessType === 'service_provider' ? 'Service Provider' : 'Business' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-[#475569]">{{ biz.category }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-[#7C757E]">{{ biz.location }}</td>
              <td class="px-6 py-4">
                <span :class="{
                  'bg-[#64D2B1]/10 text-[#64D2B1]': biz.status === 'approved',
                  'bg-amber-50 text-amber-600': biz.status === 'pending',
                  'bg-red-50 text-red-500': biz.status === 'rejected' || biz.status === 'suspended'
                }" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.5rem] font-black uppercase tracking-widest">
                  <span class="w-1.5 h-1.5 rounded-full" :class="{
                    'bg-[#64D2B1]': biz.status === 'approved',
                    'bg-amber-500': biz.status === 'pending',
                    'bg-red-500': biz.status === 'rejected' || biz.status === 'suspended'
                  }"></span>
                  {{ biz.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span v-if="biz.rating > 0" class="flex items-center gap-1 text-xs font-black text-[#1A1225]">
                  <Star class="w-4 h-4 text-amber-400 fill-amber-400" /> {{ biz.rating }}
                </span>
                <span v-else class="text-xs text-[#7C757E]">—</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button v-if="biz.status === 'suspended'"
                    class="btn-gts-secondary !w-11 !h-11 !px-0 bg-[#64D2B1]/10 text-[#64D2B1] border-none hover:bg-[#64D2B1] hover:text-white"
                    @click="adminStore.unsuspendBusiness(biz.id)" title="Activate">
                    <CheckCircle2 class="w-5 h-5" />
                  </button>
                  <button v-else
                    class="btn-gts-secondary !w-11 !h-11 !px-0 bg-amber-50 text-amber-500 border-none hover:bg-amber-500 hover:text-white"
                    @click="confirmSuspend(biz)" title="Suspend">
                    <Ban class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredBusinesses.length === 0">
              <td colspan="7" class="text-center py-16 text-[#7C757E]">
                <Store class="w-12 h-12 mx-auto mb-3 text-[#EEEAF2]" />
                <p class="text-lg font-medium">No businesses found</p>
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
        :class="currentPage === page ? 'bg-[#7630A3] text-white shadow-soft font-black' : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]'"
        @click="currentPage = page">
        {{ page }}
      </button>
      <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm"
        :disabled="currentPage === totalPages" @click="currentPage++">
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>

    <div v-if="suspendTarget" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="suspendTarget = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-sm animate-scale-in shadow-2xl text-center">
        <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle class="w-8 h-8 text-amber-500" />
        </div>
        <h3 class="font-heading text-xl font-black text-[#1A1225] mb-2">Suspend Business?</h3>
        <p class="text-sm text-[#475569] mb-6">Are you sure you want to suspend <strong>{{ suspendTarget.name }}</strong>? This will hide their listings.</p>
        <div class="flex gap-3">
          <button class="flex-1 btn-gts-secondary" @click="suspendTarget = null">Cancel</button>
          <button class="flex-1 btn-gts-primary !bg-amber-500" @click="handleSuspend">Suspend</button>
        </div>
      </div>
    </div>

    <div v-if="showPlansModal" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showPlansModal = false">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-3xl animate-scale-in shadow-2xl max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Subscription Plans</h3>
          <button class="btn-gts-secondary !w-11 !h-11 !px-0 !border-none" @click="showPlansModal = false">
            <X class="w-5 h-5" />
          </button>
        </div>

        <h4 class="text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E] mb-4">Business Plans</h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div v-for="plan in merchantPlans" :key="plan.id" class="border border-[#EEEAF2] rounded-2xl p-5 hover:border-[#7630A3]/30 transition-all">
            <div class="mb-3">
              <input type="text" class="font-heading text-lg font-black text-[#1A1225] bg-transparent border-b-2 border-transparent focus:border-[#7630A3] outline-none w-full transition-colors"
                :value="plan.name" @change="updatePlanName(plan.id, $event.target.value)" title="Click to edit name">
            </div>
            <div class="flex items-end gap-1 mb-4">
              <span class="text-[0.688rem] text-[#7C757E] font-bold">ETB</span>
              <input type="number" step="0.01" min="0" class="font-heading text-2xl font-black text-[#7630A3] w-24 bg-transparent border-b-2 border-[#EEEAF2] focus:border-[#7630A3] outline-none transition-colors text-center"
                :value="plan.price" @change="updatePrice(plan.id, $event.target.value)">
              <span class="text-xs text-[#7C757E] font-medium">/mo</span>
            </div>
            <ul class="space-y-1.5 mb-4">
              <li v-for="(feat, fi) in plan.features" :key="fi" class="flex items-center gap-2 text-xs text-[#475569]">
                <Check class="w-4 h-4 text-[#64D2B1] shrink-0" />
                <input type="text" class="flex-1 bg-transparent border-b border-transparent focus:border-[#EEEAF2] outline-none text-xs text-[#475569]"
                  :value="feat" @change="updateFeature(plan.id, fi, $event.target.value)">
              </li>
            </ul>
            <button class="btn-gts-secondary w-full"
              @click="addFeature(plan.id)">
              <Plus class="w-4 h-4" /> Add Feature
            </button>
          </div>
        </div>

        <h4 class="text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E] mb-4">Service Provider Plans</h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div v-for="plan in providerPlans" :key="plan.id" class="border border-[#EEEAF2] rounded-2xl p-5 hover:border-[#7630A3]/30 transition-all">
            <div class="mb-3">
              <input type="text" class="font-heading text-lg font-black text-[#1A1225] bg-transparent border-b-2 border-transparent focus:border-[#7630A3] outline-none w-full transition-colors"
                :value="plan.name" @change="updatePlanName(plan.id, $event.target.value)" title="Click to edit name">
            </div>
            <div class="flex items-end gap-1 mb-4">
              <span class="text-[0.688rem] text-[#7C757E] font-bold">ETB</span>
              <input type="number" step="0.01" min="0" class="font-heading text-2xl font-black text-[#7630A3] w-24 bg-transparent border-b-2 border-[#EEEAF2] focus:border-[#7630A3] outline-none transition-colors text-center"
                :value="plan.price" @change="updatePrice(plan.id, $event.target.value)">
              <span class="text-xs text-[#7C757E] font-medium">/mo</span>
            </div>
            <ul class="space-y-1.5 mb-4">
              <li v-for="(feat, fi) in plan.features" :key="fi" class="flex items-center gap-2 text-xs text-[#475569]">
                <Check class="w-4 h-4 text-[#64D2B1] shrink-0" />
                <input type="text" class="flex-1 bg-transparent border-b border-transparent focus:border-[#EEEAF2] outline-none text-xs text-[#475569]"
                  :value="feat" @change="updateFeature(plan.id, fi, $event.target.value)">
              </li>
            </ul>
            <button class="btn-gts-secondary w-full"
              @click="addFeature(plan.id)">
              <Plus class="w-4 h-4" /> Add Feature
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between mt-8 pt-6 border-t border-[#EEEAF2]">
          <div class="flex items-center gap-2">
            <span v-if="plansSaved" class="flex items-center gap-1.5 text-sm text-[#64D2B1] font-bold animate-fade-in">
              <CheckCircle2 class="w-4 h-4" />
              Plans saved successfully
            </span>
          </div>
          <button class="btn-gts-primary"
            @click="savePlans">
            <Save class="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'
import { categories } from '../../mock/users.js'
import {
  Wallet, Search, Star, Ban, CheckCircle2,
  ChevronLeft, ChevronRight, AlertTriangle, Store, Plus, Save, Check, X
} from 'lucide-vue-next'

const adminStore = useAdminStore()
const searchQuery = ref('')
const filterCategory = ref('')
const statusFilter = ref('')
const businessTypeFilter = ref('')
const currentPage = ref(1)
const perPage = 6
const suspendTarget = ref(null)
const showPlansModal = ref(false)
const plansSaved = ref(false)

const businesses = computed(() => adminStore.businesses)
const approvedCount = computed(() => adminStore.approvedBusinesses.length)
const pendingCount = computed(() => adminStore.pendingBusinesses.length)
const suspendedCount = computed(() => adminStore.suspendedBusinesses.length)
const rejectedCount = computed(() => adminStore.rejectedBusinesses.length)

const merchantPlans = computed(() => adminStore.subscriptionPlans.filter(p => p.role === 'merchant'))
const providerPlans = computed(() => adminStore.subscriptionPlans.filter(p => p.role === 'provider'))

const filteredBusinesses = computed(() => {
  let list = [...businesses.value]
  if (statusFilter.value) {
    list = list.filter(b => b.status === statusFilter.value)
  }
  if (businessTypeFilter.value) {
    list = list.filter(b => b.businessType === businessTypeFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(b => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
  }
  if (filterCategory.value) {
    list = list.filter(b => b.category === filterCategory.value)
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredBusinesses.value.length / perPage))
const paginatedBusinesses = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredBusinesses.value.slice(start, start + perPage)
})

watch([statusFilter, businessTypeFilter, searchQuery, filterCategory], () => { currentPage.value = 1 })

function confirmSuspend(biz) { suspendTarget.value = biz }
function handleSuspend() {
  if (suspendTarget.value) {
    adminStore.suspendBusiness(suspendTarget.value.id)
    suspendTarget.value = null
  }
}

function updatePrice(planId, value) {
  const price = parseFloat(value)
  if (!isNaN(price) && price >= 0) {
    adminStore.updatePlanPrice(planId, price)
  }
}

function updatePlanName(planId, value) {
  const plan = adminStore.subscriptionPlans.find(p => p.id === planId)
  if (plan && value.trim()) {
    plan.name = value.trim()
    localStorage.setItem('gts_plans', JSON.stringify(adminStore.subscriptionPlans))
    adminStore.showToast(`Plan name updated to "${value.trim()}"`)
  }
}

function updateFeature(planId, featureIndex, value) {
  const plan = adminStore.subscriptionPlans.find(p => p.id === planId)
  if (plan && value.trim()) {
    plan.features[featureIndex] = value.trim()
    localStorage.setItem('gts_plans', JSON.stringify(adminStore.subscriptionPlans))
  }
}

function addFeature(planId) {
  const plan = adminStore.subscriptionPlans.find(p => p.id === planId)
  if (plan) {
    plan.features.push('New feature')
    localStorage.setItem('gts_plans', JSON.stringify(adminStore.subscriptionPlans))
  }
}

function savePlans() {
  localStorage.setItem('gts_plans', JSON.stringify(adminStore.subscriptionPlans))
  adminStore.showToast('All subscription plans saved successfully')
  plansSaved.value = true
  setTimeout(() => { plansSaved.value = false }, 3000)
}
</script>
