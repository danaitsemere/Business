<template>
  <div class="w-full max-w-xl mx-auto px-4">
    <div class="bg-white rounded-[2.5rem] p-10 lg:p-14 border border-[#EEEAF2] shadow-2xl relative overflow-hidden">
      <div class="text-center mb-7 relative">
        <router-link to="/login" class="absolute left-0 top-0 text-[#475569] hover:text-[#7630A3] transition-colors group">
          <span class="material-icons-round text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
        </router-link>
        <div class="w-16 h-16 bg-[#7630A3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons-round text-3xl text-[#7630A3]">lock_reset</span>
        </div>
        <h2 class="font-heading text-2xl font-black text-[#1A1225] mb-1.5">Reset Password</h2>
        <p class="text-[#475569] font-medium text-sm">Enter your email to receive a reset link</p>
      </div>

      <form @submit.prevent="handleReset" v-if="!sent">
        <div class="space-y-2 mb-5">
          <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Email Address</label>
          <input type="email" class="input-gts" v-model="email" placeholder="your@email.com" required id="forgot-email">
        </div>
        <button type="submit" class="btn-gts-primary w-full py-5 flex items-center justify-center gap-3" id="forgot-submit-btn">
          <span class="material-icons-round">send</span>
          Send Reset Link
        </button>
      </form>

      <div v-else class="text-center py-5 animate-scale-in">
        <div class="w-20 h-20 bg-[#64D2B1]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <span class="material-icons-round text-4xl text-[#64D2B1]">mark_email_read</span>
        </div>
        <h3 class="font-heading text-lg font-black text-[#1A1225] mb-2">Check your email</h3>
        <p class="text-[#475569] text-sm font-medium">We've sent a password reset link to <strong class="text-[#1A1225]">{{ email }}</strong></p>
        <router-link to="/login" class="btn-gts-secondary mt-5 inline-flex">Back to Sign In</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const email = ref('')
const sent = ref(false)
function handleReset() { sent.value = true }
</script>
