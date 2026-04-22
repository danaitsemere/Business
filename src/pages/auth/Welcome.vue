<template>
  <div class="h-screen flex flex-col overflow-hidden bg-[#F8F6FB]">
    <header class="w-full bg-white/80 backdrop-blur-md border-b border-[#EEEAF2] px-6 lg:px-12 py-3 shrink-0 z-50">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4 cursor-pointer group">
          <img src="/image/logo.png" alt="GTS Logo" class="h-10 w-auto group-hover:scale-105 transition-transform duration-300">
          <div class="h-8 w-[1.5px] bg-[#7630A3] opacity-30"></div>
          <div class="flex flex-col justify-center text-left">
            <span class="font-heading text-base font-black text-[#7630A3] leading-none tracking-tight">
              Grand Technology Solutions
            </span>
            <span class="text-[0.45rem] font-black uppercase tracking-[0.3em] text-[#7630A3]">
              Innovate • Inspire • Transform
            </span>
          </div>
        </div>

        <router-link to="/register"
          class="btn-gts-primary">
          Get Started
        </router-link>
      </div>
    </header>

    <section class="flex-1 relative overflow-hidden">
      <img src="/image/wave-background.png" alt="" class="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none z-0">

      <div class="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 w-full">
          <div class="flex flex-col justify-center">
            <h1 class="font-heading text-3xl lg:text-5xl font-black text-[#1A1225] leading-[1.1] mb-5 tracking-tight">
              Find Trusted Products & Services Nearby
            </h1>
            <p class="text-[#475569] text-sm lg:text-base font-medium mb-8 max-w-lg leading-relaxed">
              Discover verified merchants and skilled service providers. Connect instantly through our secure chat platform.
            </p>
            <div class="flex items-center gap-4 mb-10">
              <router-link to="/login"
                class="btn-gts-primary">
                Sign In
              </router-link>
              <router-link to="/register"
                class="btn-gts-outline">
                Register
              </router-link>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div v-for="(step, i) in steps" :key="i"
                class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-[#EEEAF2] shadow-sm group hover:shadow-md transition-all text-center">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110"
                  :style="{ background: step.bg }">
                  <component :is="step.iconComp" class="w-5 h-5" :style="{ color: step.color }" />
                </div>
                <h4 class="text-sm font-black text-[#1A1225] mb-0.5">{{ step.title }}</h4>
                <p class="text-[0.68rem] text-[#475569] font-medium leading-snug">{{ step.desc }}</p>
              </div>
            </div>
          </div>

          <div class="hidden lg:flex items-center justify-center">
            <img src="/image/marketplace-illustration.png" alt="GTS Marketplace" class="w-full max-w-[580px] h-auto drop-shadow-2xl animate-float">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Search, MessageCircle, ClipboardList, Star } from 'lucide-vue-next'

const steps = [
  { iconComp: Search, title: 'Browse', desc: 'Discover products & services', bg: 'rgba(118,48,163,0.1)', color: '#7630A3' },
  { iconComp: MessageCircle, title: 'Connect', desc: 'Chat with providers directly', bg: 'rgba(100,210,177,0.1)', color: '#64D2B1' },
  { iconComp: ClipboardList, title: 'Request', desc: 'Submit service requests', bg: 'rgba(118,48,163,0.1)', color: '#7630A3' },
  { iconComp: Star, title: 'Review', desc: 'Rate & track everything', bg: 'rgba(100,210,177,0.1)', color: '#64D2B1' }
]
</script>