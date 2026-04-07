<template>
  <div class="animate-fade-in pb-20" v-if="business">
    <!-- Hero Banner Area -->
    <div class="relative w-full h-[300px] rounded-3xl overflow-hidden mb-[-100px] border border-[#EEEAF2] shadow-soft">
      <div class="absolute inset-0 bg-[#0A0D14]/90 flex items-center justify-center">
         <div class="text-[8rem] font-black text-white/5 uppercase tracking-tighter select-none">
            {{ business.name }}
         </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#1A1225]/40 to-transparent"></div>
    </div>

    <!-- Company Info Card -->
    <div class="relative z-10 max-w-6xl mx-auto px-6">
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-xl flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
        <div class="flex flex-col md:flex-row items-center md:items-end gap-8">
          <div class="w-32 h-32 bg-white rounded-3xl border-2 border-[#EEEAF2] p-2 shadow-soft flex items-center justify-center transform -translate-y-4">
             <div class="w-full h-full bg-[#1A1225] rounded-2xl flex items-center justify-center text-white font-black text-3xl">
                {{ business.name.charAt(0) }}
             </div>
          </div>
          <div class="text-center md:text-left pb-4">
            <div class="flex items-center justify-center md:justify-start gap-3 mb-1">
              <h1 class="font-heading text-3xl font-black text-[#1A1225]">{{ business.name }}</h1>
              <span v-if="business.verified" class="bg-[#64D2B1] text-white text-[0.625rem] font-black px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1">
                 <span class="material-icons-round text-sm">verified</span> Verified
              </span>
            </div>
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 font-bold text-sm">
               <span class="flex items-center gap-1.5"><span class="material-icons-round text-base">category</span> {{ business.category }}</span>
               <span class="flex items-center gap-1.5"><span class="material-icons-round text-base">location_on</span> {{ business.location }}</span>
               <span class="flex items-center gap-1.5 text-amber-500"><span class="material-icons-round text-base">star</span> {{ business.rating }} (124 Reviews)</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3 pb-4">
           <button class="px-8 py-3.5 bg-[#D9E6FB] text-[#7630A3] font-black rounded-xl hover:bg-[#CADCFA] transition-all">Follow</button>
           <button class="px-8 py-3.5 bg-[#7630A3] text-white font-black rounded-xl hover:brightness-110 shadow-soft">Contact Sales</button>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs Bar -->
    <div class="max-w-6xl mx-auto px-6 mt-12 mb-10 border-b border-[#EEEAF2]">
       <div class="flex items-center gap-10">
          <button v-for="tab in tabs" :key="tab"
            class="relative pb-4 text-sm font-black uppercase tracking-widest transition-all"
            :class="activeTab === tab ? 'text-[#7630A3]' : 'text-slate-400 hover:text-slate-600'"
            @click="activeTab = tab">
            {{ tab }}
            <div v-if="activeTab === tab" class="absolute bottom-0 left-0 w-full h-[3px] bg-[#7630A3] rounded-full"></div>
          </button>
       </div>
    </div>

    <!-- Tab Content -->
    <div class="max-w-6xl mx-auto px-6">
       <!-- Products Grid -->
       <div v-if="activeTab === 'Products'" class="space-y-8">
          <div class="flex items-center justify-between">
             <h2 class="font-heading text-2xl font-black text-[#1A1225]">Featured Solutions</h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div v-for="product in businessProducts" :key="product.id"
              class="group bg-white rounded-2xl p-3 border border-[#EEEAF2] hover:border-[#7630A3]/20 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              @click="$router.push(`/customer/product/${product.id}`)">
              
              <div class="w-full aspect-square bg-[#F5F3F7] rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-contain p-2 mix-blend-multiply transition-transform group-hover:scale-110" />
                <span v-else class="material-icons-round text-3xl text-[#EEEAF2]">inventory_2</span>
                <span v-if="product.onSale" class="absolute top-2 left-2 bg-red-500 text-white text-[0.5rem] font-black px-1.5 py-0.5 rounded tracking-tighter uppercase">Sale</span>
              </div>

              <span class="text-[0.5rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{{ product.category }}</span>
              <h3 class="font-heading font-black text-[0.75rem] text-[#1A1225] mb-1 leading-tight group-hover:text-[#7630A3] transition-colors truncate">
                {{ product.name }}
              </h3>
              
              <div class="flex items-center gap-1 mb-2">
                <div class="flex items-center text-amber-400">
                  <span v-for="i in 5" :key="i" class="material-icons-round text-[0.5rem]">
                    {{ i <= 4 ? 'star' : 'star_half' }}
                  </span>
                </div>
                <span class="text-[0.5rem] text-slate-400 font-bold">(4.8)</span>
              </div>
              
              <div class="mt-auto flex items-end justify-between pt-2 border-t border-[#F5F3F7]">
                <div>
                  <span v-if="product.salePrice" class="block text-[0.45rem] text-slate-400 line-through font-bold mb-0.5">ETB {{ product.price }}</span>
                  <span class="text-[0.938rem] font-black text-[#1A1225] tracking-tight">
                    <span class="text-[#7630A3] text-[0.625rem] font-bold">ETB</span> {{ (product.salePrice || product.price).toLocaleString() }}
                  </span>
                </div>
                <span class="material-icons-round text-slate-300 text-sm group-hover:text-[#7630A3] transition-all">arrow_forward</span>
              </div>
            </div>
          </div>
       </div>

       <!-- About Tab -->
       <div v-if="activeTab === 'About'" class="animate-fade-in">
         <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 py-6">
           <div class="lg:col-span-2 space-y-8">
             <div>
               <h2 class="font-heading text-3xl font-black text-[#1A1225] mb-6">About {{ business.name }}</h2>
               <p class="text-slate-500 text-lg leading-relaxed font-medium mb-6">
                 {{ business.description }}
               </p>
               <p class="text-slate-500 text-base leading-relaxed font-medium">
                 Founded in 2015, {{ business.name }} has grown from a small outfit into one of the most trusted names in the {{ business.category.toLowerCase() }} industry. Our team of 50+ professionals is dedicated to delivering exceptional products and services that exceed client expectations. We pride ourselves on innovation, quality, and customer-first thinking.
               </p>
             </div>

             <!-- Stats -->
             <div class="grid grid-cols-3 gap-6">
               <div class="bg-[#F8F6FB] rounded-2xl p-6 text-center">
                 <span class="text-3xl font-black text-[#1A1225] block mb-1">{{ business.totalViews?.toLocaleString() || '4.8k' }}</span>
                 <span class="text-[0.625rem] font-black text-slate-400 uppercase tracking-widest">Total Views</span>
               </div>
               <div class="bg-[#F8F6FB] rounded-2xl p-6 text-center">
                 <span class="text-3xl font-black text-[#7630A3] block mb-1">{{ business.productCount || 12 }}</span>
                 <span class="text-[0.625rem] font-black text-slate-400 uppercase tracking-widest">Products</span>
               </div>
               <div class="bg-[#F8F6FB] rounded-2xl p-6 text-center">
                 <span class="text-3xl font-black text-[#1A1225] block mb-1">98%</span>
                 <span class="text-[0.625rem] font-black text-slate-400 uppercase tracking-widest">Satisfaction</span>
               </div>
             </div>

             <!-- Values -->
             <div class="space-y-4">
               <h3 class="font-heading text-xl font-black text-[#1A1225]">Our Values</h3>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div v-for="(val, idx) in companyValues" :key="idx" class="flex items-start gap-3 p-4 bg-[#F8F6FB] rounded-xl">
                   <span class="material-icons-round text-[#7630A3] mt-0.5">{{ val.icon }}</span>
                   <div>
                     <h4 class="font-black text-sm text-[#1A1225] mb-1">{{ val.title }}</h4>
                     <p class="text-xs text-slate-500 font-medium">{{ val.desc }}</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           <!-- Contact sidebar -->
           <div class="space-y-6">
             <div class="bg-white border border-[#EEEAF2] rounded-2xl p-8 space-y-6 shadow-soft">
               <div class="flex items-center gap-4 border-b border-[#EEEAF2] pb-6">
                  <div class="w-10 h-10 bg-[#7630A3]/10 text-[#7630A3] rounded-lg flex items-center justify-center">
                     <span class="material-icons-round">contact_support</span>
                  </div>
                  <span class="font-black text-[#1A1225]">Support Details</span>
               </div>
               <div class="space-y-4">
                  <div class="flex flex-col">
                     <span class="text-[0.625rem] text-slate-400 font-bold uppercase mb-1">Call Us</span>
                     <span class="text-sm font-black text-[#1A1225]">{{ business.phone || '+1 (555) 234-8901' }}</span>
                  </div>
                  <div class="flex flex-col">
                     <span class="text-[0.625rem] text-slate-400 font-bold uppercase mb-1">Email</span>
                     <span class="text-sm font-black text-[#1A1225]">{{ business.email || 'support@gts.et' }}</span>
                  </div>
                  <div class="flex flex-col">
                     <span class="text-[0.625rem] text-slate-400 font-bold uppercase mb-1">Location</span>
                     <span class="text-sm font-black text-[#1A1225]">{{ business.location }}</span>
                  </div>
               </div>
             </div>

             <!-- Business hours -->
             <div class="bg-white border border-[#EEEAF2] rounded-2xl p-8 space-y-4 shadow-soft">
               <h4 class="font-black text-sm text-[#1A1225] flex items-center gap-2">
                 <span class="material-icons-round text-[#7630A3]">schedule</span> Business Hours
               </h4>
               <div class="space-y-2 text-sm">
                 <div class="flex justify-between"><span class="text-slate-400 font-bold">Mon - Fri</span><span class="font-black text-[#1A1225]">9:00 AM - 6:00 PM</span></div>
                 <div class="flex justify-between"><span class="text-slate-400 font-bold">Saturday</span><span class="font-black text-[#1A1225]">10:00 AM - 4:00 PM</span></div>
                 <div class="flex justify-between"><span class="text-slate-400 font-bold">Sunday</span><span class="font-black text-red-400">Closed</span></div>
               </div>
             </div>
           </div>
         </div>
       </div>

       <!-- Reviews Tab -->
       <div v-if="activeTab === 'Reviews'" class="animate-fade-in py-6">
         <div class="flex items-center justify-between mb-8">
           <h2 class="font-heading text-2xl font-black text-[#1A1225]">Customer Reviews</h2>
           <div class="flex items-center gap-2">
             <div class="flex text-amber-400">
               <span v-for="n in 5" :key="n" class="material-icons-round text-lg">{{ n <= Math.floor(business.rating) ? 'star' : 'star_half' }}</span>
             </div>
             <span class="font-black text-lg text-[#1A1225]">{{ business.rating }}</span>
           </div>
         </div>

         <div class="space-y-4">
           <div v-for="review in fakeReviews" :key="review.id" 
             class="p-6 bg-[#F8F6FB] rounded-2xl hover:bg-white hover:shadow-soft transition-all border border-transparent hover:border-[#EEEAF2]">
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
               <div class="flex text-amber-400">
                 <span v-for="n in 5" :key="n" class="material-icons-round text-sm">{{ n <= review.rating ? 'star' : 'star_outline' }}</span>
               </div>
             </div>
             <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ review.comment }}</p>
           </div>
         </div>
       </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center py-40 animate-fade-in text-center px-4">
    <div class="w-20 h-20 bg-[#F5F3F7] rounded-full flex items-center justify-center text-slate-300 mb-6">
       <span class="material-icons-round text-4xl">store</span>
    </div>
    <h3 class="font-heading text-2xl font-bold text-[#1A1225] mb-2">Merchant Unavailable</h3>
    <p class="text-slate-500 font-medium mb-8">The shop you are looking for is currently not in our curated ecosystem.</p>
    <router-link to="/customer/home?tab=shops" class="btn-gts-primary px-10 rounded-xl">Back to Shops</router-link>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCustomerStore } from '../../store/customerStore.js'
