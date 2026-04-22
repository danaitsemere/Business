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

          <h1 class="font-heading text-3xl font-black text-[#1A1225] text-center mb-8">Welcome Back</h1>

          <div v-if="error" class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold mb-5 bg-red-50 border border-red-200 text-red-600 animate-fade-in">
            <AlertCircle class="w-4 h-4 shrink-0" />
            {{ error }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <input type="email" v-model="email" placeholder="Email"
              class="input-gts"
              required id="login-email">

            <input type="password" v-model="password" placeholder="Password"
              class="input-gts"
              required id="login-password">

            <button type="submit"
              class="btn-gts-primary w-full"
              :disabled="loading">
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <span v-else>Sign In</span>
            </button>
          </form>

          <div class="text-center mt-6 space-y-2">
            <router-link to="/forgot-password" class="block text-sm text-[#475569] font-medium hover:text-[#7630A3] transition-colors">
              Forgot Password?
            </router-link>
            <router-link to="/register" class="block text-sm text-[#475569] font-medium hover:text-[#7630A3] transition-colors">
              Create an Account
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
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function handleLogin() {
  error.value = ''
  loading.value = true
  
  setTimeout(() => {
    const result = authStore.login(email.value, password.value)
    loading.value = false
    if (result.success) {
      const role = result.user.role
      if (role === 'admin') router.push('/admin/dashboard')
      else router.push('/customer/home')
    } else {
      error.value = result.message
    }
  }, 600)
}
</script>
