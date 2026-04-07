<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="font-heading text-3xl font-extrabold mb-2">Request a Service</h1>
      <p class="text-neutral-500">Connect with service providers for delivery, payments, and more</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card-gts">
        <h3 class="font-heading text-lg font-bold mb-5">Submit a Request</h3>
        <form @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-1.5 mb-5">
            <label class="text-sm font-medium text-[#b8b0c4]">Service Type</label>
            <select class="select-gts" v-model="form.serviceType" required>
              <option value="" disabled>Select a service</option>
              <option v-for="s in serviceTypes" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5 mb-5">
            <label class="text-sm font-medium text-[#b8b0c4]">Description</label>
            <textarea class="input-gts resize-y" v-model="form.description" rows="4" placeholder="Describe what you need..." required></textarea>
          </div>
          <div class="flex flex-col gap-1.5 mb-5">
            <label class="text-sm font-medium text-[#b8b0c4]">Location</label>
            <input type="text" class="input-gts" v-model="form.location" placeholder="e.g. Dubai, Business Bay" required>
          </div>
          <div class="flex flex-col gap-1.5 mb-5">
            <label class="text-sm font-medium text-[#b8b0c4]">Estimated Budget (USD)</label>
            <input type="number" class="input-gts" v-model="form.estimatedCost" placeholder="0.00" step="0.01">
          </div>
          <div v-if="submitted" class="flex items-center gap-2.5 px-5 py-3 rounded-lg text-sm font-medium mb-5 bg-green-500/10 border border-green-500/30 text-green-400">
            <span class="material-icons-round">check_circle</span> Service request submitted! A provider will respond shortly.
          </div>
          <button type="submit" class="btn-gts-primary btn-gts-lg w-full disabled:opacity-70 disabled:cursor-default" :disabled="submitted">
            <span class="material-icons-round">send</span> Submit Request
          </button>
        </form>
      </div>

      <div class="card-gts">
        <h3 class="font-heading text-lg font-bold mb-5">Available Services</h3>
        <div class="space-y-3">
          <div v-for="service in servicesList" :key="service.name"
            class="flex items-center gap-4 p-4 bg-surface-secondary rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            @click="form.serviceType = service.name">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" :style="{ background: service.bg }">
              <span class="material-icons-round text-xl" :style="{ color: service.color }">{{ service.icon }}</span>
            </div>
            <div class="flex-1">
              <h4 class="font-heading text-[0.938rem] font-bold mb-0.5">{{ service.name }}</h4>
              <p class="text-xs text-neutral-500">{{ service.desc }}</p>
            </div>
            <span class="material-icons-round text-neutral-500">chevron_right</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../store/authStore.js'
import { useServiceProviderStore } from '../../store/serviceProviderStore.js'
import { serviceTypes } from '../../mock/users.js'

const authStore = useAuthStore(); const spStore = useServiceProviderStore()
const user = computed(() => authStore.currentUser); const submitted = ref(false)
const form = ref({ serviceType: '', description: '', location: '', estimatedCost: '' })

const servicesList = [
  { name: 'Delivery', icon: 'local_shipping', desc: 'Fast & reliable package delivery', bg: 'rgba(118,48,163,0.15)', color: '#a854dc' },
  { name: 'Payment Processing', icon: 'payment', desc: 'Secure payment gateway setup', bg: 'rgba(100,210,177,0.15)', color: '#64D2B1' },
  { name: 'Marketing', icon: 'campaign', desc: 'Digital marketing & promotion', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  { name: 'Photography', icon: 'camera_alt', desc: 'Professional product photography', bg: 'rgba(236,72,153,0.15)', color: '#ec4899' },
  { name: 'Web Development', icon: 'code', desc: 'Website & app development', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  { name: 'Consulting', icon: 'groups', desc: 'Business strategy consulting', bg: 'rgba(239,68,68,0.15)', color: '#f87171' }
]

function handleSubmit() {
  spStore.submitServiceRequest({ customerId: user.value?.id, customerName: user.value?.fullName, providerId: 3, serviceType: form.value.serviceType, description: form.value.description, location: form.value.location, estimatedCost: parseFloat(form.value.estimatedCost) || 50 })
  submitted.value = true
}
</script>
