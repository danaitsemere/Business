<template>
  <div class="flex flex-col min-h-screen bg-[#F8F6FB]">
    <CustomerNavbar @open-drawer="activeDrawer = $event" />

    <CartWishlistDrawer v-model:activeDrawer="activeDrawer" />
    
    <div v-if="activeDrawer" @click="activeDrawer = null" class="fixed inset-0 z-[150] bg-[#1A1225]/40 backdrop-blur-sm"></div>

    <main class="flex-1">
      <div class="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 animate-fade-in">
        <router-view />
      </div>
    </main>

    <CustomerFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CustomerNavbar from '../components/customer/CustomerNavbar.vue'
import CartWishlistDrawer from '../components/customer/CartWishlistDrawer.vue'
import CustomerFooter from '../components/customer/CustomerFooter.vue'

const activeDrawer = ref(null)
</script>

<style scoped>
</style>
