<template>
  <div class="flex min-h-screen bg-[#0F0A19]">
    <!-- Sidebar -->
    <aside class="fixed top-0 left-0 h-screen bg-[#1A1225] border-r border-[#EEEAF2]/10 flex flex-col z-[100] transition-all duration-300"
      :class="sidebarCollapsed ? 'w-[88px]' : 'w-[280px]'">

      <!-- Purple Brand Identity Section -->
      <div class="px-6 py-8 flex items-center gap-4 border-b border-[#EEEAF2]/10 h-24 overflow-hidden">
        <img src="../assets/logo.png" alt="Logo" class="h-10 w-auto shrink-0 cursor-pointer hover:scale-110 transition-transform" @click="$router.push('/admin/dashboard')">
        
        <template v-if="!sidebarCollapsed">
           <div class="h-10 w-[2px] bg-[#7630A3] opacity-50 shrink-0"></div>
           <div class="flex flex-col min-w-0">
              <span class="font-heading text-sm font-black text-[#7630A3] truncate leading-tight">Grand Tech Solutions</span>
              <span class="text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#7630A3]/70 truncate mt-1">Innovate • Inspire</span>
           </div>
        </template>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 text-sm font-black uppercase tracking-widest transition-all duration-200 hover:bg-[#7630A3]/10 hover:text-white group"
          active-class="!bg-[#7630A3] !text-white shadow-soft">
          <span class="material-icons-round text-xl">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed" class="whitespace-nowrap">{{ item.label }}</span>
          <span v-if="!sidebarCollapsed && item.badge" class="ml-auto px-2 py-1 bg-white/20 text-white rounded-lg text-[0.625rem] font-black">{{ item.badge }}</span>
        </router-link>
      </nav>

      <!-- User/Footer -->
      <div class="p-4 border-t border-[#EEEAF2]/10 bg-[#1A1225]/50">
        <div v-if="!sidebarCollapsed" class="flex items-center gap-3 p-3 mb-4 bg-[#0F0A19] rounded-2xl border border-[#EEEAF2]/5">
           <div class="w-10 h-10 rounded-xl bg-[#7630A3] flex items-center justify-center text-white font-black text-xs shadow-soft">SA</div>
           <div class="min-w-0">
              <span class="block text-xs font-black text-white truncate">System Admin</span>
              <span class="block text-[0.625rem] font-bold text-slate-500 uppercase tracking-widest">Master Authority</span>
           </div>
        </div>
        <button class="flex items-center gap-4 px-4 py-4 rounded-xl text-red-400 text-xs font-black uppercase tracking-widest w-full hover:bg-red-500/10 transition-all group" @click="handleLogout">
          <span class="material-icons-round text-lg group-hover:-rotate-6 transition-transform">logout</span>
          <span v-if="!sidebarCollapsed">Terminate Session</span>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 transition-all duration-300" :class="sidebarCollapsed ? 'ml-[88px]' : 'ml-[280px]'">
      <header class="flex items-center justify-between px-10 py-6 border-b border-[#EEEAF2]/10 bg-[#0F0A19]/80 backdrop-blur-xl sticky top-0 z-50">
        <div class="flex items-center gap-6">
          <button class="text-slate-400 p-2 rounded-xl hover:bg-[#7630A3]/10 hover:text-white transition-colors" @click="sidebarCollapsed = !sidebarCollapsed">
            <span class="material-icons-round text-2xl">{{ sidebarCollapsed ? 'menu_open' : 'menu' }}</span>
          </button>
          <div class="flex flex-col">
             <span class="text-[0.625rem] font-black text-[#7630A3] uppercase tracking-[0.3em] mb-1">Terminal</span>
             <h2 class="font-heading text-2xl font-black text-white leading-tight underline decoration-[#7630A3]/50 decoration-4 underline-offset-8">{{ currentPageTitle }}</h2>
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <div class="relative cursor-pointer text-slate-400 p-3 bg-[#1A1225] rounded-xl hover:text-white transition-colors border border-[#EEEAF2]/10 group">
            <span class="material-icons-round text-xl group-hover:rotate-12 transition-transform">notifications</span>
            <span class="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1A1225] animate-pulse"></span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-[#7630A3] flex items-center justify-center text-white font-black shadow-soft cursor-pointer hover:brightness-110 transition-all" @click="$router.push('/admin/settings')">
             SA
          </div>
        </div>
      </header>
      
      <div class="p-10 min-h-screen">
        <router-view />
      </div>

      <!-- Admin Footer -->
      <footer class="p-10 border-t border-[#EEEAF2]/10 text-center">
         <p class="text-[0.625rem] font-black text-slate-500 uppercase tracking-[0.3em]">© 2026 GTS PLATFORM AUTHORITATIVE ENGINE • ENCRYPTED SESSION</p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/authStore.js'
import { useAdminStore } from '../store/adminStore.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const adminStore = useAdminStore()
const sidebarCollapsed = ref(false)

const pendingCount = computed(() => adminStore.pendingVerifications.length)

const navItems = computed(() => [
  { path: '/admin/dashboard', icon: 'dashboard', label: 'Overview' },
  { path: '/admin/users', icon: 'people', label: 'Terminals' },
  { path: '/admin/businesses', icon: 'store', label: 'Entities' },
  { path: '/admin/products', icon: 'inventory_2', label: 'Inventory' },
  { path: '/admin/service-requests', icon: 'assignment', label: 'Ops Requests' },
  { path: '/admin/verifications', icon: 'verified_user', label: 'Governance', badge: pendingCount.value || null },
  { path: '/admin/analytics', icon: 'analytics', label: 'Telemetry' },
  { path: '/admin/reports', icon: 'description', label: 'Logs' },
  { path: '/admin/settings', icon: 'settings', label: 'Control' }
])

const currentPageTitle = computed(() => {
  const item = navItems.value.find(i => route.path.startsWith(i.path))
  return item?.label || 'Overview'
})

function handleLogout() { authStore.logout(); router.push('/') }
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.5); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #7630A320; border-radius: 10px; }
</style>
