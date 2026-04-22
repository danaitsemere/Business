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

          <h1 class="font-heading text-3xl font-black text-[#1A1225] text-center mb-8">Create Account</h1>

          <div v-if="error" class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold mb-4 bg-red-50 border border-red-200 text-red-600 animate-fade-in">
            <AlertCircle class="w-4 h-4 shrink-0" /> {{ error }}
          </div>
          <div v-if="success" class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold mb-4 bg-[#64D2B1]/10 border border-[#64D2B1]/30 text-[#64D2B1] animate-fade-in">
            <CheckCircle2 class="w-4 h-4 shrink-0" /> Account created! Redirecting...
          </div>

          <form @submit.prevent="handleRegister" class="space-y-3">
            <input type="text" v-model="form.fullName" placeholder="Full Name"
              class="input-gts"
              required id="register-name">
            <input type="email" v-model="form.email" placeholder="Email"
              class="input-gts"
              required id="register-email">
            <div class="grid grid-cols-2 gap-3">
              <input type="password" v-model="form.password" placeholder="Password"
                class="input-gts"
                required id="register-password">
              <input type="tel" v-model="form.phone" placeholder="Phone"
                class="input-gts"
                required id="register-phone">
            </div>
            <input type="text" v-model="form.location" placeholder="Location (optional)"
              class="input-gts">

            <button type="submit"
              class="btn-gts-primary w-full mt-2"
              id="register-submit-btn" :disabled="loading">
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <span v-else>Create Account</span>
            </button>
          </form>

          <div class="text-center mt-6">
            <router-link to="/login" class="text-sm text-[#475569] font-medium hover:text-[#7630A3] transition-colors">
              Already have an account? <span class="font-black text-[#7630A3]">Sign In</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore.js'
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const error = ref('')
const success = ref(false)
const loading = ref(false)
const form = ref({ fullName: '', email: '', password: '', phone: '', location: '' })

function handleRegister() {
  error.value = ''
  success.value = false
  if (form.value.password.length < 6) { error.value = 'Password must be at least 6 characters'; return }
  loading.value = true
  setTimeout(() => {
    const result = authStore.register({ ...form.value })
    loading.value = false
    if (result.success) { success.value = true; setTimeout(() => router.push('/customer/home'), 1000) }
    else { error.value = result.message }
  }, 600)
}
</script>
