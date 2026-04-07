<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Business Management</h1>
        <p class="text-[#475569] font-medium">Approve, suspend, and manage all registered businesses</p>
      </div>
      <button class="btn-gts-primary" @click="showPlansModal = true">
        <span class="material-icons-round">payments</span> Subscription Plans
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Total</div>
        <div class="font-heading text-2xl font-black text-[#1A1225]">{{ businesses.length }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Approved</div>
        <div class="font-heading text-2xl font-black text-[#64D2B1]">{{ approvedCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Pending</div>
        <div class="font-heading text-2xl font-black text-amber-500">{{ pendingCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-[#7C757E] font-medium mb-1">Suspended</div>
        <div class="font-heading text-2xl font-black text-red-500">{{ suspendedCount }}</div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <button v-for="tab in filterTabs" :key="tab.value"
        class="px-5 py-2.5 rounded-full text-[0.813rem] font-bold border-2 transition-all duration-200"
        :class="activeFilter === tab.value
          ? 'bg-[#7630A3] border-[#7630A3] text-white shadow-soft'
          : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]/30'"
        @click="activeFilter = tab.value">
        {{ tab.label }}
      </button>
    </div>

    <!-- Search -->
    <div class="flex items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-[#7C757E]">search</span>
        <input type="text" class="input-gts pl-12" v-model="searchQuery" placeholder="Search businesses..." id="admin-business-search">
      </div>
      <select class="input-gts max-w-[200px]" v-model="filterCategory">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Business Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="biz in paginatedBusinesses" :key="biz.id" class="bg-white rounded-3xl border border-[#EEEAF2] shadow-sm relative overflow-hidden hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
        
        <!-- Subscription Plan Banner (always shown on top) -->
        <div class="px-5 py-2.5 border-b flex items-center justify-between"
          :class="biz.featured
            ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200/30'
            : 'bg-gradient-to-r from-[#F8F6FB] to-[#EEEAF2]/50 border-[#EEEAF2]'">
          <div class="flex items-center gap-2">
            <span class="material-icons-round text-base" :class="biz.featured ? 'text-amber-500' : 'text-[#7630A3]'">{{ biz.featured ? 'star' : 'workspace_premium' }}</span>
            <span class="text-[0.625rem] font-black uppercase tracking-widest" :class="biz.featured ? 'text-amber-600' : 'text-[#7630A3]'">{{ biz.featured ? 'Featured' : 'Standard' }}</span>
          </div>
          <span class="text-[0.625rem] font-black uppercase tracking-wider" :class="biz.featured ? 'text-amber-600' : 'text-[#7C757E]'">{{ getBusinessPlan(biz) }}</span>
        </div>

        <div class="p-6">
          <!-- Status badge -->
          <div class="flex items-center justify-end gap-2 mb-3">
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
          </div>

          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 bg-[#F8F6FB] rounded-2xl flex items-center justify-center border border-[#EEEAF2]">
              <span class="font-black text-[#7630A3] text-xl">{{ biz.name.charAt(0) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-black text-[#1A1225] truncate">{{ biz.name }}</h3>
              <span class="text-xs text-[#7C757E] font-medium">{{ biz.category }} • {{ biz.location }}</span>
            </div>
          </div>

          <p class="text-sm text-[#475569] mb-4 line-clamp-2">{{ biz.description }}</p>

          <div class="grid grid-cols-3 gap-3 mb-4">
            <div class="text-center p-2 bg-[#F8F6FB] rounded-xl">
              <div class="text-sm font-black text-[#1A1225]">{{ biz.totalViews.toLocaleString() }}</div>
              <div class="text-[0.625rem] text-[#7C757E] font-medium">Views</div>
            </div>
            <div class="text-center p-2 bg-[#F8F6FB] rounded-xl">
              <div class="text-sm font-black text-[#1A1225]">{{ biz.totalInquiries }}</div>
              <div class="text-[0.625rem] text-[#7C757E] font-medium">Inquiries</div>
            </div>
            <div class="text-center p-2 bg-[#F8F6FB] rounded-xl">
              <div class="text-sm font-black text-[#1A1225]">{{ biz.productCount }}</div>
              <div class="text-[0.625rem] text-[#7C757E] font-medium">Products</div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-[#EEEAF2]">
            <div class="flex items-center gap-2">
              <span v-if="biz.rating > 0" class="flex items-center gap-1 text-xs font-black text-[#1A1225]">
                <span class="material-icons-round text-amber-400 text-sm">star</span> {{ biz.rating }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <!-- Pending: Approve / Reject -->
              <button v-if="biz.status === 'pending'"
                class="w-8 h-8 rounded-lg bg-[#64D2B1]/10 text-[#64D2B1] flex items-center justify-center hover:bg-[#64D2B1] hover:text-white transition-all"
                @click="adminStore.approveBusiness(biz.id)" title="Approve">
                <span class="material-icons-round text-lg">check</span>
              </button>
              <button v-if="biz.status === 'pending'"
                class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                @click="adminStore.rejectBusiness(biz.id)" title="Reject">
                <span class="material-icons-round text-lg">close</span>
              </button>
              <!-- Approved: Toggle Featured / Suspend -->
              <button v-if="biz.status === 'approved'"
                class="w-8 h-8 rounded-lg transition-all flex items-center justify-center"
                :class="biz.featured ? 'bg-amber-50 text-amber-500 hover:bg-amber-100' : 'bg-[#F8F6FB] text-[#7C757E] hover:text-amber-500'"
                @click="adminStore.toggleFeatured(biz.id)" title="Toggle Featured">
                <span class="material-icons-round text-lg">{{ biz.featured ? 'star' : 'star_border' }}</span>
              </button>
              <button v-if="biz.status === 'approved'"
                class="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all"
                @click="confirmSuspend(biz)" title="Suspend">
                <span class="material-icons-round text-lg">block</span>
              </button>
              <!-- Suspended: Reactivate only -->
              <button v-if="biz.status === 'suspended'"
                class="w-8 h-8 rounded-lg bg-[#64D2B1]/10 text-[#64D2B1] flex items-center justify-center hover:bg-[#64D2B1] hover:text-white transition-all"
                @click="adminStore.unsuspendBusiness(biz.id)" title="Reactivate">
                <span class="material-icons-round text-lg">play_circle</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredBusinesses.length === 0" class="text-center py-16 text-[#7C757E]">
      <span class="material-icons-round text-5xl mb-3 block text-[#EEEAF2]">store</span>
      <p class="text-lg font-medium">No businesses found</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
      <button class="w-10 h-10 rounded-xl border border-[#EEEAF2] flex items-center justify-center text-[#7C757E] hover:border-[#7630A3] hover:text-[#7630A3] transition-all disabled:opacity-30"
        :disabled="currentPage === 1" @click="currentPage--">
        <span class="material-icons-round text-lg">chevron_left</span>
      </button>
      <button v-for="page in totalPages" :key="page"
        class="w-10 h-10 rounded-xl text-sm font-black flex items-center justify-center transition-all"
        :class="currentPage === page ? 'bg-[#7630A3] text-white shadow-soft' : 'border border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]'"
        @click="currentPage = page">
        {{ page }}
      </button>
      <button class="w-10 h-10 rounded-xl border border-[#EEEAF2] flex items-center justify-center text-[#7C757E] hover:border-[#7630A3] hover:text-[#7630A3] transition-all disabled:opacity-30"
        :disabled="currentPage === totalPages" @click="currentPage++">
        <span class="material-icons-round text-lg">chevron_right</span>
      </button>
    </div>

    <!-- Suspend Confirmation Modal -->
    <div v-if="suspendTarget" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="suspendTarget = null">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-sm animate-scale-in shadow-2xl text-center">
        <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="material-icons-round text-3xl text-amber-500">warning</span>
        </div>
        <h3 class="font-heading text-xl font-black text-[#1A1225] mb-2">Suspend Business?</h3>
        <p class="text-sm text-[#475569] mb-6">Are you sure you want to suspend <strong>{{ suspendTarget.name }}</strong>? This will hide their listings.</p>
        <div class="flex gap-3">
          <button class="flex-1 py-3 rounded-xl bg-[#F8F6FB] text-[#475569] font-bold text-sm hover:bg-[#EEEAF2] transition-all" @click="suspendTarget = null">Cancel</button>
          <button class="flex-1 py-3 rounded-xl bg-amber-500 text-white font-bold text-sm hover:brightness-110 transition-all" @click="handleSuspend">Suspend</button>
        </div>
      </div>
    </div>

    <!-- Subscription Plans Modal -->
    <div v-if="showPlansModal" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showPlansModal = false">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-3xl animate-scale-in shadow-2xl max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Subscription Plans</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225] transition-colors" @click="showPlansModal = false">
            <span class="material-icons-round">close</span>
          </button>
        </div>

        <!-- Merchant Plans -->
        <h4 class="text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E] mb-4">Merchant Plans</h4>
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
                <span class="material-icons-round text-[#64D2B1] text-sm">check</span>
                <input type="text" class="flex-1 bg-transparent border-b border-transparent focus:border-[#EEEAF2] outline-none text-xs text-[#475569]"
                  :value="feat" @change="updateFeature(plan.id, fi, $event.target.value)">
              </li>
            </ul>
            <button class="w-full py-2 rounded-lg text-xs font-bold text-[#7630A3] bg-[#7630A3]/5 hover:bg-[#7630A3]/10 transition-all flex items-center justify-center gap-1"
              @click="addFeature(plan.id)">
              <span class="material-icons-round text-sm">add</span> Add Feature
            </button>
          </div>
        </div>

        <!-- Provider Plans -->
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
                <span class="material-icons-round text-[#64D2B1] text-sm">check</span>
                <input type="text" class="flex-1 bg-transparent border-b border-transparent focus:border-[#EEEAF2] outline-none text-xs text-[#475569]"
                  :value="feat" @change="updateFeature(plan.id, fi, $event.target.value)">
              </li>
            </ul>
            <button class="w-full py-2 rounded-lg text-xs font-bold text-[#7630A3] bg-[#7630A3]/5 hover:bg-[#7630A3]/10 transition-all flex items-center justify-center gap-1"
              @click="addFeature(plan.id)">
              <span class="material-icons-round text-sm">add</span> Add Feature
            </button>
          </div>
        </div>

        <!-- Save Plans Button -->
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-[#EEEAF2]">
          <div class="flex items-center gap-2">
            <span v-if="plansSaved" class="flex items-center gap-1.5 text-sm text-[#64D2B1] font-bold animate-fade-in">
              <span class="material-icons-round text-base">check_circle</span>
              Plans saved successfully
            </span>
          </div>
          <button class="flex items-center gap-2 px-8 py-3.5 bg-[#7630A3] text-white font-black text-sm rounded-xl hover:brightness-110 shadow-soft transition-all active:scale-95"
            @click="savePlans">
            <span class="material-icons-round text-lg">save</span>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'
import { categories } from '../../mock/users.js'

const adminStore = useAdminStore()
const searchQuery = ref('')
const filterCategory = ref('')
const activeFilter = ref('all')
const currentPage = ref(1)
const perPage = 9
const suspendTarget = ref(null)
const showPlansModal = ref(false)
const plansSaved = ref(false)

const businesses = computed(() => adminStore.businesses)
const approvedCount = computed(() => adminStore.approvedBusinesses.length)
const pendingCount = computed(() => adminStore.pendingBusinesses.length)
const suspendedCount = computed(() => adminStore.suspendedBusinesses.length)

const merchantPlans = computed(() => adminStore.subscriptionPlans.filter(p => p.role === 'merchant'))
const providerPlans = computed(() => adminStore.subscriptionPlans.filter(p => p.role === 'provider'))

const filterTabs = [
  { value: 'all', label: 'All' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'rejected', label: 'Rejected' }
]

const filteredBusinesses = computed(() => {
  let list = [...businesses.value]
  if (activeFilter.value !== 'all') {
    list = list.filter(b => b.status === activeFilter.value)
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

function getBusinessPlan(biz) {
  if (biz.productCount > 10) return 'Enterprise – ETB 9,999/mo'
  if (biz.productCount > 4) return 'Professional – ETB 3,999/mo'
  return 'Basic – ETB 1,499/mo'
}

function savePlans() {
  localStorage.setItem('gts_plans', JSON.stringify(adminStore.subscriptionPlans))
  adminStore.showToast('All subscription plans saved successfully')
  plansSaved.value = true
  setTimeout(() => { plansSaved.value = false }, 3000)
}
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.1); }
</style>
