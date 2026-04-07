<template>
  <div class="w-full max-w-xl mx-auto px-4">
    <div class="bg-white rounded-[2.5rem] p-10 lg:p-14 border border-[#EEEAF2] shadow-2xl relative overflow-hidden text-center">
      <!-- Back Button -->
      <router-link to="/" class="absolute left-10 top-10 text-[#475569] hover:text-[#7630A3] transition-colors group z-20">
         <span class="material-icons-round text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
      </router-link>

      <div class="mb-10 pt-4 flex flex-col items-center">
        <img src="../../assets/logo.png" alt="GTS Logo" class="h-16 w-auto mb-8 hover:scale-105 transition-transform duration-300">
        
        <div class="flex items-center justify-center gap-4 mb-4">
           <div class="h-10 w-0.5 bg-[#7630A3] opacity-30 rounded-full"></div>
           <div class="text-left">
              <h2 class="font-heading text-2xl font-black text-[#7630A3] leading-none mb-1">
                 Sign In
              </h2>
              <span class="text-[0.625rem] font-black text-[#475569] uppercase tracking-[0.3em]">
                 Grand Tech Solutions
              </span>
           </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold mb-6 bg-red-50 border border-red-200 text-red-600 text-left animate-fade-in">
        <span class="material-icons-round">error</span>
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6 relative z-10 text-left">
        <div class="space-y-4">
           <div class="space-y-2">
             <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Email Address</label>
             <input type="email" class="input-gts" v-model="email" placeholder="your@email.com" required id="login-email">
           </div>
           <div class="space-y-2">
             <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Password</label>
             <input type="password" class="input-gts" v-model="password" placeholder="Enter your password" required id="login-password">
           </div>
        </div>

        <div class="flex justify-between items-center text-[0.813rem] font-bold text-[#475569]">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="rememberMe" class="accent-[#7630A3] rounded w-4 h-4">
            <span>Remember me</span>
          </label>
          <router-link to="/forgot-password" class="text-[#7630A3] hover:underline font-black">Forgot password?</router-link>
        </div>

        <button type="submit" class="btn-gts-primary w-full py-5 flex items-center justify-center gap-3" :disabled="loading">
          <span v-if="loading" class="material-icons-round animate-spin text-lg">sync</span>
          <template v-else>
            Sign In <span class="material-icons-round text-lg">login</span>
          </template>
        </button>
      </form>

      <!-- Register Link -->
      <p class="mt-8 text-sm font-medium text-[#475569]">
        Don't have an account? <router-link to="/register" class="text-[#7630A3] font-black hover:underline">Create one</router-link>
      </p>

      <!-- Demo Accounts -->
      <div class="mt-10 pt-8 border-t border-[#EEEAF2]">
        <p class="text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#7C757E] text-center mb-6">Quick Demo Access</p>
        <div class="grid grid-cols-2 gap-3 text-left">
          <button v-for="demo in demoAccounts" :key="demo.email"
            class="flex items-center gap-3 px-4 py-3 bg-[#F8F6FB] border border-[#EEEAF2] rounded-xl hover:border-[#7630A3] hover:bg-white transition-all shadow-sm group"
            @click="fillDemo(demo)">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm text-[#7630A3] group-hover:bg-[#7630A3] group-hover:text-white transition-colors">
              <span class="material-icons-round text-lg">{{ demo.icon }}</span>
            </div>
            <div class="truncate">
              <span class="block text-[0.75rem] font-black text-[#1A1225] leading-none mb-0.5 truncate">{{ demo.label }}</span>
              <span class="block text-[0.625rem] text-[#7C757E] font-bold truncate">{{ demo.email }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore.js'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')
const loading = ref(false)

const demoAccounts = [
  { label: 'Admin', email: 'admin@gts.com', icon: 'admin_panel_settings' },
  { label: 'Customer', email: 'yusuf@gts.com', icon: 'person' }
]

function fillDemo(demo) { email.value = demo.email; password.value = 'password123' }

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

<style scoped>
.shadow-soft {
  box-shadow: 0 10px 40px -10px rgba(118, 48, 163, 0.1);
}
</style>
