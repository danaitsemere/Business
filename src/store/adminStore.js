import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { users as mockUsers } from '../mock/users.js'
import { businesses as mockBusinesses } from '../mock/businesses.js'
import { products as mockProducts } from '../mock/products.js'
import { serviceRequests as mockRequests } from '../mock/serviceRequests.js'
import {
  systemLogs as mockLogs,
  platformStats as mockStats,
  revenueOverTime as mockRevenue,
  userGrowth as mockUserGrowth,
  requestsPerDay as mockRequestsPerDay,
  topServices as mockTopServices,
  topBusinesses as mockTopBusinesses,
  reportsList as mockReports,
  systemSettings as mockSettings
} from '../mock/admin.js'

export const useAdminStore = defineStore('admin', () => {
  // Initialize from localStorage or fall back to mock data
  const users = ref(JSON.parse(localStorage.getItem('gts_users') || 'null') || [...mockUsers])
  const businesses = ref(JSON.parse(localStorage.getItem('gts_businesses') || 'null') || [...mockBusinesses])
  const products = ref(JSON.parse(localStorage.getItem('gts_products') || 'null') || [...mockProducts])
  const serviceRequests = ref(JSON.parse(localStorage.getItem('gts_requests') || 'null') || [...mockRequests])
  const systemLogs = ref([...mockLogs])
  const platformStats = ref({ ...mockStats })
  const revenueData = ref([...mockRevenue])
  const userGrowthData = ref([...mockUserGrowth])
  const requestsPerDayData = ref([...mockRequestsPerDay])
  const topServicesData = ref([...mockTopServices])
  const topBusinesses = ref([...mockTopBusinesses])
  const reports = ref([...mockReports])
  const settings = ref(JSON.parse(localStorage.getItem('gts_settings') || 'null') || { ...mockSettings })

  // Persist helpers
  function persistUsers() { localStorage.setItem('gts_users', JSON.stringify(users.value)) }
  function persistBusinesses() { localStorage.setItem('gts_businesses', JSON.stringify(businesses.value)) }
  function persistProducts() { localStorage.setItem('gts_products', JSON.stringify(products.value)) }
  function persistRequests() { localStorage.setItem('gts_requests', JSON.stringify(serviceRequests.value)) }
  function persistSettings() { localStorage.setItem('gts_settings', JSON.stringify(settings.value)) }

  // User management
  const allUsers = computed(() => users.value)
  const activeUsers = computed(() => users.value.filter(u => u.status === 'active'))
  const suspendedUsers = computed(() => users.value.filter(u => u.status === 'suspended'))
  const customerUsers = computed(() => users.value.filter(u => u.role === 'customer'))

  function getUserById(id) {
    return users.value.find(u => u.id === id)
  }

  function activateUser(userId) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.status = 'active'
      user.suspended = false
      persistUsers()
    }
  }

  function suspendUser(userId) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.status = 'suspended'
      user.suspended = true
      persistUsers()
      addLog('user_suspended', 'block', `User ${user.fullName} has been suspended`, 'danger')
    }
  }

  function deleteUser(userId) {
    const user = users.value.find(u => u.id === userId)
    users.value = users.value.filter(u => u.id !== userId)
    persistUsers()
    if (user) addLog('user_deleted', 'person_remove', `User ${user.fullName} has been removed`, 'danger')
  }

  // Business management
  const approvedBusinesses = computed(() => businesses.value.filter(b => b.status === 'approved'))
  const pendingBusinesses = computed(() => businesses.value.filter(b => b.status === 'pending'))
  const rejectedBusinesses = computed(() => businesses.value.filter(b => b.status === 'rejected'))

  function getBusinessById(id) {
    return businesses.value.find(b => b.id === id)
  }

  function approveBusiness(businessId) {
    const biz = businesses.value.find(b => b.id === businessId)
    if (biz) {
      biz.status = 'approved'
      biz.verified = true
      persistBusinesses()
      addLog('business_approved', 'check_circle', `Business "${biz.name}" has been approved`, 'success')
    }
  }

  function rejectBusiness(businessId) {
    const biz = businesses.value.find(b => b.id === businessId)
    if (biz) {
      biz.status = 'rejected'
      biz.verified = false
      persistBusinesses()
      addLog('business_rejected', 'cancel', `Business "${biz.name}" has been rejected`, 'danger')
    }
  }

  function toggleFeatured(businessId) {
    const biz = businesses.value.find(b => b.id === businessId)
    if (biz) {
      biz.featured = !biz.featured
      persistBusinesses()
    }
  }

  function deleteBusiness(businessId) {
    const biz = businesses.value.find(b => b.id === businessId)
    businesses.value = businesses.value.filter(b => b.id !== businessId)
    persistBusinesses()
    if (biz) addLog('business_deleted', 'store', `Business "${biz.name}" has been removed`, 'danger')
  }

  // Product management
  function addProduct(product) {
    product.id = Date.now()
    product.status = 'active'
    product.views = 0
    product.inquiries = 0
    product.createdAt = new Date().toISOString().split('T')[0]
    products.value.push(product)
    persistProducts()
    addLog('product_added', 'inventory_2', `New product "${product.name}" added`, 'info')
  }

  function updateProduct(productId, data) {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      Object.assign(product, data)
      persistProducts()
    }
  }

  function deleteProduct(productId) {
    const product = products.value.find(p => p.id === productId)
    products.value = products.value.filter(p => p.id !== productId)
    persistProducts()
    if (product) addLog('product_deleted', 'inventory_2', `Product "${product.name}" removed`, 'danger')
  }

  function toggleProductStatus(productId) {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      product.status = product.status === 'active' ? 'suspended' : 'active'
      persistProducts()
    }
  }

  // Only products from approved businesses
  const approvedProducts = computed(() => {
    const approvedBizIds = approvedBusinesses.value.map(b => b.id)
    return products.value.filter(p => approvedBizIds.includes(p.merchantId))
  })

  // Service request management
  const allServiceRequests = computed(() => serviceRequests.value)
  const pendingRequests = computed(() => serviceRequests.value.filter(r => r.status === 'pending'))
  const activeRequests = computed(() => serviceRequests.value.filter(r => r.status === 'accepted' || r.status === 'in_progress'))
  const completedRequests = computed(() => serviceRequests.value.filter(r => r.status === 'completed'))

  function updateRequestStatus(requestId, newStatus) {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req) {
      req.status = newStatus
      if (newStatus === 'completed') {
        req.completedAt = new Date().toISOString().split('T')[0]
        req.actualCost = req.estimatedCost
      }
      persistRequests()
      addLog('request_updated', 'assignment', `Service request #${requestId} status changed to "${newStatus}"`, 'info')
    }
  }

  function assignProvider(requestId, providerName) {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req) {
      req.providerName = providerName
      if (req.status === 'pending') req.status = 'accepted'
      persistRequests()
      addLog('request_assigned', 'assignment_ind', `Provider "${providerName}" assigned to request #${requestId}`, 'success')
    }
  }

  // Activity log
  function addLog(type, icon, message, severity) {
    systemLogs.value.unshift({
      id: Date.now(),
      type,
      icon,
      message,
      severity,
      timestamp: new Date().toISOString()
    })
  }

  // Settings
  function updateSettings(newSettings) {
    Object.assign(settings.value, newSettings)
    persistSettings()
  }

  // Analytics getters
  function getRevenueData() { return revenueData.value }
  function getUserGrowthData() { return userGrowthData.value }
  function getRequestsPerDay() { return requestsPerDayData.value }
  function getTopServices() { return topServicesData.value }
  function getTopBusinesses() { return topBusinesses.value }
  function getReports() { return reports.value }
  function getSystemLogs() { return systemLogs.value }

  return {
    users,
    businesses,
    products,
    serviceRequests,
    systemLogs,
    platformStats,
    revenueData,
    userGrowthData,
    requestsPerDayData,
    topServicesData,
    topBusinesses,
    reports,
    settings,
    allUsers,
    activeUsers,
    suspendedUsers,
    customerUsers,
    approvedBusinesses,
    pendingBusinesses,
    rejectedBusinesses,
    approvedProducts,
    allServiceRequests,
    pendingRequests,
    activeRequests,
    completedRequests,
    getUserById,
    activateUser,
    suspendUser,
    deleteUser,
    getBusinessById,
    approveBusiness,
    rejectBusiness,
    toggleFeatured,
    deleteBusiness,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    updateRequestStatus,
    assignProvider,
    addLog,
    updateSettings,
    getRevenueData,
    getUserGrowthData,
    getRequestsPerDay,
    getTopServices,
    getTopBusinesses,
    getReports,
    getSystemLogs
  }
})
