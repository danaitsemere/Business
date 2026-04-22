<template>
  <div class="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-6 sm:py-8 text-left">
    <button @click="$router.push('/customer/home')" class="btn-gts-secondary !rounded-full !px-6 mb-8">
      <ArrowLeft class="w-4 h-4" /> Back to Home
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <aside class="lg:col-span-4 space-y-6 lg:sticky lg:top-28 text-left">
        <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-[0_10px_40px_-10px_rgba(118,48,163,0.08)] text-center group">
          <div class="relative w-40 h-40 mx-auto mb-8 cursor-pointer overflow-hidden rounded-3xl border-4 border-[#F8F6FB] group" @click="triggerFileInput">
            <div class="w-full h-full bg-[#1A1225] flex items-center justify-center text-white font-black text-5xl uppercase transition-transform duration-500 group-hover:scale-110">
               <img v-if="profileImage" :src="profileImage" class="w-full h-full object-cover">
               <span v-else>{{ user?.fullName?.charAt(0) || 'K' }}</span>
            </div>
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300 backdrop-blur-[2px]">
               <CloudUpload class="w-8 h-8 mb-1" />
               <span class="text-[0.625rem] font-black uppercase tracking-widest">Update Photo</span>
            </div>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload">
          </div>

          <template v-if="!isEditing">
             <h2 class="font-heading text-2xl font-black text-[#1A1225] mb-8 uppercase tracking-tight">{{ user?.fullName || 'Kalkidan Abera' }}</h2>
             <div class="space-y-3">
               <button @click="isEditing = true" class="btn-gts-primary w-full group">
                 <Pencil class="w-5 h-5 group-hover:rotate-12 transition-transform" />
                 Edit Profile
               </button>
               <button @click="handleSignOut" class="btn-gts w-full !bg-orange-500 !text-white hover:-translate-y-0.5 hover:brightness-110 group">
                 <LogOut class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                 Sign Out
               </button>
             </div>
          </template>
          
          <template v-else>
             <div class="space-y-4">
                <input v-model="editForm.fullName" type="text" class="input-gts text-center font-black" placeholder="Full Name">
                <div class="flex gap-2">
                   <button @click="saveProfile" class="flex-1 btn-gts-tertiary">Save</button>
                   <button @click="isEditing = false" class="flex-1 btn-gts-secondary">Cancel</button>
                </div>
             </div>
          </template>
        </div>

        <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-[0_10px_40px_-10px_rgba(118,48,163,0.08)]">
          <div class="flex items-center gap-3 mb-8">
             <Contact class="w-5 h-5 text-primary-500" />
             <h4 class="font-heading text-base font-black text-[#1A1225] uppercase tracking-tight">Identity Details</h4>
          </div>

          <div class="space-y-6">
             <div class="space-y-2">
                <span class="text-[0.625rem] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</span>
                <input v-if="isEditing" v-model="editForm.email" type="email" class="input-gts text-xs py-2">
                <p v-else class="text-sm font-black text-[#1A1225] truncate">{{ user?.email || 'kalkidan@gts.et' }}</p>
             </div>
             <div class="space-y-2">
                <span class="text-[0.625rem] font-extrabold text-slate-400 uppercase tracking-widest">Phone</span>
                <input v-if="isEditing" v-model="editForm.phone" type="text" class="input-gts text-xs py-2">
                <p v-else class="text-sm font-black text-[#1A1225]">{{ user?.phone || '+251912345678' }}</p>
             </div>
             <div class="space-y-2">
                <span class="text-[0.625rem] font-extrabold text-slate-400 uppercase tracking-widest">Location</span>
                <input v-if="isEditing" v-model="editForm.location" type="text" class="input-gts text-xs py-2">
                <p v-else class="text-sm font-black text-[#1A1225]">{{ user?.location || 'Addis Ababa, Ethiopia' }}</p>
             </div>
          </div>
        </div>
      </aside>

      <main class="lg:col-span-8 space-y-8 text-left">
        <div class="bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 lg:p-14 border border-[#EEEAF2] shadow-[0_10px_40px_-10px_rgba(118,48,163,0.08)] min-h-[400px] sm:min-h-[600px]">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <div>
               <h3 class="font-heading text-2xl sm:text-3xl font-black text-[#1A1225] mb-1 sm:mb-2 tracking-tight">Orders</h3>
               <p class="text-[0.6rem] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Track your product and service requests</p>
            </div>

            <div class="flex items-center gap-1 bg-[#F8F6FB] rounded-xl p-1 shrink-0">
              <button @click="activeRequestTab = 'products'" 
                class="btn-gts px-8 !rounded-lg"
                :class="activeRequestTab === 'products' ? 'bg-white text-primary-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 border-transparent'">
                Products
              </button>
              <button @click="activeRequestTab = 'services'" 
                class="btn-gts px-8 !rounded-lg"
                :class="activeRequestTab === 'services' ? 'bg-white text-primary-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 border-transparent'">
                Services
              </button>
            </div>
          </div>

          <div v-if="activeRequestTab === 'products'" class="space-y-4">
            <div v-if="!productRequests.length" class="flex flex-col items-center justify-center py-20 text-center opacity-30">
               <Package class="w-20 h-20 mb-4" />
               <p class="font-black uppercase tracking-widest text-xs mb-2">No product requests yet</p>
               <p class="text-xs text-slate-400 font-medium">Browse products to start a conversation</p>
               <button @click="$router.push('/customer/home')" class="mt-6 btn-gts-primary">
                 Browse Products
               </button>
            </div>

            <div v-for="req in paginatedProductRequests" :key="req.id" 
              class="bg-[#F8F6FB] rounded-2xl p-6 border border-transparent hover:border-primary-500/10 hover:bg-white transition-all duration-300">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <Package class="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <p class="text-[0.6rem] text-primary-500 font-black uppercase tracking-widest mb-0.5">Product Request</p>
                    <h4 class="font-black text-sm text-[#1A1225] uppercase tracking-tight">
                      {{ req.providerName || 'Business' }}
                    </h4>
                  </div>
                </div>
                <span class="px-3 py-1.5 rounded-lg text-[0.563rem] font-black uppercase tracking-widest border shadow-sm"
                  :class="statusClass(req.status)">
                  {{ statusLabel(req.status) }}
                </span>
              </div>

              <div v-if="req.items && req.items.length" class="space-y-2 mb-3">
                <div v-for="(item, idx) in req.items" :key="idx" class="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-[#EEEAF2]">
                  <span class="text-xs font-black text-[#1A1225] uppercase tracking-tight">{{ item.name }} <span class="text-primary-500">x{{ item.quantity }}</span></span>
                  <span v-if="item.price > 0" class="text-xs font-black text-slate-500">ETB {{ (item.price * item.quantity).toLocaleString() }}</span>
                </div>
              </div>
              <div v-else class="mb-3">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ req.productName || 'Product Request' }}</p>
              </div>

              <div class="flex flex-wrap items-center gap-4 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-4">
                <span v-if="req.totalPrice" class="flex items-center gap-1.5 text-[#1A1225]">Total: ETB {{ req.totalPrice.toLocaleString() }}</span>
                <span class="flex items-center gap-1.5"><Calendar class="w-3.5 h-3.5" /> {{ formatDate(req.createdAt) }}</span>
                <span v-if="req.deliveryDate" class="flex items-center gap-1.5"><Truck class="w-3.5 h-3.5" /> Delivery: {{ formatDate(req.deliveryDate) }}</span>
              </div>

              <div v-if="req.status === 'completed' && !req.rated" class="border-t border-[#EEEAF2] pt-4 flex items-center justify-between">
                <span class="text-[0.625rem] font-black text-slate-400 uppercase tracking-widest">Rate:</span>
                <div class="flex items-center gap-1">
                  <Star v-for="n in 5" :key="n" 
                    class="w-5 h-5 cursor-pointer hover:scale-125 transition-transform"
                    :class="n <= (hoverRating[req.id] || 0) ? 'text-amber-400 fill-current' : 'text-slate-100'"
                    @mouseenter="hoverRating[req.id] = n"
                    @mouseleave="hoverRating[req.id] = 0"
                    @click="rateRequestHandler(req.id, n)" />
                </div>
              </div>
              <div v-if="req.rated" class="border-t border-[#EEEAF2] pt-4 flex items-center gap-2">
                <Star v-for="n in 5" :key="n" class="w-4 h-4 text-amber-400 fill-current" :class="n > req.rating ? 'opacity-20' : ''" />
                <span class="text-[0.625rem] font-black text-slate-400 uppercase tracking-widest ml-1">Rated</span>
              </div>

              <div class="flex items-center gap-3 mt-4">
                <button v-if="req.status === 'pending'" @click="customerStore.cancelServiceRequest(req.id)" class="btn-gts-secondary !bg-red-50 !text-red-500 !border-red-100 !px-8">
                  <XCircle class="w-4 h-4" /> Cancel
                </button>
                <button @click="openChat(req)" class="btn-gts-secondary !px-8 ml-auto">
                  <MessageSquare class="w-4 h-4" /> View Chat
                </button>
              </div>
            </div>

            <div v-if="productRequests.length > perPage" class="flex items-center justify-center gap-2 mt-10">
              <button @click="productPage = Math.max(1, productPage - 1)" :disabled="productPage === 1"
                class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm border border-[#EEEAF2]">
                <ChevronLeft class="w-5 h-5" />
              </button>
              <span class="mx-4 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">
                {{ productPage }} / {{ totalProductPages }}
              </span>
              <button @click="productPage = Math.min(totalProductPages, productPage + 1)" :disabled="productPage === totalProductPages"
                class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm border border-[#EEEAF2]">
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div v-if="activeRequestTab === 'services'" class="space-y-4">
            <div v-if="!serviceRequests.length" class="flex flex-col items-center justify-center py-20 text-center opacity-30">
               <div class="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                 <Wrench class="w-10 h-10 text-slate-300" />
               </div>
               <p class="font-black uppercase tracking-widest text-xs mb-2">No service requests yet</p>
               <p class="text-xs text-slate-400 font-medium">Browse verified services to start a request</p>
               <button @click="$router.push('/customer/home?tab=services')" class="mt-6 btn-gts-primary">
                 Browse Services
               </button>
            </div>

            <div v-for="req in paginatedServiceRequests" :key="req.id" 
              class="bg-[#F8F6FB] rounded-2xl p-6 border border-transparent hover:border-primary-500/10 hover:bg-white transition-all duration-300">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" :style="{ background: getServiceBg(req.serviceType) }">
                    <component :is="getLucideIcon(getServiceIcon(req.serviceType))" class="w-6 h-6" :style="{ color: getServiceColor(req.serviceType) }" />
                  </div>
                  <div>
                    <p class="text-[0.6rem] text-primary-500 font-black uppercase tracking-widest mb-0.5">Service Request</p>
                    <h4 class="font-black text-sm text-[#1A1225] uppercase tracking-tight">{{ req.serviceType }}</h4>
                    <p class="text-[0.625rem] text-slate-400 font-bold uppercase tracking-widest">{{ req.providerName ? `Provider: ${req.providerName}` : 'Awaiting provider' }}</p>
                  </div>
                </div>
                <span class="px-3 py-1.5 rounded-lg text-[0.563rem] font-black uppercase tracking-widest border shadow-sm"
                  :class="statusClass(req.status)">
                  {{ statusLabel(req.status) }}
                </span>
              </div>

              <p v-if="req.description" class="text-sm text-slate-500 font-medium mb-3 leading-relaxed">{{ req.description }}</p>

              <div v-if="req.items && req.items.length" class="space-y-2 mb-3">
                <div v-for="(item, idx) in req.items" :key="idx" class="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-[#EEEAF2]">
                  <span class="text-xs font-black text-[#1A1225] uppercase tracking-tight">{{ item.name }} <span class="text-primary-500">x{{ item.quantity }}</span></span>
                  <span v-if="item.price > 0" class="text-xs font-black text-slate-500">ETB {{ (item.price * item.quantity).toLocaleString() }}</span>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-3 sm:gap-6 text-[0.625rem] font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-6 border-b border-[#EEEAF2] pb-4 sm:pb-6">
                <span v-if="req.totalPrice" class="flex items-center gap-1.5 text-[#1A1225]">Budget: ETB {{ req.totalPrice.toLocaleString() }}</span>
                <span v-else class="flex items-center gap-1.5 text-slate-400"><Wallet class="w-3.5 h-3.5" /> To be quoted</span>
                <span class="flex items-center gap-1.5"><Calendar class="w-4 h-4" /> {{ formatDate(req.createdAt) }}</span>
                <span v-if="req.deliveryDate" class="flex items-center gap-1.5"><Truck class="w-3.5 h-3.5" /> Needed By: {{ formatDate(req.deliveryDate) }}</span>
                <span v-if="req.location" class="flex items-center gap-1.5"><MapPin class="w-4 h-4" /> {{ req.location }}</span>
              </div>
              
              <div v-if="req.status === 'completed' && !req.rated" class="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-[#EEEAF2] shadow-sm">
                <span class="text-[0.625rem] font-black text-[#1A1225] uppercase tracking-widest">Rate Service Provider:</span>
                <div class="flex items-center gap-1">
                  <Star v-for="n in 5" :key="n" 
                    class="w-6 h-6 cursor-pointer hover:scale-125 transition-transform"
                    :class="n <= (hoverRating[req.id] || 0) ? 'text-amber-400 fill-current' : 'text-slate-100'"
                    @mouseenter="hoverRating[req.id] = n"
                    @mouseleave="hoverRating[req.id] = 0"
                    @click="rateRequestHandler(req.id, n)" />
                </div>
              </div>
              <div v-if="req.rated" class="mb-6 flex items-center gap-2 bg-white/50 px-4 py-2 rounded-lg inline-flex border border-tertiary-300/20">
                <Star v-for="n in 5" :key="n" class="w-4 h-4 text-amber-400 fill-current" :class="n > req.rating ? 'opacity-20' : ''" />
                <span class="text-[0.625rem] font-black text-tertiary-300 uppercase tracking-widest ml-1">Service Rated</span>
              </div>

              <div class="flex items-center gap-4">
                <button v-if="req.status === 'pending'" @click="customerStore.cancelServiceRequest(req.id)" class="btn-gts-secondary !bg-red-50 !text-red-500 !border-red-100 !px-8">
                  <XCircle class="w-4 h-4" /> Cancel
                </button>
                <button @click="openChat(req)" class="btn-gts-primary flex-1">
                  <MessageSquare class="w-4 h-4" /> Open Chat Interface
                </button>
              </div>
            </div>

            <div v-if="serviceRequests.length > perPage" class="flex items-center justify-center gap-2 mt-10">
              <button @click="servicePage = Math.max(1, servicePage - 1)" :disabled="servicePage === 1"
                class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm border border-[#EEEAF2]">
                <ChevronLeft class="w-5 h-5" />
              </button>
              <span class="mx-4 text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">
                {{ servicePage }} / {{ totalServicePages }}
              </span>
              <button @click="servicePage = Math.min(totalServicePages, servicePage + 1)" :disabled="servicePage === totalServicePages"
                class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm border border-[#EEEAF2]">
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore.js'
import { useCustomerStore } from '../../store/customerStore.js'
import { getLucideIcon } from '../../utils/icons.js'
import {
  ArrowLeft, ArrowRight, CloudUpload, Pencil, LogOut, Contact,
  Wrench, Calendar, MapPin, Wallet, XCircle, Package, Star, MessageSquare, Truck
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const customerStore = useCustomerStore()
const user = computed(() => authStore.currentUser)

function handleSignOut() {
  authStore.logout()
  router.push('/')
}

const isEditing = ref(false)
const fileInput = ref(null)
const profileImage = ref(null)
const activeRequestTab = ref(localStorage.getItem('gts_active_order_tab') || 'products')
const hoverRating = reactive({})

const perPage = 3
const productPage = ref(1)
const servicePage = ref(1)

watch(activeRequestTab, (v) => {
  localStorage.setItem('gts_active_order_tab', v)
  productPage.value = 1
  servicePage.value = 1
})

const editForm = ref({
  fullName: '',
  email: '',
  phone: '',
  location: ''
})

const mockProductRequests = [
  {
    id: 'mock-p1',
    type: 'product',
    productName: 'Wireless Bluetooth Headphones',
    providerName: 'Habesha Electronics',
    businessId: 1,
    productId: 1,
    items: [{ name: 'Wireless Bluetooth Headphones', quantity: 10, price: 249.99 }],
    totalPrice: 2499.90,
    deliveryDate: '2026-04-10T00:00:00Z',
    status: 'accepted',
    createdAt: '2026-04-05T10:00:00Z',
    rated: false, rating: 0,
  },
  {
    id: 'mock-p2',
    type: 'product',
    productName: 'Designer Silk Scarf',
    providerName: 'Selam Fashion House',
    businessId: 2,
    productId: 5,
    items: [{ name: 'Designer Silk Scarf', quantity: 3, price: 189.99 }],
    totalPrice: 569.97,
    deliveryDate: '2026-04-15T00:00:00Z',
    status: 'pending',
    createdAt: '2026-04-12T14:30:00Z',
    rated: false, rating: 0,
  },
  {
    id: 'mock-p3',
    type: 'product',
    productName: 'Organic Coffee Beans',
    providerName: 'Sheger Organic Foods',
    businessId: 3,
    productId: 9,
    items: [{ name: 'Organic Coffee Beans (1kg)', quantity: 5, price: 120 }],
    totalPrice: 600,
    deliveryDate: '2026-04-20T00:00:00Z',
    status: 'in-progress',
    createdAt: '2026-04-10T08:00:00Z',
    rated: false, rating: 0,
  },
  {
    id: 'mock-p4',
    type: 'product',
    productName: 'Leather Messenger Bag',
    providerName: 'Addis Craft Studio',
    businessId: 5,
    productId: 11,
    items: [{ name: 'Handcrafted Leather Messenger Bag', quantity: 2, price: 450 }],
    totalPrice: 900,
    deliveryDate: '2026-04-25T00:00:00Z',
    status: 'completed',
    createdAt: '2026-04-02T11:00:00Z',
    rated: true, rating: 4,
  }
]

const mockServiceRequests = [
  {
    id: 'mock-s1',
    type: 'service',
    serviceType: 'Delivery',
    providerName: 'Anbessa Logistics',
    businessId: 4,
    description: 'Need express delivery for 5 boxes of hardware components from Bole to Merkato warehouse before Friday.',
    items: [{ name: 'Express Delivery', quantity: 1, price: 500 }],
    totalPrice: 500,
    deliveryDate: '2026-04-03T00:00:00Z',
    status: 'completed',
    createdAt: '2026-04-01T10:00:00Z',
    location: 'Addis Ababa, Bole',
    rated: true, rating: 5,
  },
  {
    id: 'mock-s2',
    type: 'service',
    serviceType: 'Consulting',
    providerName: 'Zara Business Solutions',
    businessId: 7,
    description: 'Looking for a business consultant to help with market entry strategy for our new organic skincare line.',
    items: [{ name: 'Business Consulting', quantity: 1, price: 0 }],
    totalPrice: 0,
    deliveryDate: '2026-04-30T00:00:00Z',
    status: 'pending',
    createdAt: '2026-04-14T09:00:00Z',
    rated: false, rating: 0,
  },
  {
    id: 'mock-s3',
    type: 'service',
    serviceType: 'Web Development',
    providerName: 'Habesha Electronics',
    businessId: 1,
    description: 'Build a responsive e-commerce website with product catalog, shopping cart, and payment integration.',
    items: [{ name: 'Full-Stack Web Development', quantity: 1, price: 15000 }],
    totalPrice: 15000,
    deliveryDate: '2026-05-15T00:00:00Z',
    status: 'accepted',
    createdAt: '2026-04-08T14:00:00Z',
    rated: false, rating: 0,
  },
  {
    id: 'mock-s4',
    type: 'service',
    serviceType: 'Photography',
    providerName: 'Selam Fashion House',
    businessId: 2,
    description: 'Professional product photography session for 50 items in our new summer collection.',
    items: [{ name: 'Product Photography (50 items)', quantity: 1, price: 3500 }],
    totalPrice: 3500,
    deliveryDate: '2026-04-22T00:00:00Z',
    status: 'in-progress',
    createdAt: '2026-04-11T16:00:00Z',
    rated: false, rating: 0,
  }
]

const productRequests = computed(() => {
  const storeReqs = customerStore.serviceRequests.filter(r => r.type === 'product' || r.type === 'request-list')
  if (storeReqs.length > 0) return storeReqs
  return mockProductRequests
})

const serviceRequests = computed(() => {
  const storeReqs = customerStore.serviceRequests.filter(r => r.type === 'service')
  if (storeReqs.length > 0) return storeReqs
  return mockServiceRequests
})

const totalProductPages = computed(() => Math.max(1, Math.ceil(productRequests.value.length / perPage)))
const totalServicePages = computed(() => Math.max(1, Math.ceil(serviceRequests.value.length / perPage)))

const paginatedProductRequests = computed(() => {
  const start = (productPage.value - 1) * perPage
  return productRequests.value.slice(start, start + perPage)
})

const paginatedServiceRequests = computed(() => {
  const start = (servicePage.value - 1) * perPage
  return serviceRequests.value.slice(start, start + perPage)
})

onMounted(() => {
  const savedProfile = JSON.parse(localStorage.getItem('gts_profile_data') || 'null')
  if (savedProfile) {
    editForm.value = { ...savedProfile }
  } else if (user.value) {
    editForm.value = {
      fullName: user.value.fullName || 'Kalkidan Abera',
      email: user.value.email || 'kalkidan@gts.et',
      phone: user.value.phone || '+251912345678',
      location: user.value.location || 'Addis Ababa, Ethiopia'
    }
  }
  profileImage.value = localStorage.getItem('gts_profile_img')
})

function triggerFileInput() { fileInput.value.click() }

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result
      localStorage.setItem('gts_profile_img', e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

function saveProfile() {
  authStore.updateProfile({
    fullName: editForm.value.fullName,
    email: editForm.value.email,
    phone: editForm.value.phone,
    location: editForm.value.location
  })
  localStorage.setItem('gts_profile_data', JSON.stringify(editForm.value))
  isEditing.value = false
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function rateRequestHandler(requestId, rating) {
  customerStore.rateRequest(requestId, rating)
}

function openChat(req) {
  router.push({
    path: '/customer/chat',
    query: {
      type: req.type || 'service',
      provider: req.providerName,
      product: req.productName || '',
      productId: req.productId || '',
      businessId: req.businessId || '',
      serviceType: req.serviceType || 'Product',
      requestId: req.id,
      quantity: req.quantity || (req.items?.[0]?.quantity) || 1
    }
  })
}

function statusLabel(status) {
  const map = {
    'pending': 'Pending', 'accepted': 'Accepted',
    'in-progress': 'In Progress', 'completed': 'Completed',
    'rejected': 'Rejected', 'cancelled': 'Cancelled', 'rated': 'Rated'
  }
  return map[status] || status
}

const serviceStyleMap = {
  'Delivery': { icon: 'local_shipping', bg: 'rgba(118,48,163,0.12)', color: '#a854dc' },
  'Marketing': { icon: 'campaign', bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  'Photography': { icon: 'camera_alt', bg: 'rgba(236,72,153,0.12)', color: '#ec4899' },
  'Web Development': { icon: 'code', bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  'Consulting': { icon: 'groups', bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
  'Product': { icon: 'inventory_2', bg: 'rgba(118,48,163,0.12)', color: '#7630A3' }
}

function getServiceIcon(type) { return serviceStyleMap[type]?.icon || 'engineering' }
function getServiceBg(type) { return serviceStyleMap[type]?.bg || 'rgba(118,48,163,0.1)' }
function getServiceColor(type) { return serviceStyleMap[type]?.color || '#7630A3' }

function statusClass(status) {
  const map = {
    'pending': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'accepted': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'in-progress': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'completed': 'bg-tertiary-300/20 text-tertiary-300 border-tertiary-300/20',
    'rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
    'cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
    'rated': 'bg-amber-400/10 text-amber-600 border-amber-400/20'
  }
  return map[status] || 'bg-slate-100 text-slate-500 border-slate-200'
}
</script>