import { products } from '../../mock/products.js'

const route = useRoute()
const customerStore = useCustomerStore()

const businessId = parseInt(route.params.id)
const business = computed(() => customerStore.allBusinesses.find(b => b.id === businessId))
const businessProducts = computed(() => products.filter(p => p.merchantId === business.value?.userId || p.merchantId === business.value?.id))

const activeTab = ref('Products')
const tabs = ['Products', 'About', 'Reviews']

const companyValues = [
  { icon: 'diamond', title: 'Quality First', desc: 'We never compromise on the quality of our products and services.' },
  { icon: 'handshake', title: 'Trust & Integrity', desc: 'Built on transparent relationships and honest business practices.' },
  { icon: 'lightbulb', title: 'Innovation', desc: 'Continuously pushing boundaries to bring you the latest solutions.' },
  { icon: 'groups', title: 'Customer Centric', desc: 'Every decision we make starts with our customer needs.' }
]

const fakeReviews = [
  { id: 1, name: 'Kidist Tesfaye', date: 'Mar 28, 2026', rating: 5, comment: `Excellent experience with ${business.value?.name || 'this store'}. Products arrived on time and in perfect condition. Customer service was incredibly helpful and responsive.` },
  { id: 2, name: 'Bereket Mulugeta', date: 'Mar 15, 2026', rating: 4, comment: 'Great quality products and fair pricing. The only thing I\'d improve is faster shipping options. Otherwise, very satisfied with my purchase.' },
  { id: 3, name: 'Hanna Gebremedhin', date: 'Mar 5, 2026', rating: 5, comment: 'Been a loyal customer for over a year now. Consistently impressed by the quality and attention to detail. Highly recommend to anyone looking for premium products.' },
  { id: 4, name: 'Yonas Abera', date: 'Feb 20, 2026', rating: 5, comment: 'Absolutely love shopping here! The product selection is curated perfectly. Every item I\'ve purchased has exceeded expectations.' },
  { id: 5, name: 'Rahel Desta', date: 'Feb 10, 2026', rating: 4, comment: 'Solid store with good products. Pricing is competitive and the verified badge gives me confidence in the authenticity of purchases.' }
]
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.08); }
</style>
