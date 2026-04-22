<template>
  <div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    style="background: linear-gradient(135deg, #E8E1F0 0%, #D6E8F7 40%, #E8E1F0 70%, #DCE6F5 100%);">
    <img src="/image/wave-background.png" alt="" class="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none z-0">
    <div class="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
      <div class="hidden lg:flex w-1/2 items-center justify-start pointer-events-none">
        <img src="/image/marketplace-illustration.png" alt="" 
          class="w-full max-w-[700px] max-h-[720px] object-contain drop-shadow-2xl animate-float">
      </div>

      <div class="w-full lg:w-[500px] animate-fade-in">
        <div class="bg-white/95 backdrop-blur-sm rounded-3xl p-12 border-2 border-[#7630A3]/15 shadow-[0_20px_60px_-15px_rgba(118,48,163,0.15)] relative">
          <router-link to="/" class="absolute left-8 top-8 text-[#A399AC] hover:text-[#7630A3] transition-colors group">
            <ArrowLeft class="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </router-link>

          <div class="flex items-center justify-center gap-3 mb-8">
            <img src="/image/logo.png" alt="GTS Logo" class="h-10 w-auto">
            <div class="text-left">
              <span class="font-heading text-sm font-black text-[#7630A3] leading-none block">Grand Technology</span>
              <span class="font-heading text-sm font-black text-[#7630A3] leading-none block">Solutions</span>
            </div>
          </div>

          <h1 class="font-heading text-3xl font-black text-[#1A1225] text-center mb-3">Reset Password</h1>
          <p class="text-sm text-[#475569] font-medium text-center mb-8">Enter your email to receive a reset link</p>

          <form @submit.prevent="handleReset" v-if="!sent" class="space-y-4">
            <input type="email" v-model="email" placeholder="Email"
              class="input-gts"
              required id="forgot-email">

            <button type="submit"
              class="btn-gts-primary w-full"
              id="forgot-submit-btn">
              Send Reset Link
            </button>
          </form>

          <div v-else class="text-center py-4 animate-scale-in">
            <div class="w-16 h-16 bg-[#64D2B1]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail class="w-8 h-8 text-[#64D2B1]" />
            </div>
            <h3 class="font-heading text-lg font-black text-[#1A1225] mb-2">Check your email</h3>
            <p class="text-[#475569] text-sm font-medium">We've sent a reset link to <strong class="text-[#1A1225]">{{ email }}</strong></p>
          </div>

          <div class="text-center mt-6">
            <router-link to="/login" class="text-sm text-[#475569] font-medium hover:text-[#7630A3] transition-colors">
              Back to <span class="font-black text-[#7630A3]">Sign In</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Mail, ArrowLeft } from 'lucide-vue-next'

const email = ref('')
const sent = ref(false)
function handleReset() { sent.value = true }
</script>
