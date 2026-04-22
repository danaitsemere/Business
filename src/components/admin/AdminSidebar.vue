<template>
  <aside
    class="fixed top-0 left-0 h-screen bg-white border-r border-[#EEEAF2] flex flex-col z-[100] transition-all duration-300 shadow-sm"
    :class="collapsed ? 'w-[88px]' : 'w-[280px]'"
  >
    <div class="px-6 py-8 flex items-center gap-4 border-b border-[#EEEAF2] h-24 overflow-hidden">
      <img
        src="/image/logo.png"
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

    <nav class="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#7630A320] [&::-webkit-scrollbar-thumb]:rounded-full">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-4 px-4 py-3 rounded-2xl text-[#475569] text-[0.813rem] font-bold transition-all duration-200 hover:bg-[#F8F6FB] hover:text-[#7630A3] group"
        active-class="!bg-[#7630A3] !text-white shadow-[0_4px_20px_-4px_rgba(118,48,163,0.15)]"
      >
        <component :is="item.iconComp" class="w-5 h-5" />
        <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
        <span
          v-if="!collapsed && item.badge"
          class="ml-auto px-2 py-0.5 bg-[#7630A3]/10 text-[#7630A3] rounded-lg text-[0.625rem] font-black"
        >{{ item.badge }}</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-[#EEEAF2]">
      <div v-if="!collapsed" class="flex items-center gap-3 p-3 mb-3 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
        <div class="w-10 h-10 rounded-xl bg-[#7630A3] flex items-center justify-center text-white font-black text-xs shadow-[0_4px_20px_-4px_rgba(118,48,163,0.15)]">SA</div>
        <div class="min-w-0">
          <span class="block text-xs font-black text-[#1A1225] truncate">System Admin</span>
          <span class="block text-[0.625rem] font-bold text-[#7C757E] uppercase tracking-widest">Administrator</span>
        </div>
      </div>
      <button
        class="btn-gts !bg-orange-500 hover:!bg-orange-600 !w-full"
        @click="handleLogout"
      >
        <LogOut class="w-5 h-5 group-hover:-rotate-6 transition-transform" />
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
import {
  LayoutDashboard, Users, Store, Package,
  ShieldCheck, FileText, LogOut
} from 'lucide-vue-next'

defineProps({
  collapsed: { type: Boolean, default: false }
})

const router = useRouter()
const authStore = useAuthStore()
const adminStore = useAdminStore()

const navItems = computed(() => [
  { path: '/admin/dashboard',        iconComp: LayoutDashboard, label: 'Overview' },
  { path: '/admin/users',            iconComp: Users,           label: 'Users' },
  { path: '/admin/businesses',       iconComp: Store,           label: 'Businesses',       badge: adminStore.pendingBusinesses.length || null },
  { path: '/admin/products',         iconComp: Package,         label: 'Products' },
  { path: '/admin/verifications',    iconComp: ShieldCheck,     label: 'Verifications',    badge: adminStore.pendingBusinesses.length || null },

  { path: '/admin/reports',          iconComp: FileText,        label: 'Reports' }
])

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>
