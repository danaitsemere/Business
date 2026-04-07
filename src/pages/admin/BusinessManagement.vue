<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Business Management</h1>
        <p class="text-[#475569] font-medium">Approve, reject, and manage all registered businesses</p>
      </div>
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
        <div class="text-sm text-[#7C757E] font-medium mb-1">Rejected</div>
        <div class="font-heading text-2xl font-black text-red-500">{{ rejectedCount }}</div>
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
      <div v-for="biz in filteredBusinesses" :key="biz.id" class="bg-white rounded-3xl p-6 border border-[#EEEAF2] shadow-sm relative overflow-hidden hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
        <!-- Status badge -->
        <div class="absolute top-6 right-6 flex items-center gap-2">
          <span v-if="biz.featured" class="inline-flex items-center px-2.5 py-1 rounded-full text-[0.5rem] font-black uppercase tracking-widest bg-amber-50 text-amber-600">
            <span class="material-icons-round text-xs mr-1">star</span> Featured
          </span>
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
            <button v-if="biz.status === 'approved'"
              class="w-8 h-8 rounded-lg transition-all flex items-center justify-center"
              :class="biz.featured ? 'bg-amber-50 text-amber-500 hover:bg-amber-100' : 'bg-[#F8F6FB] text-[#7C757E] hover:text-amber-500'"
              @click="adminStore.toggleFeatured(biz.id)" title="Toggle Featured">
              <span class="material-icons-round text-lg">{{ biz.featured ? 'star' : 'star_border' }}</span>
            </button>
            <button class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              @click="adminStore.deleteBusiness(biz.id)" title="Delete">
              <span class="material-icons-round text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredBusinesses.length === 0" class="text-center py-16 text-[#7C757E]">
      <span class="material-icons-round text-5xl mb-3 block text-[#EEEAF2]">store</span>
      <p class="text-lg font-medium">No businesses found</p>
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

const businesses = computed(() => adminStore.businesses)
const approvedCount = computed(() => adminStore.approvedBusinesses.length)
const pendingCount = computed(() => adminStore.pendingBusinesses.length)
const rejectedCount = computed(() => adminStore.rejectedBusinesses.length)

const filterTabs = [
  { value: 'all', label: 'All' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
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
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.1); }
</style>
