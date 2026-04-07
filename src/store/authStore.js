import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { users } from '../mock/users.js'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(JSON.parse(localStorage.getItem('gts_user') || 'null'))
  const selectedRole = ref('')
  const isAuthenticated = computed(() => !!currentUser.value)
  const userRole = computed(() => currentUser.value?.role || '')

  function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      currentUser.value = { ...user }
      localStorage.setItem('gts_user', JSON.stringify(user))
      return { success: true, user }
    }
    return { success: false, message: 'Invalid email or password' }
  }

  function register(userData) {
    const exists = users.find(u => u.email === userData.email)
    if (exists) {
      return { success: false, message: 'Email already registered' }
    }
    const newUser = {
      id: users.length + 1,
      ...userData,
      verified: userData.role === 'customer',
      avatar: userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    users.push(newUser)
    currentUser.value = { ...newUser }
    localStorage.setItem('gts_user', JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('gts_user')
  }

  function updateProfile(data) {
    if (currentUser.value) {
      Object.assign(currentUser.value, data)
      localStorage.setItem('gts_user', JSON.stringify(currentUser.value))
    }
  }

  function setRole(role) {
    selectedRole.value = role
  }

  function submitVerification() {
    if (currentUser.value) {
      currentUser.value.verificationStatus = 'pending'
      localStorage.setItem('gts_user', JSON.stringify(currentUser.value))
    }
  }

  function approveVerification() {
    if (currentUser.value) {
      currentUser.value.verified = true
      currentUser.value.verificationStatus = 'verified'
      localStorage.setItem('gts_user', JSON.stringify(currentUser.value))
    }
  }

  return {
    currentUser,
    selectedRole,
    isAuthenticated,
    userRole,
    login,
    register,
    logout,
    updateProfile,
    setRole,
    submitVerification,
    approveVerification
  }
})
