<template>
  <div class="flex flex-col min-h-screen bg-[#F8F6FB]">

    <header class="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-[#EEEAF2] px-6 lg:px-12 py-5">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
      
        <div class="flex items-center gap-6 cursor-pointer group" @click="$router.push('/customer/home')">
          <img src="../assets/logo.png" alt="GTS Logo" class="h-14 w-auto group-hover:scale-105 transition-transform duration-300">
          <div class="h-12 w-[1.5px] bg-[#7630A3] opacity-30"></div>
          <div class="flex flex-col justify-center text-left">
             <span class="font-heading text-xl font-black text-[#7630A3] leading-none mb-1 tracking-tight">
                Grand Technology Solutions
             </span>
             <span class="text-[0.625rem] font-black uppercase tracking-[0.3em] text-[#7630A3]">
                Innovate • Inspire • Transform
             </span>
          </div>
        </div>


        <nav class="hidden xl:flex items-center gap-1 ml-auto mr-8">
          <button v-for="item in menuItems" :key="item.label"
            class="text-[0.688rem] font-black uppercase tracking-[0.1em] transition-all px-4 py-2 rounded-xl"
            :class="isTabActive(item) ? 'bg-primary-500/5 text-primary-500' : 'text-secondary-400 hover:text-secondary-600'"
            @click="navigateTo(item)">
            {{ item.label }}
          </button>
        </nav>

        <div class="flex items-center gap-3 lg:gap-6">
          <div class="flex items-center gap-4">
             <div class="relative cursor-pointer transition-all duration-300 transform hover:scale-110" 
               :class="wishlistCount > 0 ? 'text-tertiary-300' : 'text-secondary-300 hover:text-primary-500'"
               @click="activeDrawer = 'wishlist'">
               <span class="material-icons-round text-2xl">{{ wishlistCount > 0 ? 'favorite' : 'favorite_border' }}</span>
               <span v-if="wishlistCount > 0" class="absolute -top-2 -right-2 w-5 h-5 bg-tertiary-300 text-[#1A1225] text-[0.625rem] font-black rounded-full flex items-center justify-center border-2 border-white shadow-glow-tertiary">
                 {{ wishlistCount }}
               </span>
             </div>
             <div class="relative cursor-pointer transition-all duration-300 transform hover:scale-110" 
               :class="cartCount > 0 ? 'text-tertiary-300' : 'text-secondary-300 hover:text-primary-500'"
               @click="activeDrawer = 'cart'">
               <span class="material-icons-round text-2xl">shopping_cart</span>
               <span v-if="cartCount > 0" class="absolute -top-2 -right-2 w-5 h-5 bg-tertiary-300 text-[#1A1225] text-[0.625rem] font-black rounded-full flex items-center justify-center border-2 border-white shadow-glow-tertiary">
                 {{ cartCount }}
               </span>
             </div>
          </div>
          <div class="h-8 w-[1px] bg-[#EEEAF2] hidden sm:block"></div>
          <div class="flex items-center gap-3 cursor-pointer group" @click="$router.push('/customer/profile')">
             <div class="w-11 h-11 rounded-full border-2 border-primary-500/20 p-0.5 group-hover:border-primary-500 transition-all duration-300 flex items-center justify-center overflow-hidden bg-[#F5F3F7] shadow-sm">
                <img v-if="profileImg" :src="profileImg" class="w-full h-full object-cover rounded-full">
                <div v-else class="avatar-gts w-full h-full rounded-full text-sm uppercase font-black flex items-center justify-center bg-primary-500 text-white">
                   {{ user?.fullName?.charAt(0) || 'K' }}
                </div>
             </div>
             <div class="hidden md:block text-left">
               <span class="block text-sm font-black text-[#1A1225] leading-none group-hover:text-primary-500 transition-colors uppercase tracking-tight">{{ user?.fullName || 'Kalkidan Abera' }}</span>
             </div>
          </div>
        </div>
      </div>
    </header>


    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition duration-200 ease-in" leave-from-class="translate-x-0" leave-to-class="translate-x-full">
      <aside v-if="activeDrawer" class="fixed top-0 right-0 z-[200] w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-[#EEEAF2]">
         <div class="p-8 border-b border-[#EEEAF2] flex items-center justify-between">
            <h2 class="font-heading text-xl font-black text-[#1A1225] flex items-center gap-3">
               <span class="material-icons-round text-tertiary-300">{{ activeDrawer === 'cart' ? 'shopping_cart' : 'favorite' }}</span>
               {{ activeDrawer === 'cart' ? 'Shopping Cart' : 'My Wishlist' }}
            </h2>
            <button @click="activeDrawer = null" class="w-10 h-10 rounded-xl bg-[#F8F6FB] text-secondary-300 hover:text-primary-500 flex items-center justify-center transition-colors">
               <span class="material-icons-round">close</span>
            </button>
         </div>

         <div class="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
          
            <template v-if="activeDrawer === 'cart'">
               <div v-if="!cartItems.length" class="flex flex-col items-center justify-center py-16 text-center opacity-50">
                 <span class="material-icons-round text-5xl mb-3">shopping_cart</span>
                 <p class="font-black text-sm uppercase tracking-widest">Your cart is empty</p>
                 <p class="text-xs text-slate-400 mt-1 font-medium">Browse products to add items</p>
               </div>
               <div v-for="item in cartItems" :key="item.id" class="flex gap-4 p-4 bg-[#F8F6FB] rounded-2xl border border-transparent hover:border-primary-500/10 hover:bg-white transition-all duration-300 group">
                  <div class="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-[#EEEAF2] shrink-0 overflow-hidden">
                     <img v-if="item.details?.image" :src="item.details.image" :alt="item.details?.name" class="w-full h-full object-contain p-1.5 mix-blend-multiply" />
                     <span v-else class="material-icons-round text-neutral-300 opacity-30 text-3xl">inventory_2</span>
                  </div>
                  <div class="flex-1 min-w-0">
                     <h4 class="font-black text-xs text-[#1A1225] truncate mb-1">{{ item.details?.name }}</h4>
                     <p class="text-xs text-primary-500 font-black tracking-tighter mb-3">ETB {{ (item.details?.salePrice || item.details?.price || 0).toLocaleString() }} × {{ item.quantity }}</p>
                     <div class="flex items-center gap-3">
                        <button @click="customerStore.updateCartQuantity(item.id, item.quantity - 1)" class="w-7 h-7 bg-white rounded-lg border border-[#EEEAF2] flex items-center justify-center text-secondary-300 hover:text-primary-500 text-xs font-black">-</button>
                        <span class="text-xs font-black min-w-[20px] text-center">{{ item.quantity }}</span>
                        <button @click="customerStore.updateCartQuantity(item.id, item.quantity + 1)" class="w-7 h-7 bg-white rounded-lg border border-[#EEEAF2] flex items-center justify-center text-secondary-300 hover:text-primary-500 text-xs font-black">+</button>
                     </div>
                  </div>
                  <button @click="customerStore.removeFromCart(item.id)" class="text-neutral-500 opacity-30 hover:opacity-100 hover:text-red-500 self-start transition-all"><span class="material-icons-round text-lg">delete_sweep</span></button>
               </div>
            </template>

           
            <template v-else-if="activeDrawer === 'wishlist'">
               <div v-if="!wishlistItems.length" class="flex flex-col items-center justify-center py-16 text-center opacity-50">
                 <span class="material-icons-round text-5xl mb-3">favorite_border</span>
                 <p class="font-black text-sm uppercase tracking-widest">Your wishlist is empty</p>
                 <p class="text-xs text-slate-400 mt-1 font-medium">Save products you love</p>
               </div>
               <div v-for="product in wishlistItems" :key="product.id" class="flex items-center gap-4 p-4 bg-[#F8F6FB] rounded-2xl border border-transparent cursor-pointer hover:bg-white hover:shadow-soft transition-all group" @click="activeDrawer = null; $router.push(`/customer/product/${product.id}`)">
                  <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-[#EEEAF2] shrink-0 overflow-hidden shadow-sm">
                    <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-contain p-1.5 mix-blend-multiply" />
                    <span v-else class="material-icons-round text-tertiary-300">favorite</span>
                  </div>
                  <div class="flex-1 min-w-0">
                     <h4 class="font-black text-xs text-[#1A1225] truncate mb-0.5">{{ product.name }}</h4>
                     <span class="text-xs font-black text-primary-500 tracking-tight">ETB {{ (product.salePrice || product.price).toLocaleString() }}</span>
                  </div>
                  <button @click.stop="customerStore.toggleWishlist(product.id)" class="text-neutral-300 group-hover:text-tertiary-300 transition-colors p-2 rounded-lg bg-white/50 border border-[#EEEAF2] hover:scale-110">
                     <span class="material-icons-round text-lg">heart_broken</span>
                  </button>
               </div>
            </template>
         </div>


         <div v-if="activeDrawer === 'cart' && cartItems.length" class="p-8 border-t border-[#EEEAF2] space-y-4">
           <div class="flex items-center justify-between">
             <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">Total</span>
             <span class="text-2xl font-black text-[#1A1225]">ETB {{ cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
           </div>
           <button @click="activeDrawer = null; $router.push('/customer/checkout')" class="btn-gts-primary w-full py-4 rounded-xl text-[0.938rem] flex items-center justify-center gap-2 group">
             Proceed to Checkout <span class="material-icons-round text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
           </button>
         </div>
      </aside>
    </transition>
    
    <div v-if="activeDrawer" @click="activeDrawer = null" class="fixed inset-0 z-[150] bg-[#1A1225]/40 backdrop-blur-sm"></div>

   
    <main class="flex-1">
      <div class="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-fade-in">
        <router-view />
      </div>
    </main>

 
    <footer class="bg-white border-t border-[#EEEAF2] pt-12 pb-6 px-6 lg:px-12">
       <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-10">
             
         
             <div class="md:col-span-4 space-y-5">
                <div class="flex items-center gap-5 cursor-pointer group" @click="$router.push('/customer/home')">
                   <img src="../assets/logo.png" alt="GTS Logo" class="h-16 w-auto group-hover:scale-105 transition-transform duration-300">
                   <div class="h-12 w-[1.5px] bg-[#7630A3] opacity-30"></div>
                   <div class="flex flex-col justify-center text-left">
                      <span class="font-heading text-xl font-black text-[#7630A3] leading-none mb-1.5 tracking-tight">
                         Grand Technology Solutions
                      </span>
                      <span class="text-[0.625rem] font-black uppercase tracking-[0.3em] text-[#7630A3]">
                         Innovate • Inspire • Transform
                      </span>
                   </div>
                </div>
                <p class="text-[0.813rem] font-medium text-[#475569]/80 leading-relaxed max-w-xs pl-2">
                   Empowering business through high-end technology curation and architectural excellence.
                </p>
          
                <div class="flex items-center gap-3 pt-2 pl-2">
                   <a href="https://info@grandtechsolutions.com/" class="w-10 h-10 bg-[#F8F6FB] rounded-lg border border-[#EEEAF2] flex items-center justify-center text-[#7630A3] hover:scale-105 transition-all">
                      <span class="material-icons-round text-xl">language</span>
                   </a>
                   <a href="https://www.youtube.com/channel/UCHEPtXsVR9g8XsBG4oXi1Vg" target="_blank" class="w-10 h-10 bg-[#F8F6FB] rounded-lg border border-[#EEEAF2] flex items-center justify-center text-[#7630A3] hover:scale-105 transition-all">
                      <span class="material-icons-round text-xl">smart_display</span>
                   </a>
                </div>
             </div>

         
             <div class="md:col-span-3 space-y-4">
                <h4 class="text-xs font-black text-[#7630A3] uppercase tracking-widest">Contacts</h4>
                <div class="space-y-3">
                   <div class="flex items-center gap-3 text-[#475569]/80">
                      <span class="material-icons-round text-base text-[#7630A3]">phone</span>
                      <span class="text-[0.813rem] font-medium">+251987014339</span>
                   </div>
                   <div class="flex items-center gap-3 text-[#475569]/80">
                      <span class="material-icons-round text-base text-[#7630A3]">mail</span>
                      <span class="text-[0.813rem] font-medium">info@grandtechsolutions.com</span>
                   </div>
                   <div class="flex items-center gap-3 text-[#475569]/80">
                      <span class="material-icons-round text-base text-[#7630A3]">location_on</span>
                      <span class="text-[0.813rem] font-medium">03 Ayder, Mekelle, Tigray</span>
                   </div>
                </div>
             </div>

      
             
             <div class="md:col-span-5">
                <h4 class="text-xs font-black text-[#7630A3] uppercase tracking-widest mb-4">Find Us</h4>
                <div class="w-full h-48 rounded-2xl overflow-hidden border border-[#EEEAF2] shadow-sm">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.4!2d39.4753!3d13.4969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDI5JzQ5LjAiTiAzOcKwMjgnMzEuMCJF!5e0!3m2!1sen!2set!4v1680000000000!5m2!1sen!2set"
                    width="100%" 
                    height="100%" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"
                    class="grayscale hover:grayscale-0 transition-all duration-500">
                  </iframe>
                </div>
             </div>

          </div>

          <div class="pt-6 border-t border-[#EEEAF2]/50">
             <p class="text-[0.625rem] font-medium text-[#7C757E]/60 text-center md:text-left">
                Grand Technology Solutions || All rights reserved © 2025
             </p>
          </div>
       </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/authStore.js'
import { useCustomerStore } from '../store/customerStore.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const customerStore = useCustomerStore()

const user = computed(() => authStore.currentUser)
const profileImg = ref(null)

const mobileMenuOpen = ref(false)
const activeDrawer = ref(null)

const cartCount = computed(() => customerStore.cartCount)
const wishlistCount = computed(() => customerStore.wishlist.length)
const cartItems = computed(() => customerStore.cart.map(item => ({
  ...item,
  details: customerStore.getProductById(item.id)
})).filter(item => item.details))
const wishlistItems = computed(() => customerStore.wishlist.map(id => customerStore.getProductById(id)).filter(Boolean))
const cartTotal = computed(() => customerStore.cartTotal)

onMounted(() => {
   profileImg.value = localStorage.getItem('gts_profile_img')
})

const menuItems = [
  { label: 'Explore Products', path: '/customer/home', tab: null },
  { label: 'Premium Shops', path: '/customer/home', tab: 'shops' },
  { label: 'Service Portal', path: '/customer/home', tab: 'services' }
]

function isTabActive(item) {
  if (route.path !== item.path) return false
  return (route.query.tab || null) === item.tab
}

function navigateTo(item) {
  mobileMenuOpen.value = false
  router.push({ path: item.path, query: item.tab ? { tab: item.tab } : {} })
}
</script>

<style scoped>
.shadow-soft { box-shadow: 0 10px 40px -10px rgba(118, 48, 163, 0.15); }
.shadow-glow-tertiary { box-shadow: 0 0 30px rgba(100, 210, 177, 0.4); }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
