<template>
  <header class="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-[#EEEAF2] px-6 lg:px-12 py-5">
    <div class="max-w-7xl mx-auto flex items-center justify-between">

      <!-- Brand -->
      <div class="flex items-center gap-6 cursor-pointer group" @click="$router.push('/customer/home')">
        <img src="../../assets/logo.png" alt="GTS Logo" class="h-14 w-auto group-hover:scale-105 transition-transform duration-300">
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

      <!-- Nav Links -->
      <nav class="hidden xl:flex items-center gap-1 ml-auto mr-8">
        <button
          v-for="item in menuItems"
          :key="item.label"
          class="text-[0.688rem] font-black uppercase tracking-[0.1em] transition-all px-4 py-2 rounded-xl"
          :class="isTabActive(item) ? 'bg-primary-500/5 text-primary-500' : 'text-secondary-400 hover:text-secondary-600'"
          @click="navigateTo(item)"
        >
          {{ item.label }}
        </button>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-3 lg:gap-6">
        <div class="flex items-center gap-4">
          <!-- Wishlist -->
          <div
            class="relative cursor-pointer transition-all duration-300 transform hover:scale-110"
            :class="wishlistCount > 0 ? 'text-tertiary-300' : 'text-secondary-300 hover:text-primary-500'"
            @click="$emit('open-drawer', 'wishlist')"
          >
            <span class="material-icons-round text-2xl">{{ wishlistCount > 0 ? 'favorite' : 'favorite_border' }}</span>
            <span
              v-if="wishlistCount > 0"
              class="absolute -top-2 -right-2 w-5 h-5 bg-tertiary-300 text-[#1A1225] text-[0.625rem] font-black rounded-full flex items-center justify-center border-2 border-white shadow-glow-tertiary"
            >{{ wishlistCount }}</span>
          </div>
          <!-- Cart -->
          <div
            class="relative cursor-pointer transition-all duration-300 transform hover:scale-110"
            :class="cartCount > 0 ? 'text-tertiary-300' : 'text-secondary-300 hover:text-primary-500'"
            @click="$emit('open-drawer', 'cart')"
          >
            <span class="material-icons-round text-2xl">shopping_cart</span>
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 w-5 h-5 bg-tertiary-300 text-[#1A1225] text-[0.625rem] font-black rounded-full flex items-center justify-center border-2 border-white shadow-glow-tertiary"
            >{{ cartCount }}</span>
          </div>
        </div>

        <div class="h-8 w-[1px] bg-[#EEEAF2] hidden sm:block"></div>

        <!-- User Avatar -->
        <div class="flex items-center gap-3 cursor-pointer group" @click="$router.push('/customer/profile')">
          <div class="w-11 h-11 rounded-full border-2 border-primary-500/20 p-0.5 group-hover:border-primary-500 transition-all duration-300 flex items-center justify-center overflow-hidden bg-[#F5F3F7] shadow-sm">
            <img v-if="profileImg" :src="profileImg" class="w-full h-full object-cover rounded-full">
            <div v-else class="avatar-gts w-full h-full rounded-full text-sm uppercase font-black flex items-center justify-center bg-primary-500 text-white">
              {{ user?.fullName?.charAt(0) || 'K' }}
            </div>
          </div>
          <div class="hidden md:block text-left">
            <span class="block text-sm font-black text-[#1A1225] leading-none group-hover:text-primary-500 transition-colors uppercase tracking-tight">
              {{ user?.fullName || 'Kalkidan Abera' }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../store/authStore.js'
import { useCustomerStore } from '../../store/customerStore.js'

defineEmits(['open-drawer'])

const router = useRouter()
const route  = useRoute()
const authStore     = useAuthStore()
const customerStore = useCustomerStore()

const user       = computed(() => authStore.currentUser)
const profileImg = ref(null)

const cartCount     = computed(() => customerStore.cartCount)
const wishlistCount = computed(() => customerStore.wishlist.length)

onMounted(() => {
  profileImg.value = localStorage.getItem('gts_profile_img')
})

const menuItems = [
  { label: 'Explore Products', path: '/customer/home', tab: null },
  { label: 'Premium Shops',    path: '/customer/home', tab: 'shops' },
  { label: 'Service Portal',   path: '/customer/home', tab: 'services' }
]

function isTabActive(item) {
  if (route.path !== item.path) return false
  return (route.query.tab || null) === item.tab
}

function navigateTo(item) {
  router.push({ path: item.path, query: item.tab ? { tab: item.tab } : {} })
}
</script>

<style scoped>
.shadow-glow-tertiary { box-shadow: 0 0 30px rgba(100, 210, 177, 0.4); }
</style>
