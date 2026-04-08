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
      <span class="material-icons-round text-lg">
        {{
          adminStore.toast.type === 'success' ? 'check_circle' :
          adminStore.toast.type === 'warning' ? 'warning' :
          adminStore.toast.type === 'error'   ? 'error' : 'info'
        }}
      </span>
      {{ adminStore.toast.message }}
    </div>
  </Transition>
</template>

<script setup>
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
</script>

<style scoped>
.toast-enter-active { animation: slideUp 0.3s ease-out; }
.toast-leave-active { animation: slideUp 0.3s ease-in reverse; }
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
</style>
