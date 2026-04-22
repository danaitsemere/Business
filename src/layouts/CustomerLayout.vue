<template>
  <div class="flex flex-col min-h-screen bg-[#F8F6FB]">
    <CustomerNavbar @open-drawer="openDrawer" />

    <main class="flex-1">
      <div :class="isChatPage ? 'w-full h-full' : 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 animate-fade-in text-left'">
        <router-view />
      </div>
    </main>

    <CartWishlistDrawer v-model:activeDrawer="activeDrawer" />
    <CustomerFooter v-if="!isChatPage" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import CustomerNavbar from '../components/customer/CustomerNavbar.vue'
import CustomerFooter from '../components/customer/CustomerFooter.vue'
import CartWishlistDrawer from '../components/customer/CartWishlistDrawer.vue'

const route = useRoute()
const isChatPage = computed(() => route.path === '/customer/chat')

const activeDrawer = ref(null)

function openDrawer(type) {
  activeDrawer.value = type
}
</script>
