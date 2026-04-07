<template>
  <div class="animate-fade-in space-y-12 pb-20">
    <!-- Hero & Main Search Section -->
    <section class="text-center pt-8 pb-4 relative">
      <h1 class="font-heading text-4xl lg:text-6xl font-extrabold text-[#1A1225] mb-6 tracking-tight">
        Master Your <span class="text-primary-500">Business</span> Growth
      </h1>
      <p class="text-secondary-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
        Discover precision-engineered hardware, professional tools, and verified services for the modern architectural and technical landscape.
      </p>

      <div class="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-3 bg-white p-2.5 rounded-2xl shadow-soft border border-[#EEEAF2]">
        <div class="flex-1 w-full relative flex items-center">
          <span class="material-icons-round absolute left-4 text-slate-400">search</span>
          <input type="text" v-model="searchQuery" 
            placeholder="Search by product, category, or brand..."
            class="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 focus:outline-none text-[#2D2438] font-medium"
            id="global-search-input">
        </div>
        <div class="h-8 w-[1px] bg-[#EEEAF2] hidden md:block"></div>
        <select v-model="searchFilter" class="w-full md:w-44 py-3 px-4 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-500 font-bold text-sm cursor-pointer">
          <option value="all">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Hardware">Hardware</option>
          <option value="Services">Services</option>
        </select>
      </div>
    </section>

    <!-- Main Navigation Interface Tabs -->
    <section class="max-w-7xl mx-auto px-4">
      <div class="flex flex-wrap items-center justify-center gap-2 mb-10">
        <button v-for="tab in mainTabs" :key="tab.id"
          class="px-8 py-3 rounded-full font-bold text-[0.875rem] transition-all duration-300 flex items-center gap-2 border-2"
          :class="activeMainTab === tab.id ? 'bg-primary-500 border-primary-500 text-white shadow-soft' : 'bg-white border-[#EEEAF2] text-[#1A1225] hover:border-primary-500'"
          @click="switchTab(tab.id)">
          <span class="material-icons-round text-base">{{ tab.icon }}</span>
          {{ tab.name }}
        </button>
      </div>
    </section>

    <!-- ==================== EXPLORE PRODUCTS TAB ==================== -->
    <div v-if="activeMainTab === 'explore'" class="space-y-12">
      <section class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#EEEAF2] pb-6 mb-8">
          <div class="flex items-center gap-8">
            <button v-for="tab in productSubTabs" :key="tab.id"
              class="relative py-2 text-[0.938rem] font-extrabold transition-all"
              :class="activeProductTab === tab.id ? 'text-primary-500' : 'text-slate-400 hover:text-slate-600'"
              @click="activeProductTab = tab.id">
              {{ tab.name }}
              <div v-if="activeProductTab === tab.id" class="absolute -bottom-[25px] left-0 w-full h-[3px] bg-primary-500 rounded-full"></div>
            </button>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort By:</span>
            <select v-model="sortBy" class="select-gts !py-1.5 !text-xs !bg-slate-50 border-none !px-3 font-bold">
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <div v-for="product in filteredProducts" :key="product.id" 
            class="group bg-white rounded-2xl p-3 border border-[#EEEAF2] hover:border-primary-500/20 hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden cursor-pointer"
            @click="$router.push(`/customer/product/${product.id}`)">
            
            <div class="w-full aspect-square bg-[#F5F3F7] rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
              <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-contain p-2 mix-blend-multiply transition-transform group-hover:scale-110" />
              <span v-else class="material-icons-round text-3xl text-[#EEEAF2]">inventory_2</span>
              
              <div class="absolute top-2 left-2 flex flex-col gap-2">
                <span v-if="product.onSale" class="bg-red-500 text-white text-[0.5rem] font-black px-1.5 py-0.5 rounded tracking-tighter uppercase shadow-sm">On Sale</span>
              </div>
              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button @click.stop="toggleWishlistItem(product.id)" class="w-7 h-7 bg-white/90 backdrop-blur rounded-lg shadow-sm flex items-center justify-center transition-all"
                  :class="isInWishlist(product.id) ? 'text-tertiary-300' : 'text-primary-500 hover:bg-primary-500 hover:text-white'">
                  <span class="material-icons-round text-sm">favorite</span>
                </button>
              </div>
            </div>

            <span class="text-[0.5rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{{ product.category }}</span>
            <h3 class="font-heading font-black text-[0.75rem] text-[#1A1225] mb-1 leading-tight group-hover:text-primary-500 transition-colors truncate">
              {{ product.name }}
            </h3>
            
            <div class="flex items-center gap-1 mb-2">
              <div class="flex items-center text-amber-400">
                <span v-for="i in 5" :key="i" class="material-icons-round text-[0.5rem]">
                  {{ i <= 4 ? 'star' : 'star_half' }}
                </span>
              </div>
              <span class="text-[0.5rem] text-slate-400 font-bold uppercase tracking-widest">(4.8)</span>
            </div>

            <div class="mt-auto flex items-end justify-between pt-2 border-t border-[#F5F3F7]">
              <div>
                <span v-if="product.salePrice" class="block text-[0.45rem] text-slate-400 line-through font-bold mb-0.5">${{ product.price }}</span>
                <span class="text-[0.938rem] font-black text-[#1A1225] tracking-tight">
                  <span class="text-primary-500 text-[0.625rem] font-bold">$</span>{{ (product.salePrice || product.price).toLocaleString() }}
                </span>
              </div>
              <span class="material-icons-round text-slate-300 text-sm group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Premium Shops Preview (shown below products in explore tab) -->
      <section class="max-w-7xl mx-auto px-4 mt-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="font-heading text-2xl font-black text-[#1A1225] flex items-center gap-3">
              Premium <span class="text-primary-500">Curator</span> Shops
            </h2>
            <p class="text-slate-500 text-sm font-medium mt-1">Browse verified top-tier merchants</p>
          </div>
          <button @click="switchTab('shops')" class="text-primary-500 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <span class="material-icons-round text-base">arrow_forward</span>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="biz in topBusinesses" :key="biz.id"
            class="group bg-white rounded-3xl p-1.5 border border-[#EEEAF2] hover:border-primary-500/30 transition-all cursor-pointer flex flex-col md:flex-row gap-4 hover:shadow-soft"
            @click="$router.push(`/customer/business/${biz.id}`)">
            <div class="w-full md:w-36 h-32 bg-[#F5F3F7] rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0">
              <div class="w-14 h-14 bg-white border border-[#EEEAF2] rounded-2xl shadow-soft flex items-center justify-center font-black text-[#1A1225] text-lg z-10 transition-transform group-hover:scale-110">
                {{ biz.name.charAt(0) }}
              </div>
            </div>
            <div class="flex-1 py-3 pr-4">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[0.5rem] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded">Merchant</span>
                <span v-if="biz.verified" class="material-icons-round text-tertiary-300 text-sm">verified</span>
              </div>
              <h4 class="font-heading text-base font-black text-[#1A1225] mb-1 group-hover:text-primary-500 transition-colors">{{ biz.name }}</h4>
              <p class="text-slate-500 text-xs font-medium line-clamp-1 mb-2">{{ biz.description }}</p>
              <div class="flex items-center gap-3">
                <span class="text-xs font-black text-[#1A1225] flex items-center gap-1">
                  <span class="material-icons-round text-amber-400 text-xs">star</span>
                  {{ biz.rating || '4.9' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Service Portal Preview (shown below shops in explore tab) -->
      <section class="max-w-7xl mx-auto px-4 mt-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="font-heading text-2xl font-black text-[#1A1225] flex items-center gap-3">
              Service <span class="text-primary-500">Portal</span>
            </h2>
            <p class="text-slate-500 text-sm font-medium mt-1">Professional services at your fingertips</p>
          </div>
          <button @click="switchTab('services')" class="text-primary-500 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <span class="material-icons-round text-base">arrow_forward</span>
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div v-for="s in serviceTypes" :key="s.name" 
            class="bg-white rounded-2xl p-5 border border-[#EEEAF2] hover:border-primary-500/20 hover:shadow-soft transition-all cursor-pointer text-center group"
            @click="switchTab('services'); selectedServiceType = s.name">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110" :style="{ background: s.bg }">
              <span class="material-icons-round text-xl" :style="{ color: s.color }">{{ s.icon }}</span>
            </div>
            <h4 class="font-black text-xs text-[#1A1225] group-hover:text-primary-500 transition-colors">{{ s.name }}</h4>
          </div>
        </div>
      </section>
    </div>

    <!-- ==================== PREMIUM SHOPS TAB (only shops content) ==================== -->
    <section v-if="activeMainTab === 'shops'" class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="font-heading text-2xl font-black text-[#1A1225] flex items-center gap-3">
            Premium <span class="text-primary-500">Curator</span> Shops
          </h2>
          <p class="text-slate-500 text-sm font-medium mt-1">Direct access to verified top-tier hardware and software merchants.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div v-for="biz in filteredBusinesses" :key="biz.id"
          class="group bg-white rounded-[2rem] p-4 border border-[#EEEAF2] hover:border-primary-500/30 transition-all cursor-pointer flex flex-col md:flex-row gap-6 hover:shadow-soft"
          @click="$router.push(`/customer/business/${biz.id}`)">
          
          <div class="w-full md:w-64 h-52 bg-[#F5F3F7] rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0">
            <div class="w-20 h-20 bg-white border border-[#EEEAF2] rounded-2xl shadow-soft flex items-center justify-center font-black text-[#1A1225] text-2xl z-10 transition-transform group-hover:scale-110">
              {{ biz.name.charAt(0) }}
            </div>
          </div>

          <div class="flex-1 py-2">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-[0.625rem] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-2.5 py-1 rounded">Premium Merchant</span>
              <span v-if="biz.verified" class="material-icons-round text-tertiary-300 text-base">verified</span>
            </div>
            <h4 class="font-heading text-xl font-black text-[#1A1225] mb-2 group-hover:text-primary-500 transition-colors">{{ biz.name }}</h4>
            <p class="text-slate-500 text-sm font-medium line-clamp-2 mb-4 leading-relaxed">
              {{ biz.description }}
            </p>
            <div class="flex items-center gap-6 mt-auto">
              <div>
                <span class="text-[0.625rem] text-slate-400 font-bold uppercase tracking-wider mb-1 px-1 block">Rating</span>
                <span class="text-sm font-black text-[#1A1225] flex items-center gap-1">
                  <span class="material-icons-round text-amber-400 text-sm">star</span>
                  {{ biz.rating || '4.9' }}
                </span>
              </div>
              <div class="flex flex-col border-l border-[#EEEAF2] pl-6">
                <span class="text-[0.625rem] text-slate-400 font-bold uppercase tracking-wider mb-1 px-1 block">Location</span>
                <span class="text-sm font-black text-[#1A1225] truncate">
                  {{ biz.location || 'San Francisco, CA' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SERVICES TAB (Service Types → Providers Flow) ==================== -->
    <section v-if="activeMainTab === 'services'" class="max-w-5xl mx-auto px-4">
      <!-- Step 1: Service Types Grid -->
      <div v-if="!selectedServiceType" class="space-y-8">
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-primary-500/5 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="material-icons-round text-3xl">engineering</span>
          </div>
          <h3 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Service Portal</h3>
          <p class="text-slate-400 font-bold text-sm uppercase tracking-widest">Select a service type to get started</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="s in serviceTypes" :key="s.name"
            class="group bg-white rounded-3xl p-8 border border-[#EEEAF2] hover:border-primary-500/30 hover:shadow-soft transition-all cursor-pointer text-center"
            @click="selectedServiceType = s.name">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-110" :style="{ background: s.bg }">
              <span class="material-icons-round text-2xl" :style="{ color: s.color }">{{ s.icon }}</span>
            </div>
            <h4 class="font-heading text-lg font-black text-[#1A1225] mb-2 group-hover:text-primary-500 transition-colors">{{ s.name }}</h4>
            <p class="text-slate-500 text-sm font-medium leading-relaxed">{{ s.desc }}</p>
            <div class="mt-4 text-primary-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              View Providers <span class="material-icons-round text-sm">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Service Providers for selected type -->
      <div v-else class="space-y-8">
        <button @click="selectedServiceType = null" class="flex items-center gap-2 text-primary-500 font-black text-sm hover:gap-3 transition-all mb-4">
          <span class="material-icons-round text-base">arrow_back</span> Back to Service Types
        </button>

        <div class="flex items-center gap-4 mb-8">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center" :style="{ background: currentServiceBg }">
            <span class="material-icons-round text-2xl" :style="{ color: currentServiceColor }">{{ currentServiceIcon }}</span>
          </div>
          <div>
            <h3 class="font-heading text-2xl font-black text-[#1A1225]">{{ selectedServiceType }}</h3>
            <p class="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">{{ filteredProviders.length }} providers available</p>
          </div>
        </div>

        <!-- Provider Cards -->
        <div class="space-y-4">
          <div v-for="provider in filteredProviders" :key="provider.name"
            class="bg-white rounded-2xl p-6 border border-[#EEEAF2] hover:border-primary-500/20 hover:shadow-soft transition-all flex flex-col md:flex-row items-start md:items-center gap-6">
            <div class="w-16 h-16 bg-[#F5F3F7] rounded-2xl flex items-center justify-center font-black text-[#1A1225] text-xl shrink-0">
              {{ provider.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-heading text-lg font-black text-[#1A1225]">{{ provider.name }}</h4>
                <span class="material-icons-round text-tertiary-300 text-base">verified</span>
              </div>
              <p class="text-slate-500 text-sm font-medium mb-2">{{ provider.desc }}</p>
              <div class="flex items-center gap-4 text-xs font-bold text-slate-400">
                <span class="flex items-center gap-1"><span class="material-icons-round text-amber-400 text-sm">star</span> {{ provider.rating }}</span>
                <span class="flex items-center gap-1"><span class="material-icons-round text-sm">schedule</span> {{ provider.responseTime }}</span>
                <span v-if="provider.price" class="flex items-center gap-1 text-primary-500"><span class="material-icons-round text-sm">payments</span> From ${{ provider.price }}</span>
              </div>
            </div>
            <button @click="openRequestForm(provider)" class="btn-gts-primary px-6 py-3 rounded-xl text-sm shrink-0">
              Request Service
            </button>
          </div>
        </div>

        <!-- Service Request Form Modal -->
        <div v-if="showRequestForm" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-[#1A1225]/50 backdrop-blur-sm" @click="showRequestForm = false"></div>
          <div class="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-8">
              <h3 class="font-heading text-xl font-black text-[#1A1225]">Submit Service Request</h3>
              <button @click="showRequestForm = false" class="w-10 h-10 rounded-xl bg-[#F8F6FB] text-secondary-300 hover:text-primary-500 flex items-center justify-center transition-colors">
                <span class="material-icons-round">close</span>
              </button>
            </div>
            <div class="space-y-5">
              <div class="flex items-center gap-3 p-4 bg-[#F8F6FB] rounded-xl">
                <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-sm">{{ requestProvider?.name?.charAt(0) }}</div>
                <div>
                  <p class="font-black text-sm text-[#1A1225]">{{ requestProvider?.name }}</p>
                  <p class="text-xs text-slate-400 font-bold">{{ selectedServiceType }}</p>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[0.625rem] font-black uppercase text-slate-400 tracking-widest pl-1">Description</label>
                <textarea v-model="requestForm.description" rows="4" class="input-gts" placeholder="Describe what you need..."></textarea>
              </div>
              <div class="space-y-2">
                <label class="text-[0.625rem] font-black uppercase text-slate-400 tracking-widest pl-1">Location</label>
                <input v-model="requestForm.location" type="text" class="input-gts" placeholder="e.g. Mekelle, Tigray">
              </div>
              <div class="space-y-2">
                <label class="text-[0.625rem] font-black uppercase text-slate-400 tracking-widest pl-1">Estimated Budget (USD)</label>
                <input v-model="requestForm.budget" type="number" class="input-gts" placeholder="0.00" step="0.01">
              </div>
              <div v-if="requestSubmitted" class="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-tertiary-300/10 border border-tertiary-300/30 text-tertiary-300">
                <span class="material-icons-round">check_circle</span> Request submitted! You can track it in your profile.
              </div>
              <button v-if="!requestSubmitted" @click="submitRequest" class="btn-gts-primary w-full py-4 rounded-xl group text-[0.938rem]" :disabled="!requestForm.description">
                Submit Request <span class="material-icons-round text-lg group-hover:translate-x-1 transition-transform">send</span>
              </button>
              <button v-else @click="showRequestForm = false; $router.push('/customer/profile')" class="w-full py-4 rounded-xl bg-[#F8F6FB] text-primary-500 font-black text-sm hover:bg-primary-500/10 transition-colors">
                View in Profile →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '../../store/customerStore.js'

const route = useRoute()
const router = useRouter()
const customerStore = useCustomerStore()

const activeMainTab = ref('explore')
const activeProductTab = ref('featured')
const searchQuery = ref('')
const searchFilter = ref('all')
const sortBy = ref('newest')

// Service Portal State
const selectedServiceType = ref(null)
const showRequestForm = ref(false)
const requestProvider = ref(null)
const requestSubmitted = ref(false)
const requestForm = ref({ description: '', location: '', budget: '' })

watch(() => route.query.tab, (newTab) => {
  if (newTab === 'shops') activeMainTab.value = 'shops'
  else if (newTab === 'services') activeMainTab.value = 'services'
  else activeMainTab.value = 'explore'
}, { immediate: true })

function switchTab(tabId) {
  activeMainTab.value = tabId
  router.replace({ path: '/customer/home', query: tabId !== 'explore' ? { tab: tabId } : {} })
}

const mainTabs = [
  { id: 'explore', name: 'Explore Products', icon: 'auto_awesome' },
  { id: 'shops', name: 'Premium Shops', icon: 'storefront' },
  { id: 'services', name: 'Service Portal', icon: 'engineering' }
]

const productSubTabs = [
  { id: 'featured', name: 'Featured Products' },
  { id: 'top-selling', name: 'Top Selling' },
  { id: 'on-sale', name: 'On Sale' }
]

const serviceTypes = [
  { name: 'Delivery', icon: 'local_shipping', desc: 'Fast & reliable package delivery', bg: 'rgba(118,48,163,0.12)', color: '#a854dc' },
  { name: 'Payment Processing', icon: 'payment', desc: 'Secure payment gateway setup', bg: 'rgba(100,210,177,0.12)', color: '#64D2B1' },
  { name: 'Marketing', icon: 'campaign', desc: 'Digital marketing & promotion', bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  { name: 'Photography', icon: 'camera_alt', desc: 'Professional product photography', bg: 'rgba(236,72,153,0.12)', color: '#ec4899' },
  { name: 'Web Development', icon: 'code', desc: 'Website & app development', bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  { name: 'Consulting', icon: 'groups', desc: 'Business strategy consulting', bg: 'rgba(239,68,68,0.12)', color: '#f87171' }
]

// Mock providers per service type
const serviceProviders = {
  'Delivery': [
    { name: 'FastShip Ltd', desc: 'Express same-day delivery across all major cities', rating: '4.9', responseTime: '< 1 hour', price: 25 },
    { name: 'GreenRoute Logistics', desc: 'Eco-friendly delivery solutions with real-time tracking', rating: '4.7', responseTime: '2-4 hours', price: 15 },
    { name: 'SwiftPack Express', desc: 'Bulk & fragile item specialists with insurance coverage', rating: '4.8', responseTime: '< 2 hours', price: 30 }
  ],
  'Payment Processing': [
    { name: 'PayFlow Systems', desc: 'Full-stack payment gateway integration for e-commerce', rating: '4.8', responseTime: '24 hours', price: 150 },
    { name: 'SecurePay Solutions', desc: 'PCI-compliant payment processing with fraud detection', rating: '4.6', responseTime: '48 hours', price: 200 }
  ],
  'Marketing': [
    { name: 'BrandWave Digital', desc: 'Social media management & paid advertising campaigns', rating: '4.7', responseTime: '24 hours', price: 300 },
    { name: 'ViralReach Agency', desc: 'Content marketing & influencer partnerships', rating: '4.5', responseTime: '48 hours', price: 500 }
  ],
  'Photography': [
    { name: 'LensArch Studio', desc: 'High-end product photography with post-processing', rating: '4.9', responseTime: '< 3 hours', price: 100 },
    { name: 'PixelCraft Pro', desc: 'E-commerce photography & 360° product views', rating: '4.8', responseTime: '24 hours', price: 75 }
  ],
  'Web Development': [
    { name: 'CodeForge Labs', desc: 'Full-stack web development & custom CMS solutions', rating: '4.8', responseTime: '24 hours', price: 1000 },
    { name: 'PixelPerfect Dev', desc: 'Frontend development & UI/UX design', rating: '4.6', responseTime: '48 hours', price: 800 }
  ],
  'Consulting': [
    { name: 'StratEdge Partners', desc: 'Business strategy & digital transformation consulting', rating: '4.9', responseTime: '24 hours', price: 200 },
    { name: 'GrowthMind Advisory', desc: 'Startup mentorship & market analysis', rating: '4.7', responseTime: '48 hours', price: 150 }
  ]
}

const currentServiceBg = computed(() => serviceTypes.find(s => s.name === selectedServiceType.value)?.bg || '')
const currentServiceColor = computed(() => serviceTypes.find(s => s.name === selectedServiceType.value)?.color || '')
const currentServiceIcon = computed(() => serviceTypes.find(s => s.name === selectedServiceType.value)?.icon || '')

const filteredProviders = computed(() => {
  return serviceProviders[selectedServiceType.value] || []
})

const filteredProducts = computed(() => customerStore.getFilteredProducts(searchQuery.value, searchFilter.value, activeProductTab.value, sortBy.value))
const filteredBusinesses = computed(() => customerStore.searchBusinesses(searchQuery.value, searchFilter.value))
const topBusinesses = computed(() => customerStore.searchBusinesses('', 'all').slice(0, 3))

function toggleWishlistItem(id) {
  customerStore.toggleWishlist(id)
}

function isInWishlist(id) {
  return customerStore.isInWishlist(id)
}

function openRequestForm(provider) {
  requestProvider.value = provider
  requestSubmitted.value = false
  requestForm.value = { description: '', location: '', budget: '' }
  showRequestForm.value = true
}

function submitRequest() {
  customerStore.submitServiceRequest({
    serviceType: selectedServiceType.value,
    providerName: requestProvider.value?.name,
    description: requestForm.value.description,
    location: requestForm.value.location,
    estimatedCost: parseFloat(requestForm.value.budget) || 50
  })
  requestSubmitted.value = true
}
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.08);
}
</style>
