import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { businesses as mockBusinesses } from '../mock/businesses.js'
import { products as mockProducts } from '../mock/products.js'

export const useCustomerStore = defineStore('customer', () => {
  const savedBusinesses = ref(JSON.parse(localStorage.getItem('gts_saved_businesses') || '[]'))
  const requestList = ref(JSON.parse(localStorage.getItem('gts_request_list') || '[]'))
  const serviceRequests = ref(JSON.parse(localStorage.getItem('gts_service_requests') || '[]'))
  const orders = ref(JSON.parse(localStorage.getItem('gts_orders') || '[]'))
  const chatMessages = ref(JSON.parse(localStorage.getItem('gts_chat_messages') || '{}'))
  const chatSessions = ref(JSON.parse(localStorage.getItem('gts_chat_sessions') || '{}'))

  const allBusinesses = ref([...mockBusinesses])
  const allProducts = ref([...mockProducts])

  const searchQuery = ref('')
  const selectedCategory = ref('')
  const selectedLocation = ref('')

  watch(requestList, (v) => localStorage.setItem('gts_request_list', JSON.stringify(v)), { deep: true })
  watch(savedBusinesses, (v) => localStorage.setItem('gts_saved_businesses', JSON.stringify(v)), { deep: true })
  watch(serviceRequests, (v) => localStorage.setItem('gts_service_requests', JSON.stringify(v)), { deep: true })
  watch(orders, (v) => localStorage.setItem('gts_orders', JSON.stringify(v)), { deep: true })
  watch(chatMessages, (v) => localStorage.setItem('gts_chat_messages', JSON.stringify(v)), { deep: true })
  watch(chatSessions, (v) => localStorage.setItem('gts_chat_sessions', JSON.stringify(v)), { deep: true })

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

    if (sortBy === 'price-low') {
      results.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
    } else if (sortBy === 'price-high') {
      results.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
    } else {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return results
  }

  function getProductById(id) {
    return allProducts.value.find(p => p.id === id)
  }

  function addToRequestList(productId, quantity = 1) {
    const qty = parseInt(quantity) || 1
    const existing = requestList.value.find(item => item.id === productId)
    if (existing) {
      existing.quantity += qty
    } else {
      requestList.value.push({ id: productId, quantity: qty })
    }
  }

  function removeFromRequestList(productId) {
    requestList.value = requestList.value.filter(item => item.id !== productId)
  }

  function updateRequestQuantity(productId, quantity) {
    const item = requestList.value.find(item => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
    }
  }

  function clearRequestList() {
    requestList.value = []
  }

  function submitServiceRequest(request) {
    const items = request.items || []
    if (items.length === 0 && request.productId) {
      const p = getProductById(request.productId)
      if (p) {
        items.push({
          id: p.id,
          name: p.name,
          quantity: request.quantity || 1,
          price: p.salePrice || p.price
        })
      }
    }
    const totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)

    const deliveryDate = request.deliveryDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()

    const newRequest = {
      id: Date.now(),
      ...request,
      items,
      totalPrice,
      deliveryDate,
      status: 'pending',
      type: request.type || 'service',
      createdAt: new Date().toISOString(),
      rating: 0,
      rated: false,
      timeline: [
        { status: 'pending', date: new Date().toISOString(), label: 'Pending' }
      ]
    }
    serviceRequests.value.unshift(newRequest)
    return newRequest
  }

  function cancelServiceRequest(requestId) {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req && req.status === 'pending') {
      req.status = 'cancelled'
      req.timeline.push({ status: 'cancelled', date: new Date().toISOString(), label: 'Cancelled' })
    }
  }

  function updateRequestStatus(requestId, newStatus) {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req) {
      req.status = newStatus
      const labelMap = {
        'pending': 'Pending', 'accepted': 'Accepted', 'in-progress': 'In Progress',
        'completed': 'Completed', 'rejected': 'Rejected', 'cancelled': 'Cancelled', 'rated': 'Rated'
      }
      req.timeline.push({ status: newStatus, date: new Date().toISOString(), label: labelMap[newStatus] || newStatus })

      if (newStatus === 'completed' && req.items?.length) {
        req.items.forEach(item => {
          if (item.id) {
            requestList.value = requestList.value.filter(cartItem => cartItem.id !== item.id)
          }
        })

        localStorage.setItem('gts_request_list', JSON.stringify(requestList.value))
      }
    }
  }

  function rateRequest(requestId, rating) {
    const req = serviceRequests.value.find(r => r.id === requestId)
    if (req && req.status === 'completed') {
      req.rating = rating
      req.rated = true
      req.status = 'rated'
      req.timeline.push({ status: 'rated', date: new Date().toISOString(), label: 'Rated' })
    }
  }

  function getChatMessages(requestId) {
    return chatMessages.value[requestId] || []
  }

  function addChatMessage(requestId, message) {
    if (!chatMessages.value[requestId]) {
      chatMessages.value[requestId] = []
    }
    chatMessages.value[requestId].push({
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString()
    })
    chatMessages.value = { ...chatMessages.value }
  }

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
    clearRequestList()
    return newOrder
  }

  function rateOrder(orderId, rating) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.rated = true
      order.rating = rating
    }
  }

  function getChatId(businessId, type, productId) {
    return `chat_${businessId || 0}_${type || 'service'}_${productId || 0}`
  }

  function saveChatSession(chatId, sessionData) {
    chatSessions.value[chatId] = {
      ...chatSessions.value[chatId],
      ...sessionData,
      updatedAt: new Date().toISOString()
    }
    chatSessions.value = { ...chatSessions.value } 
  }

  function getChatSession(chatId) {
    return chatSessions.value[chatId] || null
  }

  function saveChatMessages(chatId, messages) {
    const session = chatSessions.value[chatId] || {}
    session.messages = messages.map(m => ({
      sender: m.sender,
      text: m.text,
      subtext: m.subtext || undefined,
      systemType: m.systemType || undefined,
      time: m.time
    }))
    session.updatedAt = new Date().toISOString()
    chatSessions.value[chatId] = session
    chatSessions.value = { ...chatSessions.value }
  }

  function linkRequestToChat(chatId, requestId) {
    const session = chatSessions.value[chatId] || {}
    session.requestId = requestId
    chatSessions.value[chatId] = session
    chatSessions.value = { ...chatSessions.value }
  }

  const requestListTotal = computed(() => {
    return requestList.value.reduce((total, item) => {
      const product = getProductById(item.id)
      return total + (product ? (product.salePrice || product.price) * item.quantity : 0)
    }, 0)
  })

  const requestListCount = computed(() => {
    return requestList.value.reduce((total, item) => total + item.quantity, 0)
  })

  return {
    savedBusinesses, requestList, serviceRequests, orders, chatMessages, chatSessions,
    allBusinesses, allProducts, searchQuery, selectedCategory, selectedLocation,
    searchBusinesses, getBusinessById, getFilteredProducts, getProductById,
    addToRequestList, removeFromRequestList, updateRequestQuantity, clearRequestList,
    submitServiceRequest, cancelServiceRequest, updateRequestStatus, rateRequest,
    getChatMessages, addChatMessage,
    placeOrder, rateOrder,
    getChatId, saveChatSession, getChatSession, saveChatMessages, linkRequestToChat,
    requestListTotal, requestListCount
  }
})
