<template>
  <div class="animate-fade-in space-y-10 pb-20 text-left">
    <section class="text-center pt-8 pb-4 relative">
      <h1 class="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-[#1A1225] mb-4 sm:mb-6 tracking-tight">
        Quality <span class="text-primary-500">Products</span> &amp; Trusted <span class="text-primary-500">Services</span>
      </h1>
      <p class="text-secondary-500 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed font-medium">
        Discover products and services near you. Connect with businesses via chat and get things done.
      </p>

      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col lg:flex-row items-stretch gap-0 bg-white p-2 rounded-2xl shadow-[0_4px_20px_-4px_rgba(118,48,163,0.08)] border border-[#EEEAF2]">
          <div class="flex-1 relative flex items-center">
            <Search class="w-5 h-5 absolute left-4 text-slate-400" />
            <input type="text" v-model="searchQuery"
              :placeholder="activeCategory === 'products' ? 'Search products or businesses...' : 'Search services or providers...'"
              class="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 focus:outline-none text-[#2D2438] font-medium"
              id="global-search-input">
          </div>
          <template v-if="activeCategory === 'products'">
            <div class="h-8 w-[1px] bg-[#EEEAF2] hidden lg:block self-center"></div>
            <select v-model="searchFilter" class="py-3 px-4 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-500 font-bold text-sm cursor-pointer min-w-[130px]">
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
            </select>
          </template>
          <div class="h-8 w-[1px] bg-[#EEEAF2] hidden lg:block self-center"></div>
          <div class="relative flex items-center min-w-[150px]">
            <MapPin class="w-4 h-4 absolute left-3 text-primary-500" />
            <select v-model="selectedLocation" class="w-full pl-9 pr-4 py-3 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-500 font-bold text-sm cursor-pointer">
              <option value="">All Locations</option>
              <option value="nearby">Near Me</option>
              <option value="Addis Ababa">Addis Ababa</option>
              <option value="Bahir Dar">Bahir Dar</option>
              <option value="Hawassa">Hawassa</option>
              <option value="Mekelle">Mekelle</option>
            </select>
          </div>
          <template v-if="activeCategory === 'products'">
            <div class="h-8 w-[1px] bg-[#EEEAF2] hidden lg:block self-center"></div>
            <select v-model="activeProductFilter" class="py-3 px-4 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-500 font-bold text-sm cursor-pointer min-w-[130px]">
              <option value="all">All Products</option>
              <option value="featured">Featured</option>
              <option value="top-selling">Top Selling</option>
              <option value="on-sale">On Sale</option>
            </select>
            <div class="h-8 w-[1px] bg-[#EEEAF2] hidden lg:block self-center"></div>
            <select v-model="sortBy" class="py-3 px-4 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-500 font-bold text-sm cursor-pointer min-w-[110px]">
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </template>
        </div>
      </div>
    </section>

    <section v-if="locationSuccess" class="max-w-6xl mx-auto px-4 animate-in slide-in-from-top-4 duration-500">
       <div class="bg-tertiary-300/10 border border-tertiary-300/30 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-3">
             <div class="w-8 h-8 rounded-full bg-tertiary-300 flex items-center justify-center">
                <Check class="w-4 h-4 text-[#1A1225]" />
             </div>
             <p class="text-xs font-black text-[#1A1225] uppercase tracking-widest">Location enabled! Personalized results active.</p>
          </div>
          <button @click="locationSuccess = false" class="btn-gts-secondary !w-11 !h-11 !px-0 !bg-transparent !border-none">
             <X class="w-4 h-4" />
          </button>
       </div>
    </section>

    <section v-if="showLocationBanner && !locationSuccess" class="max-w-6xl mx-auto px-4">
      <div class="flex items-center gap-4 p-4 bg-primary-500/5 border border-primary-500/20 rounded-2xl">
        <div class="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
          <Navigation class="w-5 h-5 text-primary-500" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-[#1A1225]">Enable location for better results</p>
          <p class="text-xs text-slate-400 font-medium">Find businesses and service providers near you</p>
        </div>
        <button @click="requestLocation" class="btn-gts-primary shrink-0">
          Enable
        </button>
        <button @click="dismissLocationBanner" class="btn-gts-secondary !w-11 !h-11 !px-0">
          <X class="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-center gap-3">
        <button
          class="btn-gts !rounded-full !px-10"
          :class="activeCategory === 'products' ? 'bg-primary-500 text-white shadow-soft' : 'bg-white border-[#EEEAF2] text-[#1A1225]'"
          @click="switchCategory('products')">
          Products
        </button>
        <button
          class="btn-gts !rounded-full !px-10"
          :class="activeCategory === 'services' ? 'bg-primary-500 text-white shadow-soft' : 'bg-white border-[#EEEAF2] text-[#1A1225]'"
          @click="switchCategory('services')">
          Services
        </button>
      </div>
    </section>

    <div v-if="activeCategory === 'products'" class="space-y-8">
      <section class="max-w-7xl mx-auto px-4">
        <div v-if="paginatedProducts.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="product in paginatedProducts" :key="product.id"
            class="group bg-white rounded-2xl p-3 border border-[#EEEAF2] hover:border-primary-500/20 hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden cursor-pointer"
            @click="$router.push(`/customer/product/${product.id}`)">
            <div class="w-full aspect-square bg-[#F5F3F7] rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
              <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-contain p-2 mix-blend-multiply transition-transform group-hover:scale-110" />
              <Package v-else class="w-8 h-8 text-[#EEEAF2]" />
              <div class="absolute top-2 left-2">
                <span v-if="product.onSale" class="bg-red-500 text-white text-[0.5rem] font-black px-1.5 py-0.5 rounded tracking-tighter uppercase shadow-sm">Special Offer</span>
              </div>
              <button 
                @click.stop="customerStore.addToRequestList(product.id)"
                class="absolute top-3 right-3 btn-gts-secondary !w-11 !h-11 !px-0 bg-white/90 backdrop-blur-sm shadow-sm"
                :class="isInRequestList(product.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'text-slate-400 hover:text-emerald-500 hover:scale-110'"
                :title="isInRequestList(product.id) ? 'In Request Cart' : 'Add to Request Cart'"
              >
                <ClipboardList class="w-4 h-4" :class="isInRequestList(product.id) ? 'fill-current' : ''" />
              </button>
            </div>
            <span class="text-[0.5rem] font-black text-primary-500 uppercase tracking-[0.2em] mb-1 leading-none">{{ product.businessName }}</span>
            <h3 class="font-heading font-black text-[0.75rem] text-[#1A1225] mb-1 leading-tight group-hover:text-primary-500 transition-colors truncate uppercase">{{ product.name }}</h3>
            <div class="flex items-center gap-0.5 mb-2">
              <Star v-for="n in 5" :key="n" class="w-3 h-3" :class="n <= Math.round(product.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-slate-100'" />
              <span class="text-[0.5rem] font-black text-slate-400 ml-1">{{ product.rating || '4.0' }}</span>
              <span class="text-[0.45rem] text-slate-300 font-bold ml-0.5">({{ product.reviewCount || 0 }})</span>
            </div>
            <div class="mt-auto flex items-end justify-between pt-2 border-t border-[#F5F3F7]">
              <div>
                <span v-if="product.salePrice" class="block text-[0.45rem] text-slate-400 line-through font-bold mb-0.5">ETB {{ product.price.toLocaleString() }}</span>
                <span class="text-[0.938rem] font-black text-[#1A1225] tracking-tight">
                  <span class="text-primary-500 text-[0.625rem] font-bold">ETB</span> {{ (product.salePrice || product.price).toLocaleString() }}
                </span>
              </div>
              <button @click.stop="openProductChat(product)" class="btn-gts-secondary !w-11 !h-11 !px-0 !bg-transparent !border-none">
                <MessageSquare class="w-4 h-4 text-slate-300 hover:text-primary-500" />
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-[#EEEAF2]">
          <PackageOpen class="w-16 h-16 text-[#EEEAF2] mx-auto mb-6 animate-pulse" />
          <h3 class="font-heading text-2xl font-black text-[#1A1225] mb-2 uppercase tracking-tight">No products found</h3>
          <p class="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">Try adjusting your filters, location, or search terms</p>
          <button @click="resetFilters" class="btn-gts-primary">Reset All Filters</button>
        </div>

        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
          <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
            class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm border border-[#EEEAF2]">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button v-for="page in totalPages" :key="page" @click="currentPage = page"
            class="btn-gts !w-11 !h-11 !px-0 rounded-xl"
            :class="currentPage === page ? 'bg-primary-500 text-white shadow-soft' : 'bg-white border-[#EEEAF2] text-slate-500'">
            {{ page }}
          </button>
          <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages"
            class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm border border-[#EEEAF2]">
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>

    <div v-if="activeCategory === 'services'" class="space-y-8 text-left">
      <section v-if="!selectedServiceType" class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-10">
          <h2 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Professional Services</h2>
          <p class="text-slate-400 font-bold text-sm uppercase tracking-widest">Find high-quality help for any task</p>
        </div>
        
        <div v-if="paginatedServiceTypes.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div v-for="s in paginatedServiceTypes" :key="s.name"
            class="group bg-white rounded-xl p-4 border border-[#EEEAF2] hover:border-primary-500/30 hover:shadow-[0_4px_20px_-4px_rgba(118,48,163,0.08)] transition-all cursor-pointer text-center"
            @click="selectedServiceType = s.name">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110" :style="{ background: s.bg }">
              <component :is="getLucideIcon(s.icon)" class="w-4 h-4" :style="{ color: s.color }" />
            </div>
            <h4 class="font-heading text-xs font-black text-[#1A1225] group-hover:text-primary-500 transition-colors uppercase tracking-tight leading-tight">{{ s.name }}</h4>
            <p class="text-[0.563rem] text-slate-400 font-bold uppercase tracking-widest mt-1.5 leading-tight">{{ s.desc }}</p>
            <div class="mt-3 opacity-0 group-hover:opacity-100 transition-all">
               <ArrowRight class="w-3.5 h-3.5 mx-auto text-primary-500" />
            </div>
          </div>
        </div>
        <div v-else class="text-center py-20 text-slate-400 uppercase tracking-widest font-black text-xs">
          No matching services found
        </div>

        <div v-if="totalServiceTypePages > 1" class="flex items-center justify-center gap-2 mt-10">
          <button @click="currentServiceTypePage = Math.max(1, currentServiceTypePage - 1)" :disabled="currentServiceTypePage === 1"
            class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm border border-[#EEEAF2]">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button v-for="page in totalServiceTypePages" :key="page" @click="currentServiceTypePage = page"
            class="btn-gts !w-11 !h-11 !px-0 rounded-xl"
            :class="currentServiceTypePage === page ? 'bg-primary-500 text-white shadow-soft' : 'bg-white border-[#EEEAF2] text-slate-500'">
            {{ page }}
          </button>
          <button @click="currentServiceTypePage = Math.min(totalServiceTypePages, currentServiceTypePage + 1)" :disabled="currentServiceTypePage === totalServiceTypePages"
            class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm border border-[#EEEAF2]">
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </section>

      <section v-else class="max-w-5xl mx-auto px-4 space-y-8">
        <div class="flex items-center justify-between">
            <button @click="selectedServiceType = null" class="btn-gts-secondary !rounded-full !px-6">
              <ArrowLeft class="w-4 h-4" /> Back to Categories
            </button>
            <span v-if="searchQuery" class="text-[0.625rem] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Filtering: "{{ searchQuery }}"</span>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" :style="{ background: currentServiceBg }">
            <component :is="getLucideIcon(currentServiceIcon)" class="w-6 h-6" :style="{ color: currentServiceColor }" />
          </div>
          <div>
            <h3 class="font-heading text-2xl font-black text-[#1A1225] uppercase tracking-tight">{{ selectedServiceType }}</h3>
            <p class="text-slate-400 font-bold text-[0.625rem] uppercase tracking-widest mt-1">Available Professional Partners</p>
          </div>
        </div>
        
        <div v-if="paginatedProviders.length" class="space-y-4">
          <div v-for="provider in paginatedProviders" :key="provider.name"
            class="bg-white rounded-[2rem] p-6 border border-[#EEEAF2] hover:border-primary-500/20 hover:shadow-lg transition-all flex flex-col md:flex-row items-center gap-6">
            <div class="w-16 h-16 bg-[#F5F3F7] rounded-2xl flex items-center justify-center font-black text-[#1A1225] text-xl shrink-0 uppercase">
              {{ provider.name.charAt(0) }}
            </div>
            <div class="flex-1 text-center md:text-left min-w-0">
              <div class="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h4 class="font-heading text-base font-black text-[#1A1225] uppercase tracking-tight">{{ provider.name }}</h4>
                <BadgeCheck class="w-4 h-4 text-tertiary-300" />
              </div>
              <p class="text-slate-500 text-xs font-medium mb-3 leading-relaxed">{{ provider.desc }}</p>
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-5 text-[0.625rem] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span class="flex items-center gap-1.5"><Clock class="w-4 h-4 text-primary-500" /> {{ provider.responseTime }} Response</span>
                <span class="flex items-center gap-1.5"><MapPin class="w-4 h-4 text-primary-500" /> {{ provider.location || 'Mekelle' }}</span>
              </div>
            </div>
            <button @click="openServiceChat(provider)" class="btn-gts-primary shrink-0 group">
              Chat &amp; Request
              <ArrowRight class="w-4 h-4 inline-block ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div v-else class="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <Search class="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h3 class="font-heading text-lg font-black text-[#1A1225] mb-2">No providers match your search</h3>
          <p class="text-slate-400 text-[0.625rem] font-black uppercase tracking-widest">Try adjusting your filters, location, or search terms</p>
        </div>

        <div v-if="totalProviderPages > 1" class="flex items-center justify-center gap-2 mt-10">
          <button @click="currentProviderPage = Math.max(1, currentProviderPage - 1)" :disabled="currentProviderPage === 1"
            class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm border border-[#EEEAF2]">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button v-for="page in totalProviderPages" :key="page" @click="currentProviderPage = page"
            class="btn-gts !w-11 !h-11 !px-0 rounded-xl"
            :class="currentProviderPage === page ? 'bg-primary-500 text-white shadow-soft' : 'bg-white border-[#EEEAF2] text-slate-500'">
            {{ page }}
          </button>
          <button @click="currentProviderPage = Math.min(totalProviderPages, currentProviderPage + 1)" :disabled="currentProviderPage === totalProviderPages"
            class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm border border-[#EEEAF2]">
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '../../store/customerStore.js'
import { getLucideIcon } from '../../utils/icons.js'
import {
  Search, Package, Star, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight,
  BadgeCheck, Clock, X, MessageSquare, Check, PackageOpen,
  MapPin, Navigation, ClipboardList
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const customerStore = useCustomerStore()

const isInRequestList = (id) => customerStore.requestList.some(item => item.id === id)
const activeCategory = ref('products')
const activeProductFilter = ref('all')
const searchQuery = ref('')
const searchFilter = ref('all')
const sortBy = ref('newest')
const selectedLocation = ref('')
const selectedServiceType = ref(null)
const showLocationBanner = ref(false)
const locationSuccess = ref(false)

const currentPage = ref(1)
const perPage = 12
const currentProviderPage = ref(1)
const providersPerPage = 12
const currentServiceTypePage = ref(1)
const serviceTypesPerPage = 12

onMounted(() => {
  const locationEnabled = localStorage.getItem('gts_location_enabled')
  const locationDismissed = localStorage.getItem('gts_location_dismissed')
  const savedLoc = localStorage.getItem('gts_selected_location')
  
  if (savedLoc) selectedLocation.value = savedLoc
  
  if (!locationEnabled && !locationDismissed) {
    showLocationBanner.value = true
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          localStorage.setItem('gts_location_enabled', 'true')
          localStorage.setItem('gts_user_lat', pos.coords.latitude.toString())
          localStorage.setItem('gts_user_lng', pos.coords.longitude.toString())
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          let detectedCity = 'Addis Ababa'
          if (lat >= 13.0 && lat <= 14.0 && lng >= 39.0 && lng <= 40.0) detectedCity = 'Mekelle'
          else if (lat >= 11.0 && lat <= 12.5 && lng >= 37.0 && lng <= 38.0) detectedCity = 'Bahir Dar'
          else if (lat >= 6.5 && lat <= 7.5 && lng >= 38.0 && lng <= 39.0) detectedCity = 'Hawassa'
          localStorage.setItem('gts_user_city', detectedCity)
        },
        () => {} 
      )
    }
  }
  
  if (route.query.tab === 'services') activeCategory.value = 'services'
})

watch(() => route.query.tab, (newTab) => {
  if (newTab === 'services') activeCategory.value = 'services'
  else activeCategory.value = 'products'
  searchQuery.value = '' 
})

function switchCategory(cat) {
  activeCategory.value = cat
  selectedServiceType.value = null
  currentServiceTypePage.value = 1
  if (cat === 'services') {
    router.replace({ path: '/customer/home', query: { tab: 'services' } })
  } else {
    router.replace({ path: '/customer/home', query: {} })
  }
}

function requestLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        localStorage.setItem('gts_location_enabled', 'true')
        localStorage.setItem('gts_user_location', JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }))
        showLocationBanner.value = false
        locationSuccess.value = true
        selectedLocation.value = 'nearby'
        localStorage.setItem('gts_selected_location', 'nearby')
        setTimeout(() => { locationSuccess.value = false }, 5000)
      },
      () => { 
        showLocationBanner.value = false
        localStorage.setItem('gts_location_dismissed', 'true') 
      }
    )
  } else { 
    showLocationBanner.value = false
    localStorage.setItem('gts_location_dismissed', 'true') 
  }
}

function dismissLocationBanner() {
  showLocationBanner.value = false; localStorage.setItem('gts_location_dismissed', 'true')
}

function resetFilters() {
  searchQuery.value = ''
  searchFilter.value = 'all'
  selectedLocation.value = ''
  activeProductFilter.value = 'all'
}

const serviceTypes = [
  { name: 'Delivery', icon: 'local_shipping', desc: 'Fast & reliable logistics', bg: 'rgba(118,48,163,0.12)', color: '#a854dc' },
  { name: 'Marketing', icon: 'campaign', desc: 'Digital grow & promotion', bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  { name: 'Photography', icon: 'camera_alt', desc: 'Visual storytelling expert', bg: 'rgba(236,72,153,0.12)', color: '#ec4899' },
  { name: 'Web Development', icon: 'code', desc: 'Modern software builds', bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  { name: 'Consulting', icon: 'groups', desc: 'Strategic business advice', bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
  { name: 'Cleaning', icon: 'cleaning_services', desc: 'Hygiene & space sanitizing', bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  { name: 'Moving', icon: 'inventory_2', desc: 'Secure furniture relocation', bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
  { name: 'Tutoring', icon: 'school', desc: 'Academic & skills training', bg: 'rgba(217,70,239,0.12)', color: '#d946ef' },
  { name: 'Legal', icon: 'shield', desc: 'Advice & contract support', bg: 'rgba(51,65,85,0.12)', color: '#334155' },
  { name: 'Printing', icon: 'print', desc: 'Large format & digital print', bg: 'rgba(234,88,12,0.12)', color: '#ea580c' },
  { name: 'Catering', icon: 'diamond', desc: 'Event & corporate meals', bg: 'rgba(168,85,247,0.12)', color: '#a855f7' },
  { name: 'Interior Design', icon: 'design_services', desc: 'Space planning & decor', bg: 'rgba(6,182,212,0.12)', color: '#06b6d4' },
  { name: 'Event Planning', icon: 'auto_awesome', desc: 'Weddings & celebrations', bg: 'rgba(244,114,182,0.12)', color: '#f472b6' },
  { name: 'Auto Repair', icon: 'engineering', desc: 'Vehicle maintenance care', bg: 'rgba(100,116,139,0.12)', color: '#64748b' },
  { name: 'Accounting', icon: 'assessment', desc: 'Financial & tax services', bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  { name: 'Fitness Training', icon: 'speed', desc: 'Personal health coaching', bg: 'rgba(249,115,22,0.12)', color: '#f97316' }
]

const serviceProvidersData = {
  'Delivery': [
    { name: 'Anbessa Logistics', desc: 'Express same-day delivery across major cities', responseTime: '< 1 hour', location: 'Addis Ababa' },
    { name: 'Selam Express', desc: 'Eco-friendly delivery with real-time tracking', responseTime: '2-4 hours', location: 'Mekelle' },
    { name: 'Walia Courier', desc: 'Bulk item specialists with coverage', responseTime: '< 2 hours', location: 'Addis Ababa' },
    { name: 'Addis Fast', desc: 'Quick inner-city deliveries', responseTime: '< 30 mins', location: 'Addis Ababa' },
    { name: 'Mekelle Post', desc: 'Regional delivery expertise', responseTime: '5 hours', location: 'Mekelle' },
    { name: 'Quick Drop', desc: 'Bike courier for small packages', responseTime: '20 mins', location: 'Hawassa' },
    { name: 'Red Lion Trans', desc: 'Heavy load long-distance moving', responseTime: '12 hours', location: 'Bahir Dar' },
    { name: 'Flash Delivery', desc: 'Food and grocery delivery experts', responseTime: '45 mins', location: 'Addis Ababa' },
    { name: 'Safe Ship', desc: 'Insured high-value item transport', responseTime: '1 hour', location: 'Addis Ababa' },
    { name: 'Swift Move', desc: 'Last-mile logistics solutions', responseTime: '2 hours', location: 'Mekelle' },
    { name: 'Panda Logistics', desc: 'Ecommerce fulfillment partner', responseTime: '3 hours', location: 'Hawassa' },
    { name: 'Eagle Eye', desc: 'Time-critical document delivery', responseTime: '15 mins', location: 'Addis Ababa' },
    { name: 'Sky Line', desc: 'Air freight and express mail', responseTime: '24 hours', location: 'Addis Ababa' },
    { name: 'Green Path', desc: 'Bicycle only eco-delivery', responseTime: '1 hour', location: 'Hawassa' },
    { name: 'Nile Express', desc: 'Regional shipping specialists', responseTime: '6 hours', location: 'Bahir Dar' },
    { name: 'Tana Transport', desc: 'Reliable water and land logistics', responseTime: '8 hours', location: 'Bahir Dar' }
  ],
  'Web Development': [
    { name: 'Axum Code Labs', desc: 'Full-stack software development specialists', responseTime: '4 hours', location: 'Addis Ababa' },
    { name: 'Zemen Digital', desc: 'Modern web and mobile app design', responseTime: '2 hours', location: 'Mekelle' },
    { name: 'Ethio Tech Hub', desc: 'Custom enterprise software solutions', responseTime: '6 hours', location: 'Addis Ababa' },
    { name: 'Nile Web Agency', desc: 'SEO and performance optimized sites', responseTime: '3 hours', location: 'Bahir Dar' },
    { name: 'Mekelle Devs', desc: 'Local business digitization experts', responseTime: '1 hour', location: 'Mekelle' },
    { name: 'Addis Soft', desc: 'ERP and CRM implementation', responseTime: '12 hours', location: 'Addis Ababa' },
    { name: 'Bahr Dar Tech', desc: 'Creative frontend specialists', responseTime: '5 hours', location: 'Bahir Dar' },
    { name: 'Cloud Ethiopia', desc: 'Serverless and cloud architecture', responseTime: '8 hours', location: 'Addis Ababa' },
    { name: 'Pixel Pioneers', desc: 'UI/UX focused web development', responseTime: '2 hours', location: 'Hawassa' },
    { name: 'Code Craft', desc: 'E-commerce and marketplace builds', responseTime: '4 hours', location: 'Addis Ababa' },
    { name: 'Cyber Safa', desc: 'Security audit and web hardening', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Open Dev', desc: 'Open source community contributors', responseTime: '10 hours', location: 'Addis Ababa' },
    { name: 'Alpha Solutions', desc: 'MVP development for startups', responseTime: '3 hours', location: 'Mekelle' },
    { name: 'Infinity Tech', desc: 'Scalable backend systems', responseTime: '7 hours', location: 'Addis Ababa' }
  ],
  'Marketing': [
    { name: 'Glow Media', desc: 'Social media management & branding', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Liyu Ads', desc: 'Traditional and digital billboard ads', responseTime: '6 hours', location: 'Bahr Dar' },
    { name: 'Ethio Viral', desc: 'Influencer marketing and viral trends', responseTime: '1 hour', location: 'Addis Ababa' },
    { name: 'Marketero', desc: 'Growth hacking for local startups', responseTime: '4 hours', location: 'Mekelle' },
    { name: 'Sky Reach', desc: 'SEO and content marketing specialists', responseTime: '3 hours', location: 'Addis Ababa' },
    { name: 'Horizon Connect', desc: 'B2B marketing and lead generation', responseTime: '8 hours', location: 'Hawassa' },
    { name: 'Impact Ad Group', desc: 'Full-service creative agency', responseTime: '5 hours', location: 'Addis Ababa' },
    { name: 'Digital Ethiopia', desc: 'Government and NGO campaign experts', responseTime: '12 hours', location: 'Addis Ababa' },
    { name: 'Abyssinia Creative', desc: 'Storytelling through digital ads', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Mekelle Marketing', desc: 'Localized campaigns for Tigray region', responseTime: '1 hour', location: 'Mekelle' },
    { name: 'Tana Promotions', desc: 'Event marketing and sponsorships', responseTime: '4 hours', location: 'Bahir Dar' },
    { name: 'Zenith PR', desc: 'Public relations and brand reputation', responseTime: '3 hours', location: 'Addis Ababa' },
    { name: 'Nova Marketing', desc: 'Performance marketing and analytics', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Apex Media', desc: 'Video production for commercials', responseTime: '6 hours', location: 'Addis Ababa' }
  ],
  'Photography': [
    { name: 'Lalibela Studio', desc: 'Professional portrait and event photography', responseTime: '3 hours', location: 'Addis Ababa' },
    { name: 'Frame Ethio', desc: 'Wedding and luxury event coverage', responseTime: '5 hours', location: 'Addis Ababa' },
    { name: 'Pixel Dream', desc: 'Product photography for e-commerce', responseTime: '2 hours', location: 'Mekelle' },
    { name: 'Snap Happy', desc: 'Fashion and lifestyle shoots', responseTime: '4 hours', location: 'Hawassa' },
    { name: 'Addis Clicks', desc: 'Corporate and headshot specialists', responseTime: '1 hour', location: 'Addis Ababa' },
    { name: 'Tana Visuals', desc: 'Bahr Dar based landscape and event photography', responseTime: '6 hours', location: 'Bahir Dar' },
    { name: 'Memories Lab', desc: 'High-end photo editing and restoration', responseTime: '12 hours', location: 'Addis Ababa' },
    { name: 'Focus Point', desc: 'Sports and action photography', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Visionary Art', desc: 'Artistic and conceptual photography', responseTime: '8 hours', location: 'Addis Ababa' },
    { name: 'Urban Lens', desc: 'Street and documentary photography', responseTime: '3 hours', location: 'Addis Ababa' },
    { name: 'Elite Captures', desc: 'Drone and aerial photography', responseTime: '4 hours', location: 'Mekelle' },
    { name: 'Timeless Frames', desc: 'Family and maternity portraiture', responseTime: '5 hours', location: 'Addis Ababa' },
    { name: 'Dynamic Shot', desc: 'Food and restaurant photography', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Heritage Clicks', desc: 'Cultural and heritage site documentation', responseTime: '10 hours', location: 'Bahir Dar' }
  ],
  'Consulting': [
    { name: 'Ethio Strategy', desc: 'Business growth and market entry consulting', responseTime: '4 hours', location: 'Addis Ababa' },
    { name: 'Zemen Consulting', desc: 'Financial advisory and tax planning', responseTime: '6 hours', location: 'Addis Ababa' },
    { name: 'Global Path', desc: 'Export and import trade consulting', responseTime: '3 hours', location: 'Mekelle' },
    { name: 'Nexus Advisory', desc: 'Human resources and talent management', responseTime: '5 hours', location: 'Addis Ababa' },
    { name: 'Frontier Consulting', desc: 'Startup scaling and investment readiness', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Tana Insights', desc: 'Data analytics and market research', responseTime: '8 hours', location: 'Bahir Dar' },
    { name: 'Summit Partners', desc: 'Legal and regulatory compliance advisory', responseTime: '12 hours', location: 'Addis Ababa' },
    { name: 'Optima Business', desc: 'Operations and supply chain optimization', responseTime: '4 hours', location: 'Addis Ababa' },
    { name: 'Ethio Tech Consult', desc: 'IT strategy and digital transformation', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Prime Advisory', desc: 'Project management and execution support', responseTime: '5 hours', location: 'Addis Ababa' },
    { name: 'Vanguard Group', desc: 'Risk management and insurance consulting', responseTime: '6 hours', location: 'Addis Ababa' },
    { name: 'Aspire Consulting', desc: 'Leadership training and executive coaching', responseTime: '3 hours', location: 'Hawassa' },
    { name: 'Insight Global', desc: 'International business expansion support', responseTime: '10 hours', location: 'Addis Ababa' },
    { name: 'Unity Strategy', desc: 'Non-profit and NGO management consulting', responseTime: '7 hours', location: 'Addis Ababa' }
  ],
  'Cleaning': [
    { name: 'Fresh Start', desc: 'Residential and commercial deep cleaning', responseTime: '1 hour', location: 'Addis Ababa' },
    { name: 'Pure Shine', desc: 'Professional janitorial services for offices', responseTime: '2 hours', location: 'Mekelle' },
    { name: 'Eco Clean', desc: 'Green cleaning with eco-friendly products', responseTime: '3 hours', location: 'Addis Ababa' },
    { name: 'Spotless Pro', desc: 'After-construction and move-in/out cleaning', responseTime: '4 hours', location: 'Addis Ababa' },
    { name: 'Addis Sanitizers', desc: 'Advanced disinfection and sanitization services', responseTime: '1 hour', location: 'Addis Ababa' },
    { name: 'Glow Cleaners', desc: 'Carpet and upholstery steam cleaning', responseTime: '2 hours', location: 'Hawassa' },
    { name: 'Daily Maid', desc: 'Reliable daily and weekly maid services', responseTime: '3 hours', location: 'Addis Ababa' },
    { name: 'Crystal Clear', desc: 'Window and facade cleaning for skyscrapers', responseTime: '5 hours', location: 'Addis Ababa' },
    { name: 'Royal Cleaning', desc: 'Hotel and hospitality cleaning specialists', responseTime: '4 hours', location: 'Bahir Dar' },
    { name: 'Hygiene Hub', desc: 'Industrial and warehouse cleaning', responseTime: '6 hours', location: 'Addis Ababa' },
    { name: 'Sparkle Squad', desc: 'Event venue and stadium cleaning', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Elite Clean', desc: 'Laboratory and healthcare facility cleaning', responseTime: '1 hour', location: 'Addis Ababa' },
    { name: 'Tidy Home', desc: 'Housekeeping and organization services', responseTime: '3 hours', location: 'Mekelle' },
    { name: 'Master Clean', desc: 'Kitchen and restaurant exhaust cleaning', responseTime: '4 hours', location: 'Addis Ababa' }
  ],
  'Moving': [
    { name: 'SafeMove Ethiopia', desc: 'Professional residential and office relocation', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Axum Movers', desc: 'Long-distance furniture transport specialists', responseTime: '4 hours', location: 'Mekelle' },
    { name: 'Ethio Relocate', desc: 'Full-service packing and unpacking solutions', responseTime: '3 hours', location: 'Addis Ababa' },
    { name: 'Habesha Moving Co', desc: 'Affordable local moves with insurance coverage', responseTime: '1 hour', location: 'Hawassa' },
    { name: 'Blue Nile Movers', desc: 'Specialty item and piano moving experts', responseTime: '6 hours', location: 'Bahir Dar' }
  ],
  'Tutoring': [
    { name: 'BrightMinds Academy', desc: 'K-12 tutoring in all core subjects', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'EthioLearn', desc: 'University entrance exam preparation', responseTime: '1 hour', location: 'Mekelle' },
    { name: 'Mekelle Tutors', desc: 'Private one-on-one academic coaching', responseTime: '3 hours', location: 'Mekelle' },
    { name: 'Lingua Ethiopia', desc: 'English, Amharic, and Tigrinya language courses', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'STEM Stars', desc: 'Math, physics, and coding for students', responseTime: '4 hours', location: 'Hawassa' }
  ],
  'Legal': [
    { name: 'Addis Law Partners', desc: 'Corporate law and business registration', responseTime: '4 hours', location: 'Addis Ababa' },
    { name: 'Tigray Legal Aid', desc: 'Civil rights and family law services', responseTime: '2 hours', location: 'Mekelle' },
    { name: 'Ethiopian IP Law', desc: 'Intellectual property and trademark filing', responseTime: '6 hours', location: 'Addis Ababa' },
    { name: 'Shield Legal Group', desc: 'Contract drafting and dispute resolution', responseTime: '3 hours', location: 'Addis Ababa' },
    { name: 'Justice First', desc: 'Labor law and employment dispute mediation', responseTime: '5 hours', location: 'Bahir Dar' }
  ],
  'Printing': [
    { name: 'Mega Print Hub', desc: 'Large format banners and signage printing', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Adwa Graphics', desc: 'Business cards, brochures, and flyers', responseTime: '1 hour', location: 'Mekelle' },
    { name: 'PrintEthio', desc: 'Custom packaging and label printing', responseTime: '4 hours', location: 'Addis Ababa' },
    { name: 'Digital Press', desc: 'On-demand book and magazine printing', responseTime: '3 hours', location: 'Hawassa' },
    { name: 'Canvas Works', desc: '3D printing and prototype services', responseTime: '6 hours', location: 'Addis Ababa' }
  ],
  'Catering': [
    { name: 'Habesha Feast', desc: 'Traditional Ethiopian cuisine for large events', responseTime: '3 hours', location: 'Addis Ababa' },
    { name: 'Royal Catering', desc: 'Corporate lunch and dinner services', responseTime: '2 hours', location: 'Mekelle' },
    { name: 'Taste of Africa', desc: 'Fusion and international menu creation', responseTime: '4 hours', location: 'Addis Ababa' },
    { name: 'Eden Kitchen', desc: 'Vegan and health-conscious catering', responseTime: '2 hours', location: 'Hawassa' },
    { name: 'Celebration Foods', desc: 'Wedding and birthday party specialists', responseTime: '5 hours', location: 'Bahir Dar' }
  ],
  'Interior Design': [
    { name: 'Addis Interiors', desc: 'Modern residential and office space design', responseTime: '4 hours', location: 'Addis Ababa' },
    { name: 'Ethio Style Studio', desc: 'Ethiopian-inspired contemporary decor', responseTime: '3 hours', location: 'Mekelle' },
    { name: 'Urban Spaces', desc: 'Commercial interior and retail store design', responseTime: '6 hours', location: 'Addis Ababa' },
    { name: 'Harmony Design', desc: 'Sustainable and eco-friendly interiors', responseTime: '5 hours', location: 'Hawassa' },
    { name: 'Luxe Interiors', desc: 'High-end luxury home and villa styling', responseTime: '8 hours', location: 'Addis Ababa' }
  ],
  'Event Planning': [
    { name: 'Grand Events Ethiopia', desc: 'Full-scale wedding and corporate events', responseTime: '2 hours', location: 'Addis Ababa' },
    { name: 'Tigray Celebrations', desc: 'Cultural and traditional ceremony planning', responseTime: '3 hours', location: 'Mekelle' },
    { name: 'Starlight Events', desc: 'Concert and festival production management', responseTime: '4 hours', location: 'Addis Ababa' },
    { name: 'Moments Agency', desc: 'Intimate gatherings and birthday parties', responseTime: '1 hour', location: 'Hawassa' },
    { name: 'Heritage Events', desc: 'Heritage and tourism event coordination', responseTime: '6 hours', location: 'Bahir Dar' }
  ],
  'Auto Repair': [
    { name: 'Addis Auto Care', desc: 'Full-service vehicle maintenance and repair', responseTime: '1 hour', location: 'Addis Ababa' },
    { name: 'Mekelle Motors', desc: 'Engine diagnostics and transmission repair', responseTime: '2 hours', location: 'Mekelle' },
    { name: 'Quick Fix Garage', desc: 'Emergency roadside assistance and towing', responseTime: '30 mins', location: 'Addis Ababa' },
    { name: 'Ethio Auto Electric', desc: 'Electrical systems and battery specialists', responseTime: '3 hours', location: 'Hawassa' },
    { name: 'Tana Auto Works', desc: 'Body shop and paint restoration services', responseTime: '4 hours', location: 'Bahir Dar' }
  ],
  'Accounting': [
    { name: 'Ethio Finance Group', desc: 'Full-service accounting and bookkeeping', responseTime: '3 hours', location: 'Addis Ababa' },
    { name: 'TaxPro Ethiopia', desc: 'Tax preparation and compliance advisory', responseTime: '2 hours', location: 'Mekelle' },
    { name: 'Audit Masters', desc: 'Independent auditing and financial review', responseTime: '6 hours', location: 'Addis Ababa' },
    { name: 'Payroll Partners', desc: 'Payroll management and HR accounting', responseTime: '4 hours', location: 'Hawassa' },
    { name: 'Budget Wise', desc: 'Small business financial planning and setup', responseTime: '2 hours', location: 'Bahir Dar' }
  ],
  'Fitness Training': [
    { name: 'FitEthio', desc: 'Personal training and body transformation', responseTime: '1 hour', location: 'Addis Ababa' },
    { name: 'Mekelle Fitness Studio', desc: 'Group classes and yoga sessions', responseTime: '2 hours', location: 'Mekelle' },
    { name: 'Iron Will Gym', desc: 'Strength and conditioning coaching', responseTime: '1 hour', location: 'Addis Ababa' },
    { name: 'Wellness Hub', desc: 'Nutrition planning and holistic health', responseTime: '3 hours', location: 'Hawassa' },
    { name: 'Active Life', desc: 'Outdoor boot camps and marathon training', responseTime: '2 hours', location: 'Addis Ababa' }
  ]
}

const visibleServiceTypes = computed(() => {
  const filteredGrid = serviceTypes.filter(s => {
    return serviceProvidersData[s.name] && serviceProvidersData[s.name].length > 0
  })
  if (!searchQuery.value) return filteredGrid
  const q = searchQuery.value.toLowerCase()
  return filteredGrid.filter(s => {
    if (s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)) return true
    const providers = serviceProvidersData[s.name] || []
    return providers.some(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
  })
})

const totalServiceTypePages = computed(() => Math.ceil(visibleServiceTypes.value.length / serviceTypesPerPage))
const paginatedServiceTypes = computed(() => {
  const start = (currentServiceTypePage.value - 1) * serviceTypesPerPage
  return visibleServiceTypes.value.slice(start, start + serviceTypesPerPage)
})

const currentServiceBg = computed(() => serviceTypes.find(s => s.name === selectedServiceType.value)?.bg || '')
const currentServiceColor = computed(() => serviceTypes.find(s => s.name === selectedServiceType.value)?.color || '')
const currentServiceIcon = computed(() => serviceTypes.find(s => s.name === selectedServiceType.value)?.icon || '')

const allServiceProviders = computed(() => {
  let providers = serviceProvidersData[selectedServiceType.value] || []
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    providers = providers.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q)
    )
  }
  if (selectedLocation.value) {
     const loc = selectedLocation.value === 'nearby' ? (localStorage.getItem('gts_user_city') || 'Addis Ababa') : selectedLocation.value
     providers = providers.filter(p => p.location?.includes(loc))
  }
  return providers
})

const totalProviderPages = computed(() => Math.ceil(allServiceProviders.value.length / providersPerPage))
const paginatedProviders = computed(() => {
  const start = (currentProviderPage.value - 1) * providersPerPage
  return allServiceProviders.value.slice(start, start + providersPerPage)
})

const filteredProducts = computed(() => {
  let pList = customerStore.getFilteredProducts(searchQuery.value, searchFilter.value, activeProductFilter.value === 'all' ? null : activeProductFilter.value, sortBy.value)
  if (selectedLocation.value) {
     const loc = selectedLocation.value === 'nearby' ? (localStorage.getItem('gts_user_city') || 'Addis Ababa') : selectedLocation.value
     pList = pList.filter(p => {
        const b = customerStore.getBusinessById(p.businessId)
        return b?.location?.includes(loc)
     })
  }
  return pList
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})

function openProductChat(product) {
  router.push({
    path: '/customer/chat',
    query: {
      type: 'product',
      product: product.name,
      productId: product.id,
      businessId: product.businessId,
      provider: product.businessName,
      initialMessage: `Hello! I'm interested in your product: ${product.name}. Can you provide more details?`
    }
  })
}

function openServiceChat(provider) {
  router.push({
    path: '/customer/chat',
    query: { 
      type: 'service', 
      provider: provider.name, 
      serviceType: selectedServiceType.value,
      initialMessage: `Hello! I'm interested in your ${selectedServiceType.value} services. How can we get started?`
    }
  })
}

watch([searchQuery, searchFilter, activeProductFilter, sortBy, selectedLocation], () => {
  currentPage.value = 1
  currentProviderPage.value = 1
  currentServiceTypePage.value = 1
})
watch(selectedServiceType, () => {
  currentProviderPage.value = 1
})
</script>
