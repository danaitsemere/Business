import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { users as mockUsers } from '../mock/users.js'
import { businesses as mockBusinesses } from '../mock/businesses.js'
import { products as mockProducts } from '../mock/products.js'
import { serviceRequests as mockRequests } from '../mock/serviceRequests.js'
import { providers as mockProviders } from '../mock/providers.js'
import {
  systemLogs as mockLogs,
  platformStats as mockStats,
  revenueOverTime as mockRevenue,
  userGrowth as mockUserGrowth,
  requestsPerDay as mockRequestsPerDay,
  topServices as mockTopServices,
  topBusinesses as mockTopBusinesses,
  reportsList as mockReports
} from '../mock/admin.js'

export const useAdminStore = defineStore('admin', () => {

  const users = ref(JSON.parse(localStorage.getItem('gts_users') || 'null') || [...mockUsers])
  const businesses = ref(JSON.parse(localStorage.getItem('gts_businesses') || 'null') || [...mockBusinesses])
  const products = ref(JSON.parse(localStorage.getItem('gts_products') || 'null') || [...mockProducts])
  const serviceRequests = ref(JSON.parse(localStorage.getItem('gts_requests') || 'null') || [...mockRequests])
  const providers = ref([...mockProviders])
  const systemLogs = ref([...mockLogs])
  const platformStats = ref({ ...mockStats })
  const revenueData = ref([...mockRevenue])
  const userGrowthData = ref([...mockUserGrowth])
  const requestsPerDayData = ref([...mockRequestsPerDay])
  const topServicesData = ref([...mockTopServices])
  const topBusinesses = ref([...mockTopBusinesses])
  const reports = ref([...mockReports])

  const toast = ref({ show: false, message: '', type: 'success' })

  function showToast(message, type = 'success') {
    toast.value = { show: true, message, type }
    setTimeout(() => { toast.value.show = false }, 3000)
  }

  const subscriptionPlans = ref(JSON.parse(localStorage.getItem('gts_plans') || 'null') || [
    { id: 1, name: 'Basic', role: 'merchant', price: 1499, features: ['Up to 10 products', 'Basic analytics', 'Email support'], billingCycle: 'monthly' },
    { id: 2, name: 'Professional', role: 'merchant', price: 3999, features: ['Up to 50 products', 'Advanced analytics', 'Priority support', 'Featured listings'], billingCycle: 'monthly' },
    { id: 3, name: 'Enterprise', role: 'merchant', price: 9999, features: ['Unlimited products', 'Full analytics suite', '24/7 support', 'Featured listings', 'API access'], billingCycle: 'monthly' },
    { id: 4, name: 'Starter', role: 'provider', price: 999, features: ['Up to 5 active jobs', 'Basic profile', 'Email support'], billingCycle: 'monthly' },
    { id: 5, name: 'Professional', role: 'provider', price: 2499, features: ['Up to 20 active jobs', 'Verified badge', 'Priority listing', 'Phone support'], billingCycle: 'monthly' },
    { id: 6, name: 'Enterprise', role: 'provider', price: 6499, features: ['Unlimited jobs', 'Premium badge', 'Top listing', '24/7 support', 'Analytics dashboard'], billingCycle: 'monthly' }
  ])

  function persistPlans() { localStorage.setItem('gts_plans', JSON.stringify(subscriptionPlans.value)) }

  function updatePlanPrice(planId, newPrice) {
    const plan = subscriptionPlans.value.find(p => p.id === planId)
    if (plan) {
      plan.price = newPrice
      persistPlans()
      showToast(`${plan.name} plan price updated to ETB ${newPrice}`)
      addLog('plan_updated', 'payments', `Subscription plan "${plan.name}" price updated to ETB ${newPrice}`, 'info')
    }
  }

  function persistUsers() { localStorage.setItem('gts_users', JSON.stringify(users.value)) }
  function persistBusinesses() { localStorage.setItem('gts_businesses', JSON.stringify(businesses.value)) }
  function persistProducts() { localStorage.setItem('gts_products', JSON.stringify(products.value)) }
  function persistRequests() { localStorage.setItem('gts_requests', JSON.stringify(serviceRequests.value)) }

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
      showToast(`User ${user.fullName} activated`)
    }
  }

  function suspendUser(userId) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.status = 'suspended'
      user.suspended = true
      persistUsers()
      addLog('user_suspended', 'block', `User ${user.fullName} has been suspended`, 'danger')
      showToast(`User ${user.fullName} suspended`, 'warning')
    }
  }

  function deleteUser(userId) {
    const user = users.value.find(u => u.id === userId)
    users.value = users.value.filter(u => u.id !== userId)
    persistUsers()
    if (user) addLog('user_deleted', 'person_remove', `User ${user.fullName} has been removed`, 'danger')
  }

  const approvedBusinesses = computed(() => businesses.value.filter(b => b.status === 'approved'))
  const pendingBusinesses = computed(() => businesses.value.filter(b => b.status === 'pending'))
  const rejectedBusinesses = computed(() => businesses.value.filter(b => b.status === 'rejected'))
  const suspendedBusinesses = computed(() => businesses.value.filter(b => b.status === 'suspended'))

  function getBusinessById(id) {
    return businesses.value.find(b => b.id === id)
  }

  function approveBusiness(businessId) {
    const biz = businesses.value.find(b => b.id === businessId)
    if (biz) {
      biz.status = 'approved'
      biz.verified = true
      biz.approvedAt = new Date().toISOString().split('T')[0]
      persistBusinesses()
      addLog('business_approved', 'check_circle', `Business "${biz.name}" has been approved`, 'success')
      showToast(`Business "${biz.name}" approved successfully`)
    }
  }

  function rejectBusiness(businessId, reason = '') {
    const biz = businesses.value.find(b => b.id === businessId)
    if (biz) {
      biz.status = 'rejected'
      biz.verified = false
      biz.rejectionReason = reason
      biz.rejectedAt = new Date().toISOString().split('T')[0]
      persistBusinesses()
      addLog('business_rejected', 'cancel', `Business "${biz.name}" has been rejected`, 'danger')
      showToast(`Business "${biz.name}" rejected`, 'error')
    }
  }

  function suspendBusiness(businessId) {
    const biz = businesses.value.find(b => b.id === businessId)
    if (biz) {
      biz.status = 'suspended'
      biz.verified = false
      persistBusinesses()
      addLog('business_suspended', 'block', `Business "${biz.name}" has been suspended`, 'danger')
      showToast(`Business "${biz.name}" suspended`, 'warning')
    }
  }

  function unsuspendBusiness(businessId) {
    const biz = businesses.value.find(b => b.id === businessId)
    if (biz) {
      biz.status = 'approved'
      biz.verified = true
      persistBusinesses()
      showToast(`Business "${biz.name}" reactivated`)
    }
  }

  function toggleFeatured(businessId) {
    const biz = businesses.value.find(b => b.id === businessId)
    if (biz) {
      biz.featured = !biz.featured
      persistBusinesses()
    }
  }

  function addProduct(product) {
    product.id = Date.now()
    product.status = 'active'
    product.views = 0
    product.inquiries = 0
    product.createdAt = new Date().toISOString().split('T')[0]
    products.value.unshift(product)
    persistProducts()
    addLog('product_added', 'inventory_2', `New product "${product.name}" added`, 'info')
    showToast(`Product "${product.name}" added successfully`)
  }

  function updateProduct(productId, data) {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      Object.assign(product, data)
      persistProducts()
      showToast(`Product "${product.name}" updated successfully`)
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

  const approvedProducts = computed(() => {
    const approvedBizIds = approvedBusinesses.value.map(b => b.id)
    return products.value.filter(p => approvedBizIds.includes(p.merchantId))
  })

  const allServiceRequests = computed(() => serviceRequests.value)
  const pendingRequests = computed(() => serviceRequests.value.filter(r => r.status === 'pending'))
  const assignedRequests = computed(() => serviceRequests.value.filter(r => r.status === 'assigned'))
  const inProgressRequests = computed(() => serviceRequests.value.filter(r => r.status === 'in_progress'))
  const activeRequests = computed(() => serviceRequests.value.filter(r => r.status === 'assigned' || r.status === 'in_progress'))
  const completedRequests = computed(() => serviceRequests.value.filter(r => r.status === 'completed'))
  const rejectedRequests = computed(() => serviceRequests.value.filter(r => r.status === 'rejected'))

  function updateRequestStatus(requestId, newStatus) {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req) {
      req.status = newStatus
      if (!req.statusHistory) req.statusHistory = []
      req.statusHistory.push({
        status: newStatus,
        date: new Date().toISOString().split('T')[0],
        note: `Status changed to ${newStatus}`
      })
      if (newStatus === 'completed') {
        req.completedAt = new Date().toISOString().split('T')[0]
        req.actualCost = req.estimatedCost
      }
      persistRequests()
      addLog('request_updated', 'assignment', `Service request #${requestId} status changed to "${newStatus}"`, 'info')
      showToast(`Request #${requestId} updated to ${newStatus}`)
    }
  }

  function assignProvider(requestId, providerId, providerName) {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req) {
      req.providerId = providerId
      req.providerName = providerName
      req.status = 'assigned'
      req.assignedAt = new Date().toISOString().split('T')[0]
      if (!req.statusHistory) req.statusHistory = []
      req.statusHistory.push({
        status: 'assigned',
        date: new Date().toISOString().split('T')[0],
        note: `Assigned to ${providerName}`
      })
      persistRequests()
      addLog('request_assigned', 'assignment_ind', `Provider "${providerName}" assigned to request #${requestId}`, 'success')
      showToast(`Provider "${providerName}" assigned to request #${requestId}`)
    }
  }

  function rejectRequest(requestId, reason = '') {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req) {
      req.status = 'rejected'
      req.rejectionReason = reason
      if (!req.statusHistory) req.statusHistory = []
      req.statusHistory.push({
        status: 'rejected',
        date: new Date().toISOString().split('T')[0],
        note: reason || 'Request rejected by admin'
      })
      persistRequests()
      addLog('request_rejected', 'cancel', `Service request #${requestId} has been rejected`, 'danger')
      showToast(`Request #${requestId} rejected`, 'error')
    }
  }

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
    providers,
    systemLogs,
    platformStats,
    revenueData,
    userGrowthData,
    requestsPerDayData,
    topServicesData,
    topBusinesses,
    reports,
    subscriptionPlans,
    toast,
    allUsers,
    activeUsers,
    suspendedUsers,
    customerUsers,
    approvedBusinesses,
    pendingBusinesses,
    rejectedBusinesses,
    suspendedBusinesses,
    approvedProducts,
    allServiceRequests,
    pendingRequests,
    assignedRequests,
    inProgressRequests,
    activeRequests,
    completedRequests,
    rejectedRequests,
    showToast,
    getUserById,
    activateUser,
    suspendUser,
    deleteUser,
    getBusinessById,
    approveBusiness,
    rejectBusiness,
    suspendBusiness,
    unsuspendBusiness,
    toggleFeatured,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    updateRequestStatus,
    assignProvider,
    rejectRequest,
    updatePlanPrice,
    addLog,
    getRevenueData,
    getUserGrowthData,
    getRequestsPerDay,
    getTopServices,
    getTopBusinesses,
    getReports,
    getSystemLogs
  }
})
