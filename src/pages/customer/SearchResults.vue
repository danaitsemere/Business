<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="font-heading text-3xl font-extrabold mb-2">Search Results</h1>
      <p class="text-neutral-500">Find businesses and services near you</p>
    </div>

    <div class="flex items-center gap-4 mb-5 flex-wrap">
      <div class="relative flex-1 min-w-[250px]">
        <Search class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input type="text" v-model="query" placeholder="Search businesses..." class="input-gts pl-12" @keyup.enter="doSearch" id="search-input">
      </div>
      <select class="select-gts max-w-[200px]" v-model="categoryFilter">
        <option value="">All Categories</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <select class="select-gts max-w-[200px]" v-model="locationFilter">
        <option value="">All Locations</option>
        <option value="Addis Ababa">Addis Ababa</option>
        <option value="Hawassa">Hawassa</option>
        <option value="Mekelle">Mekelle</option>
      </select>
    </div>

    <p class="text-sm text-neutral-500 mb-5">{{ results.length }} businesses found</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="biz in results" :key="biz.id"
        class="card-gts cursor-pointer hover:-translate-y-1 hover:shadow-dark-lg hover:border-primary-400 transition-all duration-250"
        @click="$router.push(`/customer/business/${biz.id}`)">
        <div class="flex items-center gap-3.5 mb-3.5">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-400 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
            {{ biz.name.split(' ').map(n => n[0]).join('').slice(0,2) }}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-heading font-bold truncate">{{ biz.name }}</h4>
            <div class="flex items-center gap-2">
              <span class="badge-primary">{{ biz.category }}</span>
              <span v-if="biz.verified" class="text-blue-400"><BadgeCheck class="w-4 h-4" /></span>
            </div>
          </div>
          <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-surface-elevated"
            @click.stop="toggleSave(biz.id)">
            <component :is="customerStore.isBusinessSaved(biz.id) ? BookmarkCheck : Bookmark" class="w-5 h-5" />
          </button>
        </div>
        <p class="text-neutral-500 text-[0.813rem] line-clamp-2 mb-3">{{ biz.description }}</p>
        <div class="flex flex-wrap gap-1.5 mb-4">
          <span v-for="tag in biz.tags" :key="tag" class="chip-gts text-xs py-1 px-2.5">{{ tag }}</span>
        </div>
        <div class="flex gap-4">
          <span class="flex items-center gap-1 text-xs text-neutral-500"><MapPin class="w-4 h-4" />{{ biz.location }}</span>
          <span class="flex items-center gap-1 text-xs text-neutral-500"><Star class="w-4 h-4" />{{ biz.rating }}</span>
          <span class="flex items-center gap-1 text-xs text-neutral-500"><Package class="w-4 h-4" />{{ biz.productCount }}</span>
        </div>
      </div>
    </div>

    <div v-if="!results.length" class="flex flex-col items-center py-16 text-center">
      <SearchX class="w-16 h-16 text-neutral-500/50 mb-4" />
      <h3 class="font-heading font-bold text-[#b8b0c4] mb-2">No businesses found</h3>
      <p class="text-neutral-500">Try adjusting your search or filters</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCustomerStore } from '../../store/customerStore.js'
import { categories } from '../../mock/users.js'
import { Search, BadgeCheck, BookmarkCheck, Bookmark, MapPin, Star, Package, SearchX } from '../../utils/icons.js'

const customerStore = useCustomerStore()
const query = ref(customerStore.searchQuery || '')
const categoryFilter = ref(customerStore.selectedCategory || '')
const locationFilter = ref('')
const results = computed(() => customerStore.searchBusinesses(query.value, categoryFilter.value, locationFilter.value))

function doSearch() {}
function toggleSave(id) { customerStore.isBusinessSaved(id) ? customerStore.unsaveBusiness(id) : customerStore.saveBusiness(id) }

onMounted(() => { if (customerStore.searchQuery) query.value = customerStore.searchQuery; if (customerStore.selectedCategory) categoryFilter.value = customerStore.selectedCategory })
</script>
