<template>
  <div class="w-full">
    <div class="card-glass p-10">
      <div class="text-center mb-7 relative">
        <router-link to="/role-select" class="absolute left-0 top-0 text-neutral-500 hover:text-white transition-colors">
          <span class="material-icons-round">arrow_back</span>
        </router-link>
        <div class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-500/15 rounded-full text-primary-300 text-[0.813rem] font-semibold mb-4">
          <span class="material-icons-round text-base">{{ roleInfo.icon }}</span>
          {{ roleInfo.label }}
        </div>
        <h2 class="font-heading text-2xl font-bold mb-1.5">Create Account</h2>
        <p class="text-neutral-500">Fill in your details to get started</p>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="flex flex-col gap-1.5 mb-5">
          <label class="text-sm font-medium text-[#b8b0c4]">Full Name</label>
          <input type="text" class="input-gts" v-model="form.fullName" placeholder="Enter your full name" required id="register-name">
        </div>
        <div class="flex flex-col gap-1.5 mb-5">
          <label class="text-sm font-medium text-[#b8b0c4]">Email</label>
          <input type="email" class="input-gts" v-model="form.email" placeholder="your@email.com" required id="register-email">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5 mb-5">
            <label class="text-sm font-medium text-[#b8b0c4]">Password</label>
            <input type="password" class="input-gts" v-model="form.password" placeholder="Min 6 characters" required id="register-password">
          </div>
          <div class="flex flex-col gap-1.5 mb-5">
            <label class="text-sm font-medium text-[#b8b0c4]">Phone</label>
            <input type="tel" class="input-gts" v-model="form.phone" placeholder="+971..." required id="register-phone">
          </div>
        </div>

        <!-- Merchant Fields -->
        <template v-if="currentRole === 'merchant'">
          <div class="h-px bg-white/[0.06] my-6"></div>
          <h4 class="font-heading mb-4 text-primary-300">Business Details</h4>
          <div class="flex flex-col gap-1.5 mb-5">
            <label class="text-sm font-medium text-[#b8b0c4]">Business Name</label>
            <input type="text" class="input-gts" v-model="form.businessName" placeholder="Your business name" required>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5 mb-5">
              <label class="text-sm font-medium text-[#b8b0c4]">Category</label>
              <select class="select-gts" v-model="form.category" required>
                <option value="" disabled>Select category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5 mb-5">
              <label class="text-sm font-medium text-[#b8b0c4]">Location</label>
              <input type="text" class="input-gts" v-model="form.location" placeholder="City, Country" required>
            </div>
          </div>
        </template>

        <!-- Service Provider Fields -->
        <template v-if="currentRole === 'service-provider'">
          <div class="h-px bg-white/[0.06] my-6"></div>
          <h4 class="font-heading mb-4 text-primary-300">Service Details</h4>
          <div class="flex flex-col gap-1.5 mb-5">
            <label class="text-sm font-medium text-[#b8b0c4]">Service Type</label>
            <select class="select-gts" v-model="form.serviceType" required>
              <option value="" disabled>Select service type</option>
              <option v-for="st in serviceTypes" :key="st" :value="st">{{ st }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5 mb-5">
            <label class="text-sm font-medium text-[#b8b0c4]">Coverage Area</label>
            <input type="text" class="input-gts" v-model="form.coverageArea" placeholder="e.g. Dubai & Sharjah" required>
          </div>
        </template>

        <!-- Customer Fields -->
        <template v-if="currentRole === 'customer'">
          <div class="flex flex-col gap-1.5 mb-5">
            <label class="text-sm font-medium text-[#b8b0c4]">Location (optional)</label>
            <input type="text" class="input-gts" v-model="form.location" placeholder="City, Country">
          </div>
        </template>

        <div v-if="error" class="flex items-center gap-2.5 px-5 py-3 rounded-lg text-sm font-medium mb-5 bg-red-500/10 border border-red-500/30 text-red-400">
          <span class="material-icons-round">error</span>
          {{ error }}
        </div>

        <button type="submit" class="btn-gts-primary btn-gts-lg w-full mt-2" id="register-submit-btn">
          Create Account
          <span class="material-icons-round">arrow_forward</span>
        </button>
      </form>

      <p class="text-center mt-5 text-sm text-neutral-500">
        Already have an account? <router-link to="/login" class="text-primary-300 font-semibold hover:text-primary-200">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore.js'
import { categories, serviceTypes } from '../../mock/users.js'

const router = useRouter()
const authStore = useAuthStore()
const error = ref('')
const currentRole = computed(() => authStore.selectedRole || 'customer')

const roleInfo = computed(() => {
  const map = { 'merchant': { icon: 'storefront', label: 'Merchant' }, 'service-provider': { icon: 'local_shipping', label: 'Service Provider' }, 'customer': { icon: 'person', label: 'Customer' } }
  return map[currentRole.value] || map.customer
})

const form = ref({ fullName: '', email: '', password: '', phone: '', businessName: '', category: '', location: '', serviceType: '', coverageArea: '' })

function handleRegister() {
  error.value = ''
  if (form.value.password.length < 6) { error.value = 'Password must be at least 6 characters'; return }
  const result = authStore.register({ ...form.value, role: currentRole.value })
  if (result.success) {
    if (currentRole.value !== 'customer') router.push('/verification')
    else router.push('/customer/home')
  } else { error.value = result.message }
}
</script>
