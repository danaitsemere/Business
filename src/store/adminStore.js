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
  subscriptionBreakdown as mockSubBreakdown,
  topBusinesses as mockTopBusinesses,
  reportsList as mockReports,
  systemSettings as mockSettings
} from '../mock/admin.js'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([...mockUsers])
  const businesses = ref([...mockBusinesses])
  const products = ref([...mockProducts])
  const serviceRequests = ref([...mockRequests])
  const systemLogs = ref([...mockLogs])
  const platformStats = ref({ ...mockStats })
  const revenueData = ref([...mockRevenue])
  const userGrowthData = ref([...mockUserGrowth])
  const subscriptionBreakdown = ref([...mockSubBreakdown])
  const topBusinesses = ref([...mockTopBusinesses])
  const reports = ref([...mockReports])
  const settings = ref({ ...mockSettings })

  // User management
  const allUsers = computed(() => users.value)
  const merchantUsers = computed(() => users.value.filter(u => u.role === 'merchant'))
  const providerUsers = computed(() => users.value.filter(u => u.role === 'service-provider'))
  const customerUsers = computed(() => users.value.filter(u => u.role === 'customer'))
  const pendingVerifications = computed(() =>
    users.value.filter(u => (u.role === 'merchant' || u.role === 'service-provider') && !u.verified)
  )

  function getUserById(id) {
    return users.value.find(u => u.id === id)
  }

  function updateUserStatus(userId, field, value) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user[field] = value
    }
  }

  function verifyUser(userId) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.verified = true
      user.verificationStatus = 'verified'
    }
  }

  function suspendUser(userId) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.suspended = true
    }
  }

  function unsuspendUser(userId) {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.suspended = false
    }
  }

  function deleteUser(userId) {
    users.value = users.value.filter(u => u.id !== userId)
  }

  // Business management
  function getBusinessById(id) {
    return businesses.value.find(b => b.id === id)
  }

  function verifyBusiness(businessId) {
    const biz = businesses.value.find(b => b.id === businessId)
    if (biz) {
      biz.verified = true
    }
  }

  function toggleFeatured(businessId) {
    const biz = businesses.value.find(b => b.id === businessId)
    if (biz) {
      biz.featured = !biz.featured
    }
  }

  function deleteBusiness(businessId) {
    businesses.value = businesses.value.filter(b => b.id !== businessId)
  }

  // Product management
  function deleteProduct(productId) {
    products.value = products.value.filter(p => p.id !== productId)
  }

  function toggleProductStatus(productId) {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      product.status = product.status === 'active' ? 'suspended' : 'active'
    }
  }

  // Service request management
  const allServiceRequests = computed(() => serviceRequests.value)

  // Settings
  function updateSettings(newSettings) {
    Object.assign(settings.value, newSettings)
  }

  // Analytics
  function getRevenueData() { return revenueData.value }
  function getUserGrowthData() { return userGrowthData.value }
  function getSubscriptionBreakdown() { return subscriptionBreakdown.value }
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
    subscriptionBreakdown,
    topBusinesses,
    reports,
    settings,
    allUsers,
    merchantUsers,
    providerUsers,
    customerUsers,
    pendingVerifications,
    allServiceRequests,
    getUserById,
    updateUserStatus,
    verifyUser,
    suspendUser,
    unsuspendUser,
    deleteUser,
    getBusinessById,
    verifyBusiness,
    toggleFeatured,
    deleteBusiness,
    deleteProduct,
    toggleProductStatus,
    updateSettings,
    getRevenueData,
    getUserGrowthData,
    getSubscriptionBreakdown,
    getTopBusinesses,
    getReports,
    getSystemLogs
  }
})
