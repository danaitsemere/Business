export const systemLogs = [
  {
    id: 1,
    type: 'user_registered',
    icon: 'person_add',
    message: 'New merchant registered: Ahmed Hassan',
    userId: 1,
    severity: 'info',
    timestamp: '2026-04-06T14:30:00'
  },
  {
    id: 2,
    type: 'verification_submitted',
    icon: 'verified_user',
    message: 'Verification submitted by Fatima Noor (Service Provider)',
    userId: 4,
    severity: 'warning',
    timestamp: '2026-04-06T13:15:00'
  },
  {
    id: 3,
    type: 'product_flagged',
    icon: 'flag',
    message: 'Product flagged for review: Wireless Bluetooth Headphones',
    userId: 1,
    severity: 'warning',
    timestamp: '2026-04-06T12:00:00'
  },
  {
    id: 4,
    type: 'subscription_upgraded',
    icon: 'upgrade',
    message: 'Hassan Electronics upgraded to Professional plan',
    userId: 1,
    severity: 'success',
    timestamp: '2026-04-06T11:45:00'
  },
  {
    id: 5,
    type: 'user_registered',
    icon: 'person_add',
    message: 'New customer registered: Layla Mohammed',
    userId: 6,
    severity: 'info',
    timestamp: '2026-04-06T10:30:00'
  },
  {
    id: 6,
    type: 'business_verified',
    icon: 'check_circle',
    message: 'Sara Fashion House verification approved',
    userId: 2,
    severity: 'success',
    timestamp: '2026-04-06T09:20:00'
  },
  {
    id: 7,
    type: 'service_completed',
    icon: 'task_alt',
    message: 'Service request #3 completed by Omar Khalil',
    userId: 3,
    severity: 'info',
    timestamp: '2026-04-05T18:00:00'
  },
  {
    id: 8,
    type: 'report_generated',
    icon: 'assessment',
    message: 'Monthly analytics report generated for March 2026',
    severity: 'info',
    timestamp: '2026-04-05T08:00:00'
  },
  {
    id: 9,
    type: 'payment_received',
    icon: 'payments',
    message: 'Subscription payment received from Gulf Fitness Pro',
    severity: 'success',
    timestamp: '2026-04-04T16:45:00'
  },
  {
    id: 10,
    type: 'user_suspended',
    icon: 'block',
    message: 'TechHub Solutions temporarily suspended for review',
    severity: 'danger',
    timestamp: '2026-04-04T14:00:00'
  }
]

export const platformStats = {
  totalUsers: 6,
  totalMerchants: 2,
  totalServiceProviders: 2,
  totalCustomers: 2,
  totalBusinesses: 6,
  totalProducts: 8,
  totalServiceRequests: 7,
  activeServiceRequests: 1,
  pendingVerifications: 1,
  totalRevenue: 1274,
  monthlyGrowth: 18.5,
  activeSubscriptions: 3
}

export const revenueOverTime = [
  { month: 'Sep', revenue: 490 },
  { month: 'Oct', revenue: 680 },
  { month: 'Nov', revenue: 870 },
  { month: 'Dec', revenue: 1050 },
  { month: 'Jan', revenue: 1320 },
  { month: 'Feb', revenue: 1580 },
  { month: 'Mar', revenue: 1840 }
]

export const userGrowth = [
  { month: 'Sep', merchants: 1, providers: 1, customers: 0 },
  { month: 'Oct', merchants: 1, providers: 1, customers: 1 },
  { month: 'Nov', merchants: 2, providers: 1, customers: 1 },
  { month: 'Dec', merchants: 2, providers: 2, customers: 1 },
  { month: 'Jan', merchants: 2, providers: 2, customers: 2 },
  { month: 'Feb', merchants: 2, providers: 2, customers: 2 },
  { month: 'Mar', merchants: 2, providers: 2, customers: 2 }
]

export const subscriptionBreakdown = [
  { plan: 'Starter (Free)', count: 3, revenue: 0, color: '#7C757E' },
  { plan: 'Professional', count: 2, revenue: 98, color: '#a854dc' },
  { plan: 'Enterprise', count: 1, revenue: 149, color: '#64D2B1' }
]

export const topBusinesses = [
  { name: 'Hassan Electronics', views: 4790, inquiries: 162, products: 4, rating: 4.8 },
  { name: 'Sara Fashion House', views: 3780, inquiries: 136, products: 4, rating: 4.9 },
  { name: 'Desert Rose Beauty', views: 3200, inquiries: 112, products: 15, rating: 4.7 },
  { name: 'Al Noor Organic Foods', views: 2150, inquiries: 89, products: 12, rating: 4.6 },
  { name: 'Gulf Fitness Pro', views: 1890, inquiries: 67, products: 8, rating: 4.5 }
]

export const reportsList = [
  { id: 1, name: 'Monthly User Report – March 2026', type: 'Users', generatedAt: '2026-04-01', status: 'ready' },
  { id: 2, name: 'Revenue Summary – Q1 2026', type: 'Revenue', generatedAt: '2026-04-01', status: 'ready' },
  { id: 3, name: 'Business Verification Audit', type: 'Compliance', generatedAt: '2026-03-28', status: 'ready' },
  { id: 4, name: 'Service Provider Performance', type: 'Performance', generatedAt: '2026-03-25', status: 'ready' },
  { id: 5, name: 'Product Listing Activity', type: 'Products', generatedAt: '2026-03-20', status: 'ready' }
]

export const systemSettings = {
  platformName: 'GTS Platform',
  supportEmail: 'support@gts.com',
  maintenanceMode: false,
  autoApproveVerification: false,
  maxProductsPerFree: 5,
  maxProductsPerPro: 50,
  maxProductsPerEnterprise: -1,
  enableNotifications: true,
  enableAnalytics: true,
  defaultCurrency: 'USD',
  defaultRegion: 'UAE'
}
