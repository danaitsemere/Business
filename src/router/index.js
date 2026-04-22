import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import CustomerLayout from '../layouts/CustomerLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [

  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: '', name: 'Welcome', component: () => import('../pages/auth/Welcome.vue') },
      { path: 'login', name: 'Login', component: () => import('../pages/auth/Login.vue') },
      { path: 'register', name: 'Register', component: () => import('../pages/auth/Register.vue') },
      { path: 'forgot-password', name: 'ForgotPassword', component: () => import('../pages/auth/ForgotPassword.vue') }
    ]
  },

  {
    path: '/customer',
    component: CustomerLayout,
    meta: { requiresAuth: true, role: 'customer' },
    children: [
      { path: 'home', name: 'CustomerHome', component: () => import('../pages/customer/Home.vue') },
      { path: 'search', name: 'SearchResults', component: () => import('../pages/customer/SearchResults.vue') },
      { path: 'business/:id', name: 'BusinessProfile', component: () => import('../pages/customer/BusinessProfile.vue') },
      { path: 'product/:id', name: 'ProductDetails', component: () => import('../pages/customer/ProductDetails.vue') },
      { path: 'service-request', name: 'ServiceRequest', component: () => import('../pages/customer/ServiceRequest.vue') },
      { path: 'chat', name: 'CustomerChat', component: () => import('../pages/customer/Chat.vue') },
      { path: 'profile', name: 'CustomerProfile', component: () => import('../pages/customer/Profile.vue') }
    ]
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('../pages/admin/Dashboard.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('../pages/admin/UserManagement.vue') },
      { path: 'businesses', name: 'AdminBusinesses', component: () => import('../pages/admin/BusinessManagement.vue') },
      { path: 'products', name: 'AdminProducts', component: () => import('../pages/admin/ProductManagement.vue') },

      { path: 'verifications', name: 'AdminVerifications', component: () => import('../pages/admin/Verifications.vue') },

      { path: 'reports', name: 'AdminReports', component: () => import('../pages/admin/Reports.vue') }
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const user = JSON.parse(localStorage.getItem('gts_user') || 'null')

  if (user && (to.path === '/' || to.path === '/login' || to.path === '/register' || to.path === '/forgot-password')) {
    if (user.role === 'admin') return '/admin/dashboard'
    return '/customer/home'
  }

  if (to.meta.requiresAuth && !user) {
    return '/'
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    if (user?.role === 'admin') return '/admin/dashboard'
    return '/customer/home'
  }
})

export default router