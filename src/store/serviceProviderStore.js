import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServiceProviderStore = defineStore('serviceProvider', () => {
  const serviceRequests = ref(JSON.parse(localStorage.getItem('gts_sp_requests') || '[]'))

  function submitServiceRequest(request) {
    const newRequest = {
      id: Date.now(),
      ...request,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    }
    serviceRequests.value.unshift(newRequest)
    localStorage.setItem('gts_sp_requests', JSON.stringify(serviceRequests.value))
    return newRequest
  }

  return {
    serviceRequests,
    submitServiceRequest
  }
})
