<template>
  <Transition name="toast">
    <div
      v-if="adminStore.toast.show"
      class="fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-bold animate-fade-in"
      :class="{
        'bg-[#64D2B1] border-[#64D2B1]/30 text-white': adminStore.toast.type === 'success',
        'bg-amber-500 border-amber-400 text-white':     adminStore.toast.type === 'warning',
        'bg-red-500 border-red-400 text-white':         adminStore.toast.type === 'error',
        'bg-[#7630A3] border-[#7630A3]/30 text-white':  adminStore.toast.type === 'info'
      }"
    >
      <component :is="getToastIcon()" class="w-5 h-5" />
      {{ adminStore.toast.message }}
    </div>
  </Transition>
</template>

<script setup>
import { useAdminStore } from '../../store/adminStore.js'
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-vue-next'

const adminStore = useAdminStore()

function getToastIcon() {
  const map = { success: CheckCircle2, warning: AlertTriangle, error: AlertCircle, info: Info }
  return map[adminStore.toast.type] || Info
}
</script>

<style>
.toast-enter-active { animation: slideUp 0.3s ease-out; }
.toast-leave-active { animation: slideUp 0.3s ease-in reverse; }
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
</style>
