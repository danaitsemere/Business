<template>
  <div class="animate-fade-in max-w-7xl mx-auto py-8">
    <!-- Back to Home -->
    <button @click="$router.push('/customer/home')" class="flex items-center gap-2 text-primary-500 font-black text-sm hover:gap-3 transition-all mb-8">
      <span class="material-icons-round text-base">arrow_back</span> Back to Home
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Sidebar Column: Profile Summary & Image Upload -->
      <aside class="lg:col-span-4 space-y-6 sticky top-28">
        <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-soft text-center group">
          <!-- Profile Avatar with Upload Functionality -->
          <div class="relative w-40 h-40 mx-auto mb-8 cursor-pointer overflow-hidden rounded-3xl border-4 border-[#F8F6FB] group" @click="triggerFileInput">
            <div class="w-full h-full bg-[#1A1225] flex items-center justify-center text-white font-black text-5xl uppercase transition-transform duration-500 group-hover:scale-110">
               <img v-if="profileImage" :src="profileImage" class="w-full h-full object-cover">
               <span v-else>{{ user?.fullName?.charAt(0) || 'J' }}</span>
            </div>
            <!-- Overlay for Upload -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300 backdrop-blur-[2px]">
               <span class="material-icons-round text-3xl mb-1">cloud_upload</span>
               <span class="text-[0.625rem] font-black uppercase tracking-widest">Update Photo</span>
            </div>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload">
          </div>

          <template v-if="!isEditing">
             <h2 class="font-heading text-2xl font-black text-[#1A1225] mb-8">{{ user?.fullName || 'Julian Sterling' }}</h2>
             <button @click="isEditing = true" class="btn-gts-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 group shadow-soft transition-all active:scale-95">
               <span class="material-icons-round text-lg group-hover:rotate-12 transition-transform">edit</span>
               Edit Profile
             </button>
          </template>
          
          <template v-else>
             <div class="space-y-4">
                <input v-model="editForm.fullName" type="text" class="input-gts text-center font-black" placeholder="Full Name">
                <div class="flex gap-2">
                   <button @click="saveProfile" class="flex-1 btn-gts-primary !bg-tertiary-300 !text-[#1A1225] py-3 rounded-lg text-xs">Save</button>
                   <button @click="isEditing = false" class="flex-1 bg-neutral-100 text-[#475569] py-3 rounded-lg font-black text-xs">Cancel</button>
                </div>
             </div>
          </template>
        </div>

        <!-- Contact Details (Editable) -->
        <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-soft">
          <div class="flex items-center gap-3 mb-8">
             <span class="material-icons-round text-primary-500">contact_mail</span>
             <h4 class="font-heading text-lg font-black text-[#1A1225]">Identity Details</h4>
          </div>

          <div class="space-y-6">
             <div class="space-y-2">
                <span class="text-[0.625rem] font-extrabold text-neutral-500 uppercase tracking-widest">Email Address</span>
                <input v-if="isEditing" v-model="editForm.email" type="email" class="input-gts text-xs py-2">
                <p v-else class="text-sm font-black text-[#1A1225] truncate">{{ user?.email || 'julian.sterling@techcurator.com' }}</p>
             </div>
             <div class="space-y-2">
                <span class="text-[0.625rem] font-extrabold text-neutral-500 uppercase tracking-widest">Phone Extension</span>
                <input v-if="isEditing" v-model="editForm.phone" type="text" class="input-gts text-xs py-2">
                <p v-else class="text-sm font-black text-[#1A1225]">{{ user?.phone || '+1 (555) 234-8901' }}</p>
             </div>
             <div class="space-y-2">
                <span class="text-[0.625rem] font-extrabold text-neutral-500 uppercase tracking-widest">Terminal Location</span>
                <input v-if="isEditing" v-model="editForm.location" type="text" class="input-gts text-xs py-2">
                <p v-else class="text-sm font-black text-[#1A1225]">{{ user?.location || 'San Francisco, CA' }}</p>
             </div>
          </div>
        </div>
      </aside>

      <!-- Right Main Column: Service Requests -->
      <main class="lg:col-span-8 space-y-8">
        <div class="bg-white rounded-[2.5rem] p-10 lg:p-14 border border-[#EEEAF2] shadow-soft min-h-[600px]">
          <div class="flex items-center justify-between mb-10">
            <div>
               <h3 class="font-heading text-2xl font-black text-[#1A1225] mb-2 tracking-tight">Service Requests</h3>
               <p class="text-sm font-medium text-neutral-500">Track your service requests & orders</p>
            </div>
            <!-- Tab Switcher -->
            <div class="flex items-center gap-1 bg-[#F8F6FB] rounded-xl p-1">
              <button @click="activeSection = 'requests'" 
                class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                :class="activeSection === 'requests' ? 'bg-white text-[#1A1225] shadow-sm' : 'text-slate-400 hover:text-slate-600'">
                Requests
              </button>
              <button @click="activeSection = 'orders'" 
                class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                :class="activeSection === 'orders' ? 'bg-white text-[#1A1225] shadow-sm' : 'text-slate-400 hover:text-slate-600'">
                Orders
              </button>
            </div>
          </div>

          <!-- Service Requests Section -->
          <div v-if="activeSection === 'requests'" class="space-y-4">
            <div v-if="!allRequests.length" class="flex flex-col items-center justify-center py-20 opacity-30">
               <span class="material-icons-round text-[5rem] mb-4">engineering</span>
               <p class="font-black uppercase tracking-widest text-xs mb-2">No requests yet</p>
               <p class="text-xs text-slate-400 font-medium">Start by requesting a service from the Service Portal</p>
               <button @click="$router.push('/customer/home?tab=services')" class="mt-6 btn-gts-primary px-6 py-3 rounded-xl text-xs">
                 Browse Services
               </button>
            </div>

            <!-- Request Cards -->
            <div v-for="req in allRequests" :key="req.id" 
              class="bg-[#F8F6FB] rounded-2xl p-6 border border-transparent hover:border-primary-500/10 hover:bg-white transition-all duration-300">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ background: getServiceBg(req.serviceType) }">
                    <span class="material-icons-round text-lg" :style="{ color: getServiceColor(req.serviceType) }">{{ getServiceIcon(req.serviceType) }}</span>
                  </div>
                  <div>
                    <h4 class="font-black text-sm text-[#1A1225]">{{ req.serviceType }}</h4>
                    <p class="text-xs text-slate-400 font-bold">{{ req.providerName ? `Provider: ${req.providerName}` : 'Awaiting provider' }}</p>
                  </div>
                </div>
                <span class="px-3 py-1.5 rounded-lg text-[0.625rem] font-black uppercase tracking-widest border shadow-sm"
                  :class="statusClass(req.status)">
                  {{ req.status }}
                </span>
              </div>

              <p class="text-sm text-slate-500 font-medium mb-4 line-clamp-2">{{ req.description }}</p>

              <div class="flex items-center gap-6 text-xs font-bold text-slate-400 mb-4">
                <span class="flex items-center gap-1"><span class="material-icons-round text-sm">calendar_today</span> {{ formatDate(req.createdAt) }}</span>
                <span v-if="req.location" class="flex items-center gap-1"><span class="material-icons-round text-sm">location_on</span> {{ req.location }}</span>
                <span v-if="req.estimatedCost" class="flex items-center gap-1 text-primary-500"><span class="material-icons-round text-sm">payments</span> ${{ req.estimatedCost }}</span>
              </div>

              <!-- Timeline -->
              <div v-if="req.timeline && req.timeline.length" class="border-t border-[#EEEAF2] pt-4">
                <div class="flex items-center gap-2 overflow-x-auto pb-1">
                  <div v-for="(step, idx) in req.timeline" :key="idx" class="flex items-center gap-2 shrink-0">
                    <div class="flex flex-col items-center">
                      <div class="w-3 h-3 rounded-full" :class="timelineColor(step.status)"></div>
                    </div>
                    <span class="text-[0.625rem] font-black uppercase tracking-widest" :class="step.status === req.status ? 'text-[#1A1225]' : 'text-slate-300'">{{ step.label }}</span>
                    <span v-if="idx < req.timeline.length - 1" class="material-icons-round text-slate-200 text-sm">arrow_forward</span>
                  </div>
                </div>
              </div>

              <!-- Cancel action for pending requests -->
              <div v-if="req.status === 'submitted' || req.status === 'pending'" class="mt-4 flex justify-end">
                <button @click="customerStore.cancelServiceRequest(req.id)" class="text-xs font-black text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                  <span class="material-icons-round text-sm">cancel</span> Cancel Request
                </button>
              </div>
            </div>
          </div>

          <!-- Orders Section -->
          <div v-if="activeSection === 'orders'" class="space-y-4">
            <div v-if="!customerStore.orders.length" class="flex flex-col items-center justify-center py-20 opacity-30">
               <span class="material-icons-round text-[5rem] mb-4">shopping_bag</span>
               <p class="font-black uppercase tracking-widest text-xs mb-2">No orders yet</p>
               <p class="text-xs text-slate-400 font-medium">Your completed purchases will appear here</p>
            </div>

            <div v-for="order in customerStore.orders" :key="order.id"
              class="bg-[#F8F6FB] rounded-2xl p-6 border border-transparent hover:border-primary-500/10 hover:bg-white transition-all duration-300">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h4 class="font-black text-sm text-[#1A1225] mb-1">Order #{{ order.id }}</h4>
                  <p class="text-xs text-slate-400 font-bold">{{ formatDate(order.createdAt) }}</p>
                </div>
                <span class="px-3 py-1.5 rounded-lg text-[0.625rem] font-black uppercase tracking-widest bg-tertiary-300/20 text-tertiary-300 border border-tertiary-300/20 shadow-sm">
                  {{ order.status }}
                </span>
              </div>

              <div class="space-y-2 mb-4">
                <div v-for="item in order.items" :key="item.id" class="flex items-center gap-3 text-sm">
                  <span class="text-slate-400 font-bold">{{ item.quantity }}×</span>
                  <span class="font-black text-[#1A1225]">{{ item.name }}</span>
                  <span class="text-primary-500 font-bold ml-auto">${{ item.subtotal?.toLocaleString() }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between border-t border-[#EEEAF2] pt-4">
                <span class="text-sm font-black text-[#1A1225]">Total: ${{ order.total?.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
                
                <!-- Rating -->
                <div v-if="!order.rated" class="flex items-center gap-2">
                  <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Rate:</span>
                  <div class="flex items-center gap-0.5">
                    <span v-for="n in 5" :key="n" 
                      class="material-icons-round text-lg cursor-pointer hover:scale-125 transition-transform"
                      :class="n <= (hoverRating[order.id] || 0) ? 'text-amber-400' : 'text-slate-200'"
                      @mouseenter="hoverRating[order.id] = n"
                      @mouseleave="hoverRating[order.id] = 0"
                      @click="rateOrder(order.id, n)">
                      star
                    </span>
                  </div>
                </div>
                <div v-else class="flex items-center gap-1">
                  <span v-for="n in 5" :key="n" class="material-icons-round text-sm" :class="n <= order.rating ? 'text-amber-400' : 'text-slate-200'">star</span>
                  <span class="text-xs font-black text-slate-400 ml-1">Rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../store/authStore.js'
import { useCustomerStore } from '../../store/customerStore.js'

const authStore = useAuthStore()
const customerStore = useCustomerStore()
const user = computed(() => authStore.currentUser)

const isEditing = ref(false)
const fileInput = ref(null)
const profileImage = ref(null)
const activeSection = ref('requests')
const hoverRating = reactive({})

const editForm = ref({
  fullName: '',
  email: '',
  phone: '',
  location: ''
})

// Combine localStorage requests with some mock initial data
const allRequests = computed(() => {
  if (customerStore.serviceRequests.length > 0) {
    return customerStore.serviceRequests
  }
  // Default mock requests for first-time view
  return mockRequests
})

const mockRequests = [
  {
    id: 'mock-1',
    serviceType: 'Delivery',
    providerName: 'FastShip Ltd',
    description: 'Express delivery of hardware components from warehouse to office location in Business Bay.',
    status: 'accepted',
    createdAt: '2026-04-01T10:00:00Z',
    location: 'Dubai, Business Bay',
    estimatedCost: 45,
    timeline: [
      { status: 'submitted', date: '2026-04-01T10:00:00Z', label: 'Submitted' },
      { status: 'pending', date: '2026-04-01T10:30:00Z', label: 'Pending' },
      { status: 'accepted', date: '2026-04-01T11:00:00Z', label: 'Accepted' }
    ]
  },
  {
    id: 'mock-2',
    serviceType: 'Web Development',
    providerName: 'CodeForge Labs',
    description: 'Full-stack e-commerce platform development with payment integration.',
    status: 'in-progress',
    createdAt: '2026-03-28T14:00:00Z',
    location: 'Remote',
    estimatedCost: 2500,
    timeline: [
      { status: 'submitted', date: '2026-03-28T14:00:00Z', label: 'Submitted' },
      { status: 'accepted', date: '2026-03-28T16:00:00Z', label: 'Accepted' },
      { status: 'in-progress', date: '2026-03-29T09:00:00Z', label: 'In Progress' }
    ]
  },
  {
    id: 'mock-3',
    serviceType: 'Photography',
    providerName: 'LensArch Studio',
    description: 'Professional product photography for new electronics line (20 products).',
    status: 'completed',
    createdAt: '2026-03-20T09:00:00Z',
    location: 'Dubai Studio City',
    estimatedCost: 350,
    timeline: [
      { status: 'submitted', date: '2026-03-20T09:00:00Z', label: 'Submitted' },
      { status: 'accepted', date: '2026-03-20T10:00:00Z', label: 'Accepted' },
      { status: 'in-progress', date: '2026-03-21T08:00:00Z', label: 'In Progress' },
      { status: 'completed', date: '2026-03-22T17:00:00Z', label: 'Completed' }
    ]
  }
]

onMounted(() => {
   if (user.value) {
      editForm.value = {
         fullName: user.value.fullName || 'Julian Sterling',
         email: user.value.email || 'julian.sterling@techcurator.com',
         phone: user.value.phone || '+1 (555) 234-8901',
         location: user.value.location || 'San Francisco, CA'
      }
   }
   profileImage.value = localStorage.getItem('gts_profile_img')
})

function triggerFileInput() {
   fileInput.value.click()
}

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
   if (authStore.currentUser) {
      authStore.currentUser.fullName = editForm.value.fullName
      authStore.currentUser.email = editForm.value.email
      authStore.currentUser.phone = editForm.value.phone
      authStore.currentUser.location = editForm.value.location
   }
   isEditing.value = false
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function rateOrder(orderId, rating) {
  customerStore.rateOrder(orderId, rating)
}

// Service type styling helpers
const serviceStyleMap = {
  'Delivery': { icon: 'local_shipping', bg: 'rgba(118,48,163,0.12)', color: '#a854dc' },
  'Payment Processing': { icon: 'payment', bg: 'rgba(100,210,177,0.12)', color: '#64D2B1' },
  'Marketing': { icon: 'campaign', bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  'Photography': { icon: 'camera_alt', bg: 'rgba(236,72,153,0.12)', color: '#ec4899' },
  'Web Development': { icon: 'code', bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  'Consulting': { icon: 'groups', bg: 'rgba(239,68,68,0.12)', color: '#f87171' }
}

function getServiceIcon(type) { return serviceStyleMap[type]?.icon || 'engineering' }
function getServiceBg(type) { return serviceStyleMap[type]?.bg || 'rgba(118,48,163,0.1)' }
function getServiceColor(type) { return serviceStyleMap[type]?.color || '#7630A3' }

function statusClass(status) {
  const map = {
    'submitted': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'accepted': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'in-progress': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'completed': 'bg-tertiary-300/20 text-tertiary-300 border-tertiary-300/20',
    'rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
    'cancelled': 'bg-red-500/10 text-red-500 border-red-500/20'
  }
  return map[status] || 'bg-slate-100 text-slate-500 border-slate-200'
}

function timelineColor(status) {
  const map = {
    'submitted': 'bg-blue-400',
    'pending': 'bg-amber-400',
    'accepted': 'bg-blue-500',
    'in-progress': 'bg-purple-500',
    'completed': 'bg-tertiary-300',
    'rejected': 'bg-red-400',
    'cancelled': 'bg-red-400'
  }
  return map[status] || 'bg-slate-300'
}
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 10px 40px -10px rgba(118, 48, 163, 0.08);
}
</style>
