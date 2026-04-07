<template>
  <div class="w-full max-w-xl mx-auto px-4">
    <div class="bg-white rounded-[2.5rem] p-10 lg:p-14 border border-[#EEEAF2] shadow-2xl text-center relative overflow-hidden">
      <!-- Decorative Backdrop -->
      <div class="absolute -top-20 -right-20 w-80 h-80 bg-[#7630A3]/5 rounded-full blur-[100px]"></div>
      
      <!-- Brand Lockup -->
      <div class="mb-14 relative z-10 flex flex-col items-center">
        <img src="../../assets/logo.png" alt="GTS Logo" class="h-24 w-auto mb-10 hover:scale-105 transition-transform duration-500 cursor-pointer">
        
        <div class="flex items-center justify-center gap-6">
           <div class="h-16 w-1 bg-[#7630A3] opacity-30 rounded-full"></div>
           <div class="text-left">
              <h1 class="font-heading text-4xl font-black text-[#7630A3] leading-none mb-1 tracking-tight">
                 Grand Technology Solutions
              </h1>
              <p class="text-[0.625rem] font-black text-[#475569] uppercase tracking-[0.4em] mt-2">
                 Innovate • Inspire • Transform.
              </p>
           </div>
        </div>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 gap-2 mb-10">
        <div v-for="(feature, i) in features" :key="i"
          class="flex items-center gap-5 p-5 bg-[#F8F6FB] hover:bg-white border-2 border-transparent hover:border-[#7630A3]/5 rounded-3xl transition-all duration-300 group cursor-default">
          <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#7630A3] shadow-sm transform group-hover:rotate-6 transition-transform">
             <span class="material-icons-round text-2xl">{{ feature.icon }}</span>
          </div>
          <div class="text-left">
             <h4 class="text-[1rem] font-black text-[#1A1225] mb-0.5 leading-none">{{ feature.title }}</h4>
             <p class="text-[0.813rem] text-[#475569] font-medium">{{ feature.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 mb-14 relative z-10">
        <router-link to="/login" class="flex-1 btn-gts-primary !py-5 rounded-2xl shadow-soft font-black text-sm uppercase tracking-widest text-center">
           Sign In
        </router-link>
        <router-link to="/register" class="flex-1 bg-[#EEEAF2] text-[#7630A3] font-black py-5 rounded-2xl hover:bg-[#E8E1EF] transition-colors text-sm uppercase tracking-widest text-center text-center">
           Create Account
        </router-link>
      </div>

      <p class="text-[#7C757E] text-[0.688rem] font-black uppercase tracking-[0.3em]">© 2026 Grand Tech Solutions • Designed for Precision</p>
    </div>
  </div>
</template>

<script setup>
const features = [
  { icon: 'auto_awesome', title: 'Curated Marketplace', desc: 'Premium products & verified business listings' },
  { icon: 'verified', title: 'Trusted Platform', desc: 'Secure ecosystem managed by GTS administrators' }
]
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 10px 40px -10px rgba(118, 48, 163, 0.1);
}
</style>