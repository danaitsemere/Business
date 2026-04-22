export const systemLogs = [
  {
    id: 1,
    type: 'user_registered',
    icon: 'person_add',
    message: 'New user registered: Abebe Kebede',
    severity: 'info',
    timestamp: '2026-04-06T14:30:00'
  },
  {
    id: 2,
    type: 'business_pending',
    icon: 'store',
    message: 'New business application from Anbessa Construction Co.',
    severity: 'warning',
    timestamp: '2026-04-06T13:15:00'
  },
  {
    id: 3,
    type: 'request_created',
    icon: 'assignment',
    message: 'New service request #8 from Abebe Kebede',
    severity: 'info',
    timestamp: '2026-04-06T12:00:00'
  },
  {
    id: 4,
    type: 'business_approved',
    icon: 'check_circle',
    message: 'Lucy Beauty & Wellness approved',
    severity: 'success',
    timestamp: '2026-04-06T11:45:00'
  },
  {
    id: 5,
    type: 'user_registered',
    icon: 'person_add',
    message: 'New user registered: Meron Assefa',
    severity: 'info',
    timestamp: '2026-04-06T10:30:00'
  },
  {
    id: 6,
    type: 'business_approved',
    icon: 'check_circle',
    message: 'Selam Fashion House approved',
    severity: 'success',
    timestamp: '2026-04-06T09:20:00'
  },
  {
    id: 7,
    type: 'request_completed',
    icon: 'task_alt',
    message: 'Service request #3 completed',
    severity: 'info',
    timestamp: '2026-04-05T18:00:00'
  },
  {
    id: 8,
    type: 'report_generated',
    icon: 'assessment',
    message: 'Monthly report generated for March 2026',
    severity: 'info',
    timestamp: '2026-04-05T08:00:00'
  },
  {
    id: 9,
    type: 'business_rejected',
    icon: 'cancel',
    message: 'Gebeya Fake Traders rejected',
    severity: 'danger',
    timestamp: '2026-04-04T16:45:00'
  },
  {
    id: 10,
    type: 'user_suspended',
    icon: 'block',
    message: 'Meron Assefa suspended for review',
    severity: 'danger',
    timestamp: '2026-04-04T14:00:00'
  }
]

export const platformStats = {
  totalUsers: 5,
  totalCustomers: 4,
  totalBusinesses: 8,
  totalProducts: 8,
  totalServiceRequests: 9,
  activeServiceRequests: 2,
  pendingBusinesses: 2,
  pendingRequests: 3,
  totalRevenue: 68500,
  monthlyGrowth: 18.5
}

export const revenueOverTime = [
  { month: 'Sep', revenue: 24500 },
  { month: 'Oct', revenue: 34000 },
  { month: 'Nov', revenue: 43500 },
  { month: 'Dec', revenue: 52500 },
  { month: 'Jan', revenue: 66000 },
  { month: 'Feb', revenue: 79000 },
  { month: 'Mar', revenue: 92000 }
]

export const userGrowth = [
  { month: 'Sep', customers: 0 },
  { month: 'Oct', customers: 1 },
  { month: 'Nov', customers: 1 },
  { month: 'Dec', customers: 2 },
  { month: 'Jan', customers: 3 },
  { month: 'Feb', customers: 4 },
  { month: 'Mar', customers: 4 }
]

export const requestsPerDay = [
  { day: 'Mon', requests: 5 },
  { day: 'Tue', requests: 10 },
  { day: 'Wed', requests: 8 },
  { day: 'Thu', requests: 12 },
  { day: 'Fri', requests: 6 },
  { day: 'Sat', requests: 3 },
  { day: 'Sun', requests: 2 }
]

export const topServices = [
  { name: 'Delivery', count: 45, color: '#7630A3' },
  { name: 'Web Development', count: 28, color: '#64D2B1' },
  { name: 'Marketing', count: 22, color: '#475569' },
  { name: 'Photography', count: 15, color: '#7630A3' },
  { name: 'Payment Processing', count: 12, color: '#64D2B1' },
  { name: 'Consulting', count: 8, color: '#475569' }
]

export const topBusinesses = [
  { name: 'Habesha Electronics', views: 4790, inquiries: 162, products: 4, rating: 4.8 },
  { name: 'Selam Fashion House', views: 3780, inquiries: 136, products: 4, rating: 4.9 },
  { name: 'Lucy Beauty & Wellness', views: 3200, inquiries: 112, products: 15, rating: 4.7 },
  { name: 'Sheger Organic Foods', views: 2150, inquiries: 89, products: 12, rating: 4.6 },
  { name: 'Ethio Fitness Pro', views: 1890, inquiries: 67, products: 8, rating: 4.5 }
]

export const reportsList = [
  { id: 1, name: 'Monthly User Report – March 2026', type: 'Users', generatedAt: '2026-04-01', status: 'ready' },
  { id: 2, name: 'Revenue Summary – Q1 2026', type: 'Revenue', generatedAt: '2026-04-01', status: 'ready' },
  { id: 3, name: 'Business Approval Audit', type: 'Compliance', generatedAt: '2026-03-28', status: 'ready' },
  { id: 4, name: 'Service Request Analysis', type: 'Performance', generatedAt: '2026-03-25', status: 'ready' },
  { id: 5, name: 'Product Listing Activity', type: 'Products', generatedAt: '2026-03-20', status: 'ready' }
]

