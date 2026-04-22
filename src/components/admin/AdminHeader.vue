<template>
  <header class="flex items-center justify-between px-10 py-6 border-b border-[#EEEAF2] bg-white/80 backdrop-blur-xl sticky top-0 z-50">
    <div class="flex items-center gap-6">
      <button
        class="btn-gts-secondary !w-11 !h-11 !px-0"
        @click="$emit('toggle')"
      >
        <component :is="collapsed ? PanelLeftOpen : Menu" class="w-6 h-6" />
      </button>
      <div class="flex flex-col">
        <span class="text-[0.625rem] font-black text-[#7630A3] uppercase tracking-[0.3em] mb-1">Dashboard</span>
        <h2 class="font-heading text-2xl font-black text-[#1A1225] leading-tight">{{ pageTitle }}</h2>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-[#7630A3] flex items-center justify-center text-white font-black shadow-[0_4px_20px_-4px_rgba(118,48,163,0.15)] cursor-pointer hover:brightness-110 transition-all">
        SA
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, PanelLeftOpen } from 'lucide-vue-next'

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
  { path: '/admin/verifications',    label: 'Verifications' },
  { path: '/admin/analytics',        label: 'Analytics' },
  { path: '/admin/reports',          label: 'Reports' }
]

const pageTitle = computed(() => {
  const item = navItems.find(i => route.path.startsWith(i.path))
  return item?.label || 'Overview'
})
</script>
