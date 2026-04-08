<template>
  <div class="flex min-h-screen bg-[#F8F6FB]">
    <AdminSidebar :collapsed="sidebarCollapsed" />

    <main class="flex-1 transition-all duration-300" :class="sidebarCollapsed ? 'ml-[88px]' : 'ml-[280px]'">
      <AdminHeader :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
      
      <div class="p-10 min-h-screen">
        <router-view />
      </div>
    </main>

    <AdminToast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from '../components/admin/AdminSidebar.vue'
import AdminHeader from '../components/admin/AdminHeader.vue'
import AdminToast from '../components/admin/AdminToast.vue'

const sidebarCollapsed = ref(false)
</script>

<style scoped>
</style>
