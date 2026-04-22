<template>
  <header class="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-[#EEEAF2] px-6 lg:px-12 py-5">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6 cursor-pointer group" @click="$router.push('/customer/home')">
        <img src="/image/logo.png" alt="GTS Logo" class="h-14 w-auto group-hover:scale-105 transition-transform duration-300">
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
        <button
          v-for="item in menuItems"
          :key="item.label"
          class="btn-gts-secondary !bg-transparent border-none !text-[#475569]"
          :class="{ '!bg-primary-500/5 !text-primary-500': isTabActive(item) }"
          @click="navigateTo(item)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="flex items-center gap-3 lg:gap-6">
        <div class="flex items-center gap-4">
          <div
            class="relative cursor-pointer transition-all duration-300 transform hover:scale-110 text-secondary-300 hover:text-emerald-500"
            @click="$emit('open-drawer', 'request-list')"
            title="Request Cart"
          >
            <ClipboardList class="w-6 h-6" />
            <span
              v-if="requestCount > 0"
              class="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white text-[0.625rem] font-black rounded-full flex items-center justify-center border-2 border-white"
            >{{ requestCount }}</span>
          </div>

          <div
            class="relative cursor-pointer transition-all duration-300 transform hover:scale-110 text-secondary-300 hover:text-emerald-500"
            @click="$router.push('/customer/chat')"
            title="Messages"
          >
            <MessageSquare class="w-6 h-6" />
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
import { MessageSquare, ClipboardList } from 'lucide-vue-next'

defineEmits(['open-drawer'])

const router = useRouter()
const route  = useRoute()
const authStore = useAuthStore()
const customerStore = useCustomerStore()

const user       = computed(() => authStore.currentUser)
const profileImg = ref(null)

const requestCount = computed(() => customerStore.requestListCount)

onMounted(() => {
  profileImg.value = localStorage.getItem('gts_profile_img')
})

const menuItems = [
  { label: 'Products',  path: '/customer/home', tab: null },
  { label: 'Services',  path: '/customer/home', tab: 'services' }
]

function isTabActive(item) {
  if (route.path !== item.path) return false
  return (route.query.tab || null) === item.tab
}

function navigateTo(item) {
  router.push({ path: item.path, query: item.tab ? { tab: item.tab } : {} })
}
</script>
