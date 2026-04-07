<template>
  <div class="w-full max-w-xl mx-auto px-4">
    <div class="bg-white rounded-[2.5rem] p-10 lg:p-14 border border-[#EEEAF2] shadow-2xl relative overflow-hidden">
      <!-- Back -->
      <router-link to="/" class="absolute left-10 top-10 text-[#475569] hover:text-[#7630A3] transition-colors group z-20">
        <span class="material-icons-round text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
      </router-link>

      <div class="text-center mb-10 pt-4">
        <img src="../../assets/logo.png" alt="GTS Logo" class="h-14 w-auto mb-6 mx-auto hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-center gap-4 mb-4">
          <div class="h-10 w-0.5 bg-[#7630A3] opacity-30 rounded-full"></div>
          <div class="text-left">
            <h2 class="font-heading text-2xl font-black text-[#7630A3] leading-none mb-1">Create Account</h2>
            <span class="text-[0.625rem] font-black text-[#475569] uppercase tracking-[0.3em]">Join as a Customer</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleRegister" class="text-left">
        <div class="space-y-4 mb-6">
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Full Name</label>
            <input type="text" class="input-gts" v-model="form.fullName" placeholder="Enter your full name" required id="register-name">
          </div>
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Email Address</label>
            <input type="email" class="input-gts" v-model="form.email" placeholder="your@email.com" required id="register-email">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Password</label>
              <input type="password" class="input-gts" v-model="form.password" placeholder="Min 6 characters" required id="register-password">
            </div>
            <div class="space-y-2">
              <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Phone</label>
              <input type="tel" class="input-gts" v-model="form.phone" placeholder="+971..." required id="register-phone">
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Location <span class="normal-case text-[#7C757E]/60">(optional)</span></label>
            <input type="text" class="input-gts" v-model="form.location" placeholder="City, Country">
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold mb-5 bg-red-50 border border-red-200 text-red-600 animate-fade-in">
          <span class="material-icons-round">error</span>
          {{ error }}
        </div>

        <!-- Success -->
        <div v-if="success" class="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold mb-5 bg-[#64D2B1]/10 border border-[#64D2B1]/30 text-[#64D2B1] animate-fade-in">
          <span class="material-icons-round">check_circle</span>
          Account created! Redirecting...
        </div>

        <button type="submit" class="btn-gts-primary w-full py-5 flex items-center justify-center gap-3" id="register-submit-btn" :disabled="loading">
          <span v-if="loading" class="material-icons-round animate-spin text-lg">sync</span>
          <template v-else>
            Create Account <span class="material-icons-round text-lg">arrow_forward</span>
          </template>
        </button>
      </form>

      <p class="text-center mt-8 text-sm font-medium text-[#475569]">
        Already have an account? <router-link to="/login" class="text-[#7630A3] font-black hover:underline">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore.js'

const router = useRouter()
const authStore = useAuthStore()
const error = ref('')
const success = ref(false)
const loading = ref(false)

const form = ref({ fullName: '', email: '', password: '', phone: '', location: '' })

function handleRegister() {
  error.value = ''
  success.value = false
  
  if (form.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true
  setTimeout(() => {
    const result = authStore.register({ ...form.value })
    loading.value = false
    if (result.success) {
      success.value = true
      setTimeout(() => router.push('/customer/home'), 1000)
    } else {
      error.value = result.message
    }
  }, 600)
}
</script>
