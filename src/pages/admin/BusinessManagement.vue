<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-extrabold mb-2">Business Management</h1>
        <p class="text-neutral-500">Oversee all registered businesses on the platform</p>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      <div class="stat-card-gts">
        <div class="text-sm text-neutral-500 mb-1">Total Businesses</div>
        <div class="font-heading text-2xl font-extrabold text-white">{{ businesses.length }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-neutral-500 mb-1">Verified</div>
        <div class="font-heading text-2xl font-extrabold text-green-400">{{ verifiedCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-neutral-500 mb-1">Featured</div>
        <div class="font-heading text-2xl font-extrabold text-amber-400">{{ featuredCount }}</div>
      </div>
      <div class="stat-card-gts">
        <div class="text-sm text-neutral-500 mb-1">Total Products</div>
        <div class="font-heading text-2xl font-extrabold text-blue-400">{{ totalProducts }}</div>
      </div>
    </div>

    <!-- Search -->
    <div class="flex items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <span class="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">search</span>
        <input type="text" class="input-gts pl-10" v-model="searchQuery" placeholder="Search businesses..." id="admin-business-search">
      </div>
      <select class="select-gts max-w-[200px]" v-model="filterCategory">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Business Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="biz in filteredBusinesses" :key="biz.id" class="card-gts relative overflow-hidden">
        <!-- Featured badge -->
        <div v-if="biz.featured" class="absolute top-4 right-4">
          <span class="badge-warning">⭐ Featured</span>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-primary-400/10 rounded-xl flex items-center justify-center">
            <span class="material-icons-round text-2xl text-primary-300">store</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold text-white truncate">{{ biz.name }}</h3>
            <span class="text-xs text-neutral-500">{{ biz.category }} • {{ biz.location }}</span>
          </div>
        </div>

        <p class="text-sm text-[#b8b0c4] mb-4 line-clamp-2">{{ biz.description }}</p>

        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="text-center p-2 bg-surface-secondary rounded-lg">
            <div class="text-sm font-bold text-white">{{ biz.totalViews.toLocaleString() }}</div>
            <div class="text-[0.688rem] text-neutral-500">Views</div>
          </div>
          <div class="text-center p-2 bg-surface-secondary rounded-lg">
            <div class="text-sm font-bold text-white">{{ biz.totalInquiries }}</div>
            <div class="text-[0.688rem] text-neutral-500">Inquiries</div>
          </div>
          <div class="text-center p-2 bg-surface-secondary rounded-lg">
            <div class="text-sm font-bold text-white">{{ biz.productCount }}</div>
            <div class="text-[0.688rem] text-neutral-500">Products</div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div class="flex items-center gap-2">
            <span v-if="biz.verified" class="badge-success">Verified</span>
            <span v-else class="badge-warning">Unverified</span>
            <span class="flex items-center gap-1 text-xs text-amber-400">
              <span class="material-icons-round text-sm">star</span> {{ biz.rating }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button v-if="!biz.verified"
              class="btn-gts-icon bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
              @click="adminStore.verifyBusiness(biz.id)" title="Verify">
              <span class="material-icons-round text-lg">verified</span>
            </button>
            <button class="btn-gts-icon transition-colors"
              :class="biz.featured ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-surface-elevated text-neutral-500 hover:text-amber-400'"
              @click="adminStore.toggleFeatured(biz.id)" title="Toggle Featured">
              <span class="material-icons-round text-lg">{{ biz.featured ? 'star' : 'star_border' }}</span>
            </button>
            <button class="btn-gts-icon bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              @click="adminStore.deleteBusiness(biz.id)" title="Delete">
              <span class="material-icons-round text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredBusinesses.length === 0" class="text-center py-16 text-neutral-500">
      <span class="material-icons-round text-5xl mb-3 block">store</span>
      <p class="text-lg">No businesses found</p>
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

const businesses = computed(() => adminStore.businesses)
const verifiedCount = computed(() => businesses.value.filter(b => b.verified).length)
const featuredCount = computed(() => businesses.value.filter(b => b.featured).length)
const totalProducts = computed(() => businesses.value.reduce((s, b) => s + b.productCount, 0))

const filteredBusinesses = computed(() => {
  let list = [...businesses.value]
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
