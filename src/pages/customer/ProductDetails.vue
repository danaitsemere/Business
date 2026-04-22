<template>
  <div class="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 text-left" v-if="product">
    <nav class="flex items-center gap-2 text-[0.688rem] font-bold text-slate-400 uppercase tracking-widest mb-6">
      <router-link to="/customer/home" class="hover:text-[#7630A3] transition-colors">Home</router-link>
      <ChevronRight class="w-3.5 h-3.5" />
      <span class="text-[#1A1225]">{{ product.name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-12">
      <div class="space-y-4">
        <div class="w-full aspect-[4/3] bg-white border border-[#EEEAF2] rounded-3xl p-1 shadow-sm relative overflow-hidden flex items-center justify-center group">
           <div class="absolute inset-0 bg-gradient-to-br from-transparent to-[#F5F3F7] opacity-50"></div>
           <img v-if="selectedImage" :src="selectedImage" :alt="product.name" class="w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
           <Package v-else class="w-28 h-28 text-[#EEEAF2] group-hover:scale-110 transition-transform duration-500" />
           <div class="absolute top-6 left-6 flex gap-2">
              <span v-if="product.onSale" class="bg-red-500 text-white text-[0.625rem] font-black px-2.5 py-1 rounded-lg tracking-tighter uppercase shadow-sm">Sale</span>
           </div>
        </div>
 
        <div class="flex gap-3 overflow-x-auto pb-1 px-0.5">
           <div v-for="(img, idx) in thumbnailImages" :key="idx" 
             class="w-20 h-20 bg-white border-2 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 overflow-hidden"
             :class="selectedImageIdx === idx ? 'border-primary-500 shadow-md shadow-primary-500/10 scale-105' : 'border-[#EEEAF2] hover:border-primary-500/40 hover:shadow-sm'"
             @click="selectedImageIdx = idx">
              <img v-if="img" :src="img" :alt="product.name" class="w-full h-full object-contain p-1.5 mix-blend-multiply" />
              <ImageIcon v-else class="w-5 h-5 text-slate-200" />
           </div>
        </div>
      </div>

      <div class="flex flex-col">
        <div class="flex items-center gap-2 mb-3">
           <span class="text-[0.625rem] font-black uppercase tracking-[0.15em] text-primary-500 bg-primary-500/5 px-2.5 py-1 rounded-md">{{ product.category }}</span>
           <span class="flex items-center gap-1 text-emerald-500 text-[0.625rem] font-black uppercase tracking-widest">
             <CheckCircle2 class="w-3.5 h-3.5" /> In Stock
           </span>
        </div>
           
        <h1 class="font-heading text-xl sm:text-2xl lg:text-4xl font-black text-[#1A1225] mb-2 leading-tight uppercase tracking-tight">{{ product.name }}</h1>
        <p class="text-slate-400 font-medium text-sm leading-relaxed max-w-md mb-3 line-clamp-2">{{ productShortDesc }}</p>

        <div class="flex items-center gap-4 mb-4">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-tight">
            By <span class="text-primary-500 font-black cursor-pointer hover:underline" @click="$router.push(`/customer/business/${product.businessId}`)">{{ product.businessName }}</span>
          </span>
          <div class="flex items-center gap-0.5">
            <Star v-for="n in 5" :key="n" class="w-3 h-3" :class="n <= Math.round(product.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-slate-100'" />
            <span class="text-[0.6rem] font-black text-slate-400 ml-1">{{ product.rating || '4.0' }} ({{ product.reviewCount || 0 }})</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-5 text-[0.6rem] font-black uppercase tracking-widest">
          <span class="flex items-center gap-1 px-2.5 py-1.5 bg-[#F8F6FB] rounded-lg text-slate-500">
            <Truck class="w-3.5 h-3.5 text-emerald-500" /> Free Delivery
          </span>
          <span class="flex items-center gap-1 px-2.5 py-1.5 bg-[#F8F6FB] rounded-lg text-slate-500">
            <ShieldCheck class="w-3.5 h-3.5 text-primary-500" /> Trusted
          </span>
          <span class="flex items-center gap-1 px-2.5 py-1.5 bg-[#F8F6FB] rounded-lg text-slate-500">
            <RotateCcw class="w-3.5 h-3.5 text-amber-500" /> Returns
          </span>
        </div>

        <div class="bg-white border border-[#EEEAF2] rounded-2xl p-6 shadow-sm space-y-5">
           <div class="flex items-end justify-between">
              <div>
                <span class="text-[0.6rem] font-black uppercase text-slate-400 tracking-widest block mb-1">Price</span>
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-black text-[#1A1225]">ETB {{ (product.salePrice || product.price).toLocaleString() }}</span>
                  <span v-if="product.salePrice" class="text-sm text-slate-400 line-through font-bold">ETB {{ product.price.toLocaleString() }}</span>
                  <span v-if="product.salePrice" class="text-[0.6rem] font-black text-red-500 bg-red-500/5 px-1.5 py-0.5 rounded">-{{ Math.round((1 - product.salePrice/product.price)*100) }}%</span>
                </div>
              </div>
           </div>

            <div class="flex items-center justify-between">
              <span class="text-[0.6rem] font-black uppercase text-slate-400 tracking-widest">Quantity</span>
              <div class="flex items-center gap-3">
                <button @click="decreaseQty"
                  class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white"
                  :class="quantity <= 1 ? 'opacity-30 cursor-not-allowed' : ''">
                  <Minus class="w-4 h-4" />
                </button>
                <span class="text-xl font-black text-[#1A1225] min-w-[32px] text-center tabular-nums">{{ quantity }}</span>
                <button @click="quantity++"
                  class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white">
                  <Plus class="w-4 h-4" />
                </button>
                <span class="text-xs font-black text-primary-500 ml-1 tabular-nums">
                   ETB {{ ((product.salePrice || product.price) * quantity).toLocaleString() }}
                </span>
              </div>
            </div>

            <div class="flex gap-3">
               <button @click="chatWithBusiness" class="btn-gts-primary flex-1 group">
                  <MessageSquare class="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Chat with Seller
               </button>

               <button @click="addToRequestList" 
                 class="btn-gts flex-1 !border-2"
                 :class="addedToRequest ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'btn-gts-secondary border-[#EEEAF2] text-[#1A1225] hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600'">
                  <ClipboardList v-if="!addedToRequest" class="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  <CheckCircle2 v-else class="w-4 h-4 text-emerald-500" />
                  {{ addedToRequest ? `Saved (x${quantity})` : 'Save to Request' }}
               </button>
            </div>
        </div>
      </div>
    </div>

    <div class="h-px bg-gradient-to-r from-transparent via-[#EEEAF2] to-transparent mb-10"></div>

    <div class="mb-10">
       <h3 class="font-heading text-xl font-black text-[#1A1225] mb-6 uppercase tracking-tight">Product Highlights</h3>
       <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div v-for="(feature, idx) in productFeatures" :key="idx" 
            class="p-4 rounded-xl bg-[#F8F6FB] group hover:bg-primary-500/5 hover:shadow-md hover:shadow-primary-500/5 transition-all duration-300 cursor-default text-center">
             <div class="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-primary-500 shadow-sm mx-auto mb-3 group-hover:shadow-md transition-shadow">
                <component :is="getLucideIcon(feature.icon)" class="w-4 h-4" />
             </div>
             <h4 class="font-black text-[0.65rem] text-[#1A1225] uppercase tracking-tight leading-tight">{{ feature.title }}</h4>
             <p class="text-[0.55rem] text-slate-400 font-medium mt-1 leading-tight">{{ feature.desc }}</p>
          </div>
       </div>
    </div>

    <div class="h-px bg-gradient-to-r from-transparent via-[#EEEAF2] to-transparent mb-10"></div>

    <div class="mb-8">
      <h3 class="font-heading text-xl font-black text-[#1A1225] mb-6 uppercase tracking-tight">You may also like</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div v-for="rp in relatedProducts" :key="rp.id"
          class="group bg-white rounded-xl p-2.5 border border-[#EEEAF2] hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
          @click="goToProduct(rp.id)">
          <div class="w-full aspect-square bg-[#F5F3F7] rounded-lg mb-2 flex items-center justify-center overflow-hidden group-hover:bg-primary-500/5 transition-colors">
            <img v-if="rp.image" :src="rp.image" :alt="rp.name" class="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform duration-300" />
            <Package v-else class="w-6 h-6 text-[#EEEAF2]" />
          </div>
          <h4 class="font-black text-[0.6rem] text-[#1A1225] truncate mb-0.5 uppercase tracking-tight group-hover:text-primary-500 transition-colors">{{ rp.name }}</h4>
          <span class="text-[0.5rem] font-bold text-slate-400 mb-1 uppercase tracking-widest leading-none">{{ rp.businessName }}</span>
          <div class="flex items-center gap-0.5 mb-1">
            <Star v-for="n in 5" :key="n" class="w-2.5 h-2.5" :class="n <= Math.round(rp.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-slate-100'" />
          </div>
          <span class="text-[0.75rem] font-black text-primary-500 mt-auto">ETB {{ (rp.salePrice || rp.price).toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#EEEAF2] shadow-soft px-4 py-4 lg:hidden">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
          <p class="text-[0.625rem] font-black text-slate-400 truncate uppercase tracking-tight">{{ product.name }}</p>
          <p class="text-base font-black text-primary-500">ETB {{ (product.salePrice || product.price).toLocaleString() }}</p>
        </div>
        <button @click="chatWithBusiness" class="btn-gts-primary !px-10">
          <MessageSquare class="w-4 h-4" />
          Chat
        </button>
      </div>
    </div>

    <div class="h-16 lg:hidden"></div>
  </div>

  <div v-else class="flex flex-col items-center justify-center py-32 animate-fade-in bg-white rounded-3xl mx-4">
    <PackageOpen class="w-14 h-14 text-slate-200 mb-3 animate-pulse" />
    <h3 class="font-heading text-xl font-bold text-[#1A1225]">Loading...</h3>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '../../store/customerStore.js'
import { getLucideIcon } from '../../utils/icons.js'
import {
  ChevronRight, Package, PackageOpen, Truck, RotateCcw,
  ShieldCheck, BadgeCheck, Image as ImageIcon, MessageSquare,
  ClipboardList, CheckCircle2, Minus, Plus, Star
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const customerStore = useCustomerStore()

const productId = parseInt(route.params.id)
const product = computed(() => customerStore.getProductById(productId))

const quantity = ref(1)
const addedToRequest = ref(customerStore.requestList.some(item => item.id === productId))
const selectedImageIdx = ref(0)
const selectedImage = computed(() => thumbnailImages.value[selectedImageIdx.value] || product.value?.image)
const showAddedFeedback = ref(false)

const existingItem = customerStore.requestList.find(item => item.id === productId)
if (existingItem) {
  quantity.value = existingItem.quantity
}

const productShortDesc = computed(() => {
  const desc = product.value?.description || ''
  return desc.length > 120 ? desc.slice(0, 117) + '...' : desc
})

const thumbnailImages = computed(() => {
  const img = product.value?.image
  return img ? [img, img, img] : [null, null, null]
})

const productFeatures = computed(() => {
  if (!product.value) return []
  if (product.value.category === 'Electronics') {
    return [
      { icon: 'noise_aware', title: 'Clear Sound', desc: 'Deep bass, rich audio' },
      { icon: 'battery_charging_full', title: 'Long Battery', desc: 'Up to 30 hours' },
      { icon: 'bluetooth', title: 'Stable Connection', desc: 'Low-latency wireless' },
      { icon: 'speed', title: 'Smooth Performance', desc: 'Fast & responsive' },
      { icon: 'water_drop', title: 'Water Resistant', desc: 'IPX4 rated' },
      { icon: 'touch_app', title: 'Easy to Use', desc: 'Intuitive controls' }
    ]
  }
  return [
    { icon: 'diamond', title: 'Premium Quality', desc: 'Finest materials' },
    { icon: 'design_services', title: 'Unique Design', desc: 'Artisan crafted' },
    { icon: 'eco', title: 'Locally Sourced', desc: 'Ethically made' },
    { icon: 'local_shipping', title: 'Free Delivery', desc: 'Nationwide shipping' },
    { icon: 'verified', title: 'Verified Seller', desc: 'Trusted business' },
    { icon: 'support_agent', title: 'Fast Support', desc: 'Quick response' }
  ]
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return customerStore.allProducts
    .filter(p => p.id !== productId && p.category === product.value.category)
    .slice(0, 6)
    .concat(
      customerStore.allProducts
        .filter(p => p.id !== productId && p.category !== product.value.category)
        .slice(0, 6)
    )
    .slice(0, 6)
})

function decreaseQty() {
  if (quantity.value > 1) quantity.value--
}

function goToProduct(id) {
  router.push(`/customer/product/${id}`)
}

function addToRequestList() {
  customerStore.addToRequestList(productId, quantity.value)
  addedToRequest.value = true
}

function chatWithBusiness() {
  router.push({
    path: '/customer/chat',
    query: {
      type: 'product',
      product: product.value?.name,
      productId: product.value?.id,
      businessId: product.value?.businessId,
      provider: product.value?.businessName || 'Business',
      quantity: quantity.value,
      initialMessage: `Hi! I'm interested in ${product.value?.name} (x${quantity.value}). Could you share more details?`
    }
  })
}
</script>
