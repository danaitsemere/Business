<template>
  <aside
    class="fixed top-0 left-0 h-screen bg-white border-r border-[#EEEAF2] flex flex-col z-[100] transition-all duration-300 shadow-sm"
    :class="collapsed ? 'w-[88px]' : 'w-[280px]'"
  >
    <!-- Logo / Brand -->
    <div class="px-6 py-8 flex items-center gap-4 border-b border-[#EEEAF2] h-24 overflow-hidden">
      <img
        src="../../assets/logo.png"
        alt="Logo"
        class="h-10 w-auto shrink-0 cursor-pointer hover:scale-110 transition-transform"
        @click="$router.push('/admin/dashboard')"
      >
      <template v-if="!collapsed">
        <div class="h-10 w-[2px] bg-[#7630A3] opacity-30 shrink-0"></div>
        <div class="flex flex-col min-w-0">
          <span class="font-heading text-sm font-black text-[#7630A3] truncate leading-tight">Grand Tech Solutions</span>
          <span class="text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#7C757E] truncate mt-1">Admin Panel</span>
        </div>
      </template>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-4 px-4 py-3 rounded-2xl text-[#475569] text-[0.813rem] font-bold transition-all duration-200 hover:bg-[#F8F6FB] hover:text-[#7630A3] group"
        active-class="!bg-[#7630A3] !text-white shadow-soft"
      >
        <span class="material-icons-round text-xl">{{ item.icon }}</span>
        <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
        <span
          v-if="!collapsed && item.badge"
          class="ml-auto px-2 py-0.5 bg-[#7630A3]/10 text-[#7630A3] rounded-lg text-[0.625rem] font-black"
        >{{ item.badge }}</span>
      </router-link>
    </nav>

    <!-- User / Logout -->
    <div class="p-4 border-t border-[#EEEAF2]">
      <div v-if="!collapsed" class="flex items-center gap-3 p-3 mb-3 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
        <div class="w-10 h-10 rounded-xl bg-[#7630A3] flex items-center justify-center text-white font-black text-xs shadow-soft">SA</div>
        <div class="min-w-0">
          <span class="block text-xs font-black text-[#1A1225] truncate">System Admin</span>
          <span class="block text-[0.625rem] font-bold text-[#7C757E] uppercase tracking-widest">Administrator</span>
        </div>
      </div>
      <button
        class="flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 text-xs font-black uppercase tracking-widest w-full hover:bg-red-50 transition-all group"
        @click="handleLogout"
      >
        <span class="material-icons-round text-lg group-hover:-rotate-6 transition-transform">logout</span>
        <span v-if="!collapsed">Sign Out</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore.js'
import { useAdminStore } from '../../store/adminStore.js'

defineProps({
  collapsed: { type: Boolean, default: false }
})

const router = useRouter()
const authStore = useAuthStore()
const adminStore = useAdminStore()

const navItems = computed(() => [
  { path: '/admin/dashboard',        icon: 'dashboard',     label: 'Overview' },
  { path: '/admin/users',            icon: 'people',        label: 'Users' },
  { path: '/admin/businesses',       icon: 'store',         label: 'Businesses',       badge: adminStore.pendingBusinesses.length || null },
  { path: '/admin/products',         icon: 'inventory_2',   label: 'Products' },
  { path: '/admin/service-requests', icon: 'assignment',    label: 'Service Requests', badge: adminStore.pendingRequests.length || null },
  { path: '/admin/verifications',    icon: 'verified_user', label: 'Verifications',    badge: adminStore.pendingBusinesses.length || null },
  { path: '/admin/analytics',        icon: 'analytics',     label: 'Analytics' },
  { path: '/admin/reports',          icon: 'description',   label: 'Reports' }
])

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.15); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #7630A320; border-radius: 10px; }
</style>
