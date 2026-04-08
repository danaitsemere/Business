<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="activeDrawer"
      class="fixed top-0 right-0 z-[200] w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-[#EEEAF2]"
    >
      <!-- Drawer Header -->
      <div class="p-8 border-b border-[#EEEAF2] flex items-center justify-between">
        <h2 class="font-heading text-xl font-black text-[#1A1225] flex items-center gap-3">
          <span class="material-icons-round text-tertiary-300">{{ activeDrawer === 'cart' ? 'shopping_cart' : 'favorite' }}</span>
          {{ activeDrawer === 'cart' ? 'Shopping Cart' : 'My Wishlist' }}
        </h2>
        <button
          @click="close()"
          class="w-10 h-10 rounded-xl bg-[#F8F6FB] text-secondary-300 hover:text-primary-500 flex items-center justify-center transition-colors"
        >
          <span class="material-icons-round">close</span>
        </button>
      </div>

      <!-- Drawer Body -->
      <div class="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">

        <!-- Cart Items -->
        <template v-if="activeDrawer === 'cart'">
          <div v-if="!cartItems.length" class="flex flex-col items-center justify-center py-16 text-center opacity-50">
            <span class="material-icons-round text-5xl mb-3">shopping_cart</span>
            <p class="font-black text-sm uppercase tracking-widest">Your cart is empty</p>
            <p class="text-xs text-slate-400 mt-1 font-medium">Browse products to add items</p>
          </div>
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="flex gap-4 p-4 bg-[#F8F6FB] rounded-2xl border border-transparent hover:border-primary-500/10 hover:bg-white transition-all duration-300 group"
          >
            <div class="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-[#EEEAF2] shrink-0 overflow-hidden">
              <img v-if="item.details?.image" :src="item.details.image" :alt="item.details?.name" class="w-full h-full object-contain p-1.5 mix-blend-multiply" />
              <span v-else class="material-icons-round text-neutral-300 opacity-30 text-3xl">inventory_2</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-black text-xs text-[#1A1225] truncate mb-1">{{ item.details?.name }}</h4>
              <p class="text-xs text-primary-500 font-black tracking-tighter mb-3">
                ETB {{ (item.details?.salePrice || item.details?.price || 0).toLocaleString() }} × {{ item.quantity }}
              </p>
              <div class="flex items-center gap-3">
                <button @click="customerStore.updateCartQuantity(item.id, item.quantity - 1)" class="w-7 h-7 bg-white rounded-lg border border-[#EEEAF2] flex items-center justify-center text-secondary-300 hover:text-primary-500 text-xs font-black">-</button>
                <span class="text-xs font-black min-w-[20px] text-center">{{ item.quantity }}</span>
                <button @click="customerStore.updateCartQuantity(item.id, item.quantity + 1)" class="w-7 h-7 bg-white rounded-lg border border-[#EEEAF2] flex items-center justify-center text-secondary-300 hover:text-primary-500 text-xs font-black">+</button>
              </div>
            </div>
            <button @click="customerStore.removeFromCart(item.id)" class="text-neutral-500 opacity-30 hover:opacity-100 hover:text-red-500 self-start transition-all">
              <span class="material-icons-round text-lg">delete_sweep</span>
            </button>
          </div>
        </template>

        <!-- Wishlist Items -->
        <template v-else-if="activeDrawer === 'wishlist'">
          <div v-if="!wishlistItems.length" class="flex flex-col items-center justify-center py-16 text-center opacity-50">
            <span class="material-icons-round text-5xl mb-3">favorite_border</span>
            <p class="font-black text-sm uppercase tracking-widest">Your wishlist is empty</p>
            <p class="text-xs text-slate-400 mt-1 font-medium">Save products you love</p>
          </div>
          <div
            v-for="product in wishlistItems"
            :key="product.id"
            class="flex items-center gap-4 p-4 bg-[#F8F6FB] rounded-2xl border border-transparent cursor-pointer hover:bg-white hover:shadow-soft transition-all group"
            @click="close(); $router.push(`/customer/product/${product.id}`)"
          >
            <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-[#EEEAF2] shrink-0 overflow-hidden shadow-sm">
              <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-contain p-1.5 mix-blend-multiply" />
              <span v-else class="material-icons-round text-tertiary-300">favorite</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-black text-xs text-[#1A1225] truncate mb-0.5">{{ product.name }}</h4>
              <span class="text-xs font-black text-primary-500 tracking-tight">ETB {{ (product.salePrice || product.price).toLocaleString() }}</span>
            </div>
            <button @click.stop="customerStore.toggleWishlist(product.id)" class="text-neutral-300 group-hover:text-tertiary-300 transition-colors p-2 rounded-lg bg-white/50 border border-[#EEEAF2] hover:scale-110">
              <span class="material-icons-round text-lg">heart_broken</span>
            </button>
          </div>
        </template>

      </div>

      <!-- Cart Footer -->
      <div v-if="activeDrawer === 'cart' && cartItems.length" class="p-8 border-t border-[#EEEAF2] space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">Total</span>
          <span class="text-2xl font-black text-[#1A1225]">ETB {{ cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
        </div>
        <button
          @click="close(); $router.push('/customer/checkout')"
          class="btn-gts-primary w-full py-4 rounded-xl text-[0.938rem] flex items-center justify-center gap-2 group"
        >
          Proceed to Checkout
          <span class="material-icons-round text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </aside>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useCustomerStore } from '../../store/customerStore.js'

const props = defineProps({
  activeDrawer: { type: String, default: null }
})

const emit = defineEmits(['update:activeDrawer'])

const customerStore = useCustomerStore()

const cartItems = computed(() =>
  customerStore.cart
    .map(item => ({ ...item, details: customerStore.getProductById(item.id) }))
    .filter(item => item.details)
)

const wishlistItems = computed(() =>
  customerStore.wishlist.map(id => customerStore.getProductById(id)).filter(Boolean)
)

const cartTotal = computed(() => customerStore.cartTotal)

function close() {
  emit('update:activeDrawer', null)
}
</script>

<style scoped>
.shadow-soft { box-shadow: 0 10px 40px -10px rgba(118, 48, 163, 0.15); }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
