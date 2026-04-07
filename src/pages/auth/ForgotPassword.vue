<template>
  <div class="w-full">
    <div class="card-glass p-10">
      <div class="text-center mb-7 relative">
        <router-link to="/login" class="absolute left-0 top-0 text-neutral-500 hover:text-white transition-colors">
          <span class="material-icons-round">arrow_back</span>
        </router-link>
        <div class="w-16 h-16 bg-primary-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons-round text-3xl text-primary-300">lock_reset</span>
        </div>
        <h2 class="font-heading text-2xl font-bold mb-1.5">Reset Password</h2>
        <p class="text-neutral-500">Enter your email to receive a reset link</p>
      </div>

      <form @submit.prevent="handleReset" v-if="!sent">
        <div class="flex flex-col gap-1.5 mb-5">
          <label class="text-sm font-medium text-[#b8b0c4]">Email Address</label>
          <input type="email" class="input-gts" v-model="email" placeholder="your@email.com" required id="forgot-email">
        </div>
        <button type="submit" class="btn-gts-primary btn-gts-lg w-full" id="forgot-submit-btn">
          <span class="material-icons-round">send</span>
          Send Reset Link
        </button>
      </form>

      <div v-else class="text-center py-5 animate-scale-in">
        <div class="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
          <span class="material-icons-round text-4xl text-green-400">mark_email_read</span>
        </div>
        <h3 class="font-heading text-lg font-bold mb-2">Check your email</h3>
        <p class="text-neutral-500 text-sm">We've sent a password reset link to <strong class="text-white">{{ email }}</strong></p>
        <router-link to="/login" class="btn-gts-outline mt-5 inline-flex">Back to Login</router-link>
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
