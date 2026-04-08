<template>
  <header class="flex items-center justify-between px-10 py-6 border-b border-[#EEEAF2] bg-white/80 backdrop-blur-xl sticky top-0 z-50">
    <div class="flex items-center gap-6">
      <button
        class="text-[#475569] p-2 rounded-xl hover:bg-[#F8F6FB] hover:text-[#7630A3] transition-colors"
        @click="$emit('toggle')"
      >
        <span class="material-icons-round text-2xl">{{ collapsed ? 'menu_open' : 'menu' }}</span>
      </button>
      <div class="flex flex-col">
        <span class="text-[0.625rem] font-black text-[#7630A3] uppercase tracking-[0.3em] mb-1">Dashboard</span>
        <h2 class="font-heading text-2xl font-black text-[#1A1225] leading-tight">{{ pageTitle }}</h2>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-[#7630A3] flex items-center justify-center text-white font-black shadow-soft cursor-pointer hover:brightness-110 transition-all">
        SA
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  collapsed: { type: Boolean, default: false }
})

defineEmits(['toggle'])

const route = useRoute()

const navItems = [
  { path: '/admin/dashboard',        label: 'Overview' },
  { path: '/admin/users',            label: 'Users' },
  { path: '/admin/businesses',       label: 'Businesses' },
  { path: '/admin/products',         label: 'Products' },
  { path: '/admin/service-requests', label: 'Service Requests' },
  { path: '/admin/verifications',    label: 'Verifications' },
  { path: '/admin/analytics',        label: 'Analytics' },
  { path: '/admin/reports',          label: 'Reports' }
]

const pageTitle = computed(() => {
  const item = navItems.find(i => route.path.startsWith(i.path))
  return item?.label || 'Overview'
})
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.15); }
</style>
