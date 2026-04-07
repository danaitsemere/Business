import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { businesses as mockBusinesses } from '../mock/businesses.js'
import { products as mockProducts } from '../mock/products.js'

export const useCustomerStore = defineStore('customer', () => {
  // Load persisted data from localStorage with immediate fallback to empty array
  const savedBusinesses = ref(JSON.parse(localStorage.getItem('gts_saved_businesses') || '[]'))
  const cart = ref(JSON.parse(localStorage.getItem('gts_cart') || '[]')) 
  const wishlist = ref(JSON.parse(localStorage.getItem('gts_wishlist') || '[]'))
  const serviceRequests = ref(JSON.parse(localStorage.getItem('gts_service_requests') || '[]'))
  const orders = ref(JSON.parse(localStorage.getItem('gts_orders') || '[]'))
  
  const allBusinesses = ref([...mockBusinesses])
  const allProducts = ref([...mockProducts])
  
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const selectedLocation = ref('')

  // RELIABLE PERSISTENCE: Sync state to localStorage on every deep change
  watch(cart, (newCart) => {
    localStorage.setItem('gts_cart', JSON.stringify(newCart))
  }, { deep: true })

  watch(wishlist, (newWish) => {
    localStorage.setItem('gts_wishlist', JSON.stringify(newWish))
  }, { deep: true })

  watch(savedBusinesses, (newSaved) => {
    localStorage.setItem('gts_saved_businesses', JSON.stringify(newSaved))
  }, { deep: true })

  watch(serviceRequests, (newReqs) => {
    localStorage.setItem('gts_service_requests', JSON.stringify(newReqs))
  }, { deep: true })

  watch(orders, (newOrders) => {
    localStorage.setItem('gts_orders', JSON.stringify(newOrders))
  }, { deep: true })

  // Business Logic
  function searchBusinesses(query, category, location) {
    let results = [...allBusinesses.value]
    if (query) {
      const q = query.toLowerCase()
      results = results.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      )
    }
    if (category && category !== 'all') {
      results = results.filter(b => b.category === category)
    }
    if (location) {
      results = results.filter(b => b.location.toLowerCase().includes(location.toLowerCase()))
    }
    return results
  }

  function getBusinessById(id) {
    return allBusinesses.value.find(b => b.id === id)
  }

  // Product Logic with SORTING support
  function getFilteredProducts(query, category, type, sortBy = 'newest') {
    let results = [...allProducts.value]
    
    if (type === 'featured') results = results.filter(p => p.featured)
    if (type === 'top-selling') results = results.filter(p => p.topSelling)
    if (type === 'on-sale') results = results.filter(p => p.onSale)

    if (query) {
      const q = query.toLowerCase()
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.brand?.toLowerCase().includes(q)
      )
    }

    if (category && category !== 'all') {
      results = results.filter(p => p.category === category)
    }

    // Apply sorting
    if (sortBy === 'price-low') {
      results.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
    } else if (sortBy === 'price-high') {
      results.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
    } else {
      // newest arrivals - sort by createdAt desc
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return results
  }

  function getProductById(id) {
    return allProducts.value.find(p => p.id === id)
  }

  // Cart Actions
  function addToCart(productId, quantity = 1) {
    const qty = parseInt(quantity) || 1
    const existing = cart.value.find(item => item.id === productId)
    if (existing) {
      existing.quantity += qty
    } else {
      cart.value.push({ id: productId, quantity: qty })
    }
  }

  function removeFromCart(productId) {
    cart.value = cart.value.filter(item => item.id !== productId)
  }

  function updateCartQuantity(productId, quantity) {
    const item = cart.value.find(item => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
    }
  }

  function clearCart() {
    cart.value = []
  }

  // Wishlist Actions
  function toggleWishlist(productId) {
    if (wishlist.value.includes(productId)) {
      wishlist.value = wishlist.value.filter(id => id !== productId)
    } else {
      wishlist.value.push(productId)
    }
  }

  function isInWishlist(productId) {
    return wishlist.value.includes(productId)
  }

  // Service Request Actions
  function submitServiceRequest(request) {
    const newRequest = {
      id: Date.now(),
      ...request,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      timeline: [
        { status: 'submitted', date: new Date().toISOString(), label: 'Request Submitted' }
      ]
    }
    serviceRequests.value.unshift(newRequest)
    return newRequest
  }

  function cancelServiceRequest(requestId) {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req && (req.status === 'submitted' || req.status === 'pending')) {
      req.status = 'cancelled'
      req.timeline.push({ status: 'cancelled', date: new Date().toISOString(), label: 'Request Cancelled' })
    }
  }

  // Order / Checkout Actions
  function placeOrder(orderData) {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      rated: false,
      rating: 0
    }
    orders.value.unshift(newOrder)
    clearCart()
    return newOrder
  }

  function rateOrder(orderId, rating) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.rated = true
      order.rating = rating
    }
  }

  // Reactive Computeds
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      const product = getProductById(item.id)
      return total + (product ? (product.salePrice || product.price) * item.quantity : 0)
    }, 0)
  })

  const cartCount = computed(() => {
     return cart.value.reduce((total, item) => total + item.quantity, 0)
  })

  return {
    savedBusinesses,
    cart,
    wishlist,
    serviceRequests,
    orders,
    allBusinesses,
    allProducts,
    searchQuery,
    selectedCategory,
    selectedLocation,
    searchBusinesses,
    getBusinessById,
    getFilteredProducts,
    getProductById,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    submitServiceRequest,
    cancelServiceRequest,
    placeOrder,
    rateOrder,
    cartTotal,
    cartCount
  }
})
