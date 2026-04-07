<template>
  <div class="animate-fade-in max-w-7xl mx-auto px-4 py-8" v-if="product">
   
    <nav class="flex items-center gap-2 text-[0.688rem] font-bold text-slate-400 uppercase tracking-widest mb-10">
      <router-link to="/customer/home" class="hover:text-[#7630A3]">Home</router-link>
      <span class="material-icons-round text-sm">chevron_right</span>
      <span class="text-[#1A1225]">{{ product.name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
     
      <!-- Image Section with Interactive Thumbnails -->
      <div class="space-y-6">
        <div class="w-full aspect-[4/3] bg-white border border-[#EEEAF2] rounded-[2rem] p-1 shadow-soft relative overflow-hidden flex items-center justify-center group">
           <div class="absolute inset-0 bg-gradient-to-br from-transparent to-[#F5F3F7] opacity-50"></div>
           <img v-if="selectedImage" :src="selectedImage" :alt="product.name" class="w-full h-full object-contain p-8 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
           <span v-else class="material-icons-round text-[10rem] text-[#EEEAF2] group-hover:scale-110 transition-transform duration-700">inventory_2</span>
           <div class="absolute top-8 left-8 flex gap-2">
              <span v-if="product.onSale" class="bg-red-500 text-white text-[0.688rem] font-black px-3 py-1.5 rounded-lg tracking-tighter uppercase shadow-sm">Special Offer</span>
           </div>
           <!-- Dynamic badges -->
           <div class="absolute top-8 right-8 flex flex-col gap-2">
             <div class="bg-[#1A1225] text-white px-3 py-1.5 rounded-lg text-[0.625rem] font-black flex items-center gap-1">
               <span class="material-icons-round text-sm">local_fire_department</span> {{ product.views || 120 }} sold
             </div>
           </div>
        </div>
        
        <!-- Clickable Thumbnails -->
        <div class="flex gap-4 overflow-x-auto pb-2 px-1">
           <div v-for="(img, idx) in thumbnailImages" :key="idx" 
             class="w-24 h-24 bg-white border-2 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer transition-all shadow-soft overflow-hidden"
             :class="selectedImageIdx === idx ? 'border-[#7630A3] scale-105' : 'border-[#EEEAF2] hover:border-[#7630A3]/50'"
             @click="selectedImageIdx = idx; selectedImage = img">
              <img v-if="img" :src="img" :alt="product.name" class="w-full h-full object-contain p-2 mix-blend-multiply" />
              <span v-else class="material-icons-round text-slate-200">photo</span>
           </div>
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col">
        <div class="mb-8">
           <div class="flex items-center gap-2 mb-4">
              <span class="text-[0.688rem] font-black uppercase tracking-[0.2em] text-[#7630A3] bg-[#7630A3]/5 px-3 py-1 rounded-md">{{ product.category }}</span>
              <div class="flex items-center gap-1 text-amber-500">
                 <span v-for="n in 5" :key="n" class="material-icons-round text-sm">
                   {{ n <= 4 ? 'star' : 'star_half' }}
                 </span>
                 <span class="text-slate-400 text-[0.625rem] font-black uppercase tracking-widest ml-1">({{ fakeReviews.length }} Reviews)</span>
              </div>
           </div>
           
           <h1 class="font-heading text-4xl lg:text-5xl font-black text-[#1A1225] mb-4 leading-tight">{{ product.name }}</h1>
           <p class="text-slate-500 font-medium text-lg leading-relaxed max-w-lg mb-6">{{ product.description }}</p>

           <!-- Trust Signals Row -->
           <div class="flex flex-wrap items-center gap-4 text-xs font-bold">
             <span class="flex items-center gap-1.5 px-3 py-2 bg-[#F8F6FB] rounded-xl text-slate-500">
               <span class="material-icons-round text-sm text-tertiary-300">local_shipping</span> Free Delivery
             </span>
             <span class="flex items-center gap-1.5 px-3 py-2 bg-[#F8F6FB] rounded-xl text-slate-500">
               <span class="material-icons-round text-sm text-blue-400">replay</span> 7-day Return
             </span>
             <span class="flex items-center gap-1.5 px-3 py-2 bg-[#F8F6FB] rounded-xl text-slate-500">
               <span class="material-icons-round text-sm text-amber-400">verified_user</span> 1-year Warranty
             </span>
             <span class="flex items-center gap-1.5 px-3 py-2 bg-[#F8F6FB] rounded-xl text-slate-500">
               <span class="material-icons-round text-sm text-red-400">visibility</span> {{ product.views || 120 }} viewing
             </span>
           </div>
        </div>

        <!-- Price & Cart Decision Box -->
        <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 shadow-soft mb-10 space-y-6">
           <div class="flex items-center justify-between">
              <div>
                 <span class="text-[0.625rem] font-black uppercase text-slate-400 tracking-widest mb-1 block">Unit Price</span>
                 <div class="flex items-center gap-3">
                   <span class="text-3xl font-black text-[#1A1225]">${{ (product.salePrice || product.price).toLocaleString() }}</span>
                   <span v-if="product.salePrice" class="text-lg text-slate-400 line-through font-bold">${{ product.price.toLocaleString() }}</span>
                   <span v-if="product.salePrice" class="bg-red-500/10 text-red-500 text-xs font-black px-2 py-0.5 rounded">-{{ Math.round((1 - product.salePrice/product.price) * 100) }}%</span>
                 </div>
              </div>
              <div class="text-right">
                 <span class="text-[0.625rem] font-black uppercase text-slate-400 tracking-widest mb-1 block">Subtotal</span>
                 <span class="text-3xl font-black text-[#7630A3] tracking-tight">${{ calculateSubtotal().toLocaleString() }}</span>
              </div>
           </div>

           <!-- Stock urgency -->
           <div class="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200/50 rounded-xl">
             <span class="material-icons-round text-amber-500 text-lg">local_fire_department</span>
             <span class="text-xs font-bold text-amber-700">Only {{ fakeStock }} left in stock — order soon!</span>
           </div>

           <div class="flex flex-col sm:flex-row items-center gap-6">
              <!-- Quantity Selector -->
              <div class="flex items-center bg-[#F8F6FB] rounded-2xl p-2 border border-[#EEEAF2] w-full sm:w-auto">
                 <button @click="quantity > 1 && quantity--" class="w-12 h-12 rounded-xl bg-white text-slate-400 hover:text-[#7630A3] hover:shadow-sm flex items-center justify-center transition-all">
                    <span class="material-icons-round">remove</span>
                 </button>
                 <span class="px-8 font-black text-lg text-[#1A1225]">{{ quantity }}</span>
                 <button @click="quantity++" class="w-12 h-12 rounded-xl bg-white text-slate-400 hover:text-[#7630A3] hover:shadow-sm flex items-center justify-center transition-all">
                    <span class="material-icons-round">add</span>
                 </button>
              </div>

              <!-- Cart/Wishlist Buttons -->
              <div class="flex gap-3 w-full sm:flex-1">
                 <button @click="toggleWishlist" class="w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all"
                   :class="isInWishlist ? 'border-tertiary-300/30 text-tertiary-300 bg-tertiary-300/5' : 'border-[#EEEAF2] text-slate-300 hover:text-tertiary-300 hover:border-tertiary-300/20'">
                    <span class="material-icons-round text-2xl">{{ isInWishlist ? 'favorite' : 'favorite_border' }}</span>
                 </button>
                 <button @click="addToCart" class="btn-gts-primary flex-1 h-16 rounded-2xl flex items-center justify-center gap-3 group text-[1rem] shadow-soft relative overflow-hidden">
                    <span v-if="!addedToCart" class="flex items-center gap-3">
                      <span class="material-icons-round group-hover:scale-110 transition-transform">shopping_cart</span>
                      Add to Cart
                    </span>
                    <span v-else class="flex items-center gap-2 text-white">
                      <span class="material-icons-round animate-bounce">check_circle</span>
                      Added to Cart!
                    </span>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Product Features (replaces Technical Framework) -->
    <div class="bg-white rounded-[3rem] p-10 lg:p-16 border border-[#EEEAF2] shadow-soft mb-16">
       <h3 class="font-heading text-3xl font-black text-[#1A1225] mb-12">Product Features</h3>
       <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, idx) in productFeatures" :key="idx" class="space-y-3 p-6 rounded-2xl bg-[#F8F6FB] group hover:bg-[#7630A3] transition-all duration-300 cursor-default">
             <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#7630A3] shadow-sm mb-4">
                <span class="material-icons-round text-lg">{{ feature.icon }}</span>
             </div>
             <h4 class="font-black text-[#1A1225] group-hover:text-white transition-colors">{{ feature.title }}</h4>
             <p class="text-sm text-slate-500 font-medium leading-relaxed group-hover:text-white/80 transition-colors">
               {{ feature.desc }}
             </p>
          </div>
       </div>
    </div>

    <!-- Customer Reviews Section -->
    <div class="bg-white rounded-[3rem] p-10 lg:p-16 border border-[#EEEAF2] shadow-soft mb-16">
       <div class="flex items-center justify-between mb-12">
         <h3 class="font-heading text-3xl font-black text-[#1A1225]">Customer Reviews</h3>
         <div class="flex items-center gap-2">
           <div class="flex items-center text-amber-400">
             <span v-for="n in 5" :key="n" class="material-icons-round text-lg">{{ n <= 4 ? 'star' : 'star_half' }}</span>
           </div>
           <span class="font-black text-[#1A1225] text-lg">4.8</span>
           <span class="text-slate-400 text-sm font-bold">({{ fakeReviews.length }} reviews)</span>
         </div>
       </div>

       <div class="space-y-6">
         <div v-for="review in fakeReviews" :key="review.id" class="p-6 bg-[#F8F6FB] rounded-2xl hover:bg-white hover:shadow-soft transition-all border border-transparent hover:border-[#EEEAF2]">
           <div class="flex items-center justify-between mb-3">
             <div class="flex items-center gap-3">
               <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-black text-sm">
                 {{ review.name.charAt(0) }}
               </div>
               <div>
                 <h5 class="font-black text-sm text-[#1A1225]">{{ review.name }}</h5>
                 <span class="text-[0.625rem] text-slate-400 font-bold">{{ review.date }}</span>
               </div>
             </div>
             <div class="flex items-center text-amber-400">
               <span v-for="n in 5" :key="n" class="material-icons-round text-sm">{{ n <= review.rating ? 'star' : 'star_outline' }}</span>
             </div>
           </div>
           <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ review.comment }}</p>
           <div v-if="review.verified" class="mt-3 flex items-center gap-1 text-[0.625rem] font-black text-tertiary-300 uppercase tracking-widest">
             <span class="material-icons-round text-sm">verified</span> Verified Purchase
           </div>
         </div>
       </div>
    </div>

    <!-- Related Products -->
    <div class="mb-16">
      <h3 class="font-heading text-3xl font-black text-[#1A1225] mb-8">You May Also Like</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="rp in relatedProducts" :key="rp.id"
          class="group bg-white rounded-2xl p-3 border border-[#EEEAF2] hover:border-primary-500/20 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
          @click="goToProduct(rp.id)">
          <div class="w-full aspect-square bg-[#F5F3F7] rounded-xl mb-3 flex items-center justify-center overflow-hidden">
            <img v-if="rp.image" :src="rp.image" :alt="rp.name" class="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform" />
            <span v-else class="material-icons-round text-2xl text-[#EEEAF2]">inventory_2</span>
          </div>
          <h4 class="font-black text-xs text-[#1A1225] truncate mb-1">{{ rp.name }}</h4>
          <span class="text-sm font-black text-primary-500">${{ (rp.salePrice || rp.price).toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center py-40 animate-fade-in shadow-soft bg-white rounded-3xl mx-4">
    <span class="material-icons-round text-6xl text-slate-200 mb-4 animate-pulse">inventory</span>
    <h3 class="font-heading text-2xl font-bold text-[#1A1225]">Scanning Database...</h3>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '../../store/customerStore.js'

const route = useRoute()
const router = useRouter()
const customerStore = useCustomerStore()

const productId = parseInt(route.params.id)
const product = computed(() => customerStore.getProductById(productId))

const quantity = ref(1)
const addedToCart = ref(false)
const selectedImageIdx = ref(0)
const selectedImage = computed({
  get: () => thumbnailImages.value[selectedImageIdx.value] || product.value?.image,
  set: (val) => {}
})

const thumbnailImages = computed(() => {
  const img = product.value?.image
  return img ? [img, img, img] : [null, null, null]
})

const fakeStock = computed(() => Math.floor(Math.random() * 10) + 3)

const isInWishlist = computed(() => customerStore.isInWishlist(productId))

// Dynamic features based on product category
const productFeatures = computed(() => {
  if (!product.value) return []
  if (product.value.category === 'Electronics') {
    return [
      { icon: 'noise_aware', title: 'Premium Sound Quality', desc: 'Crystal-clear audio with deep bass and rich mids for an immersive listening experience.' },
      { icon: 'battery_charging_full', title: 'Long Battery Life', desc: 'Up to 30 hours of continuous use on a single charge with fast-charge support.' },
      { icon: 'bluetooth', title: 'Bluetooth 5.3', desc: 'Latest Bluetooth technology for stable, low-latency wireless connectivity.' },
      { icon: 'speed', title: 'Fast Charging', desc: '10 minutes of charging gives you 3 hours of playback time.' },
      { icon: 'water_drop', title: 'Water Resistant', desc: 'IPX4 water resistance rating protects against sweat and light rain.' },
      { icon: 'touch_app', title: 'Touch Controls', desc: 'Intuitive touch controls for music, calls, and voice assistant activation.' }
    ]
  }
  return [
    { icon: 'diamond', title: 'Premium Materials', desc: 'Crafted with the finest materials for lasting quality and elegance.' },
    { icon: 'design_services', title: 'Expert Design', desc: 'Designed by world-class artisans with attention to every detail.' },
    { icon: 'eco', title: 'Sustainable', desc: 'Ethically sourced materials with minimal environmental impact.' },
    { icon: 'local_shipping', title: 'Free Shipping', desc: 'Complimentary express shipping on all orders worldwide.' },
    { icon: 'verified', title: 'Authenticity', desc: 'Certificate of authenticity included with every purchase.' },
    { icon: 'support_agent', title: 'VIP Support', desc: 'Dedicated customer support team available 24/7 for premium clients.' }
  ]
})

// Fake reviews
const fakeReviews = [
  { id: 1, name: 'Ahmed Hassan', date: 'Mar 15, 2026', rating: 5, comment: 'Absolutely incredible quality! The build and finish are premium. Sound quality exceeded my expectations — bass is deep, mids are clear, and highs are crisp. Highly recommended!', verified: true },
  { id: 2, name: 'Sarah Chen', date: 'Mar 10, 2026', rating: 4, comment: 'Great product overall. The design is sleek and comfortable for long use. Battery life is impressive. Only minor issue is the carrying case could be more sturdy.', verified: true },
  { id: 3, name: 'Michael Torres', date: 'Feb 28, 2026', rating: 5, comment: 'Best purchase I\'ve made this year. The noise cancellation is top-notch and the connectivity is seamless. Works perfectly with my phone and laptop.', verified: true },
  { id: 4, name: 'Fatima Al-Rashid', date: 'Feb 20, 2026', rating: 5, comment: 'Premium quality that justifies the price tag. I\'ve tried many brands but this one stands out in terms of both aesthetics and performance.', verified: false },
  { id: 5, name: 'James Wilson', date: 'Feb 12, 2026', rating: 4, comment: 'Very satisfied with the purchase. Shipping was fast and the product arrived in perfect condition. Works exactly as described.', verified: true }
]

// Related products
const relatedProducts = computed(() => {
  if (!product.value) return []
  return customerStore.allProducts
    .filter(p => p.id !== productId && p.category === product.value.category)
    .slice(0, 5)
    .concat(
      customerStore.allProducts
        .filter(p => p.id !== productId && p.category !== product.value.category)
        .slice(0, 5 - customerStore.allProducts.filter(p => p.id !== productId && p.category === product.value.category).length)
    )
    .slice(0, 5)
})

function calculateSubtotal() {
  if (!product.value) return 0
  return (product.value.salePrice || product.value.price) * quantity.value
}

function addToCart() {
  customerStore.addToCart(productId, quantity.value)
  addedToCart.value = true
  setTimeout(() => { addedToCart.value = false }, 2000)
}

function toggleWishlist() {
  customerStore.toggleWishlist(productId)
}

function goToProduct(id) {
  router.push(`/customer/product/${id}`)
  // Force page reload since we're on the same route
  router.go(0)
}
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.08);
}
.shadow-glow {
  box-shadow: 0 0 30px rgba(100, 210, 177, 0.2);
}
</style>
