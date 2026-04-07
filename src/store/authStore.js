import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { users as mockUsers } from '../mock/users.js'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(JSON.parse(localStorage.getItem('gts_user') || 'null'))
  const isAuthenticated = computed(() => !!currentUser.value)
  const userRole = computed(() => currentUser.value?.role || '')

  // Initialize users in localStorage if not present
  if (!localStorage.getItem('gts_users')) {
    localStorage.setItem('gts_users', JSON.stringify(mockUsers))
  }

  function getStoredUsers() {
    return JSON.parse(localStorage.getItem('gts_users') || '[]')
  }

  function saveUsers(users) {
    localStorage.setItem('gts_users', JSON.stringify(users))
  }

  function login(email, password) {
    const users = getStoredUsers()
    const user = users.find(u => u.email === email && u.password === password)
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' }
    }
    if (user.status === 'suspended') {
      return { success: false, message: 'Your account has been suspended. Please contact support.' }
    }
    
    currentUser.value = { ...user }
    localStorage.setItem('gts_user', JSON.stringify(user))
    return { success: true, user }
  }

  function register(userData) {
    const users = getStoredUsers()
    const exists = users.find(u => u.email === userData.email)
    if (exists) {
      return { success: false, message: 'This email is already registered' }
    }
    const newUser = {
      id: Date.now(),
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: 'customer',
      location: userData.location || '',
      status: 'active',
      avatar: userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    users.push(newUser)
    saveUsers(users)
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
      // Also update in the users list
      const users = getStoredUsers()
      const idx = users.findIndex(u => u.id === currentUser.value.id)
      if (idx !== -1) {
        Object.assign(users[idx], data)
        saveUsers(users)
      }
    }
  }

  return {
    currentUser,
    isAuthenticated,
    userRole,
    login,
    register,
    logout,
    updateProfile,
    getStoredUsers,
    saveUsers
  }
})
