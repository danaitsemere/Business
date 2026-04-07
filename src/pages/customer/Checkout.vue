<template>
  <div class="animate-fade-in max-w-5xl mx-auto py-8">
    <!-- Back button -->
    <button @click="$router.push('/customer/home')" class="flex items-center gap-2 text-primary-500 font-black text-sm hover:gap-3 transition-all mb-8">
      <span class="material-icons-round text-base">arrow_back</span> Continue Shopping
    </button>

    <!-- Step Indicator -->
    <div class="flex items-center justify-center gap-4 mb-12">
      <div v-for="(step, idx) in steps" :key="step.id" class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all"
            :class="currentStep >= idx ? 'bg-primary-500 text-white shadow-soft' : 'bg-[#F8F6FB] text-slate-300'">
            <span v-if="currentStep > idx" class="material-icons-round text-lg">check</span>
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <span class="text-xs font-black uppercase tracking-widest hidden sm:inline"
            :class="currentStep >= idx ? 'text-[#1A1225]' : 'text-slate-300'">{{ step.label }}</span>
        </div>
        <div v-if="idx < steps.length - 1" class="w-16 h-[2px] rounded-full" :class="currentStep > idx ? 'bg-primary-500' : 'bg-[#EEEAF2]'"></div>
      </div>
    </div>

    <!-- Step 1: Order Summary -->
    <div v-if="currentStep === 0" class="space-y-8">
      <div class="bg-white rounded-3xl p-8 lg:p-10 border border-[#EEEAF2] shadow-soft">
        <h2 class="font-heading text-2xl font-black text-[#1A1225] mb-8">Order Summary</h2>
        
        <div v-if="!cartItems.length" class="flex flex-col items-center justify-center py-16 opacity-40">
          <span class="material-icons-round text-5xl mb-3">shopping_cart</span>
          <p class="font-black text-sm uppercase tracking-widest">Your cart is empty</p>
        </div>

        <div class="space-y-4 mb-8">
          <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-5 p-5 bg-[#F8F6FB] rounded-2xl">
            <div class="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-[#EEEAF2] shrink-0 overflow-hidden">
              <img v-if="item.details?.image" :src="item.details.image" :alt="item.details?.name" class="w-full h-full object-contain p-1.5 mix-blend-multiply" />
              <span v-else class="material-icons-round text-2xl text-[#EEEAF2]">inventory_2</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-black text-sm text-[#1A1225] truncate mb-0.5">{{ item.details?.name }}</h4>
              <p class="text-xs text-slate-400 font-bold">{{ item.details?.category }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xs text-slate-400 font-bold mb-0.5">{{ item.quantity }} × ${{ (item.details?.salePrice || item.details?.price || 0).toLocaleString() }}</p>
              <p class="font-black text-[#1A1225]">${{ ((item.details?.salePrice || item.details?.price || 0) * item.quantity).toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="border-t border-[#EEEAF2] pt-6 space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-slate-400 font-bold">Subtotal</span>
            <span class="font-black text-[#1A1225]">${{ cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-400 font-bold">Shipping</span>
            <span class="font-black text-tertiary-300">Free</span>
          </div>
          <div class="flex justify-between text-lg border-t border-[#EEEAF2] pt-4">
            <span class="font-black text-[#1A1225]">Total</span>
            <span class="font-black text-primary-500">${{ cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
          </div>
        </div>
      </div>

      <button @click="currentStep = 1" class="btn-gts-primary w-full py-5 rounded-2xl text-[1rem] flex items-center justify-center gap-2 group"
        :disabled="!cartItems.length">
        Proceed to Payment <span class="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </button>
    </div>

    <!-- Step 2: Payment -->
    <div v-if="currentStep === 1" class="space-y-8">
      <div class="bg-white rounded-3xl p-8 lg:p-10 border border-[#EEEAF2] shadow-soft">
        <h2 class="font-heading text-2xl font-black text-[#1A1225] mb-8">Payment Details</h2>
        
        <!-- Payment Method Selection -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div v-for="method in paymentMethods" :key="method.id"
            class="p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3"
            :class="selectedPayment === method.id ? 'border-primary-500 bg-primary-500/5' : 'border-[#EEEAF2] hover:border-primary-500/30'"
            @click="selectedPayment = method.id">
            <span class="material-icons-round text-2xl" :class="selectedPayment === method.id ? 'text-primary-500' : 'text-slate-300'">{{ method.icon }}</span>
            <div>
              <h4 class="font-black text-sm text-[#1A1225]">{{ method.name }}</h4>
              <p class="text-[0.625rem] text-slate-400 font-bold">{{ method.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Card Form (shown for credit card) -->
        <div v-if="selectedPayment === 'card'" class="space-y-5">
          <div class="space-y-2">
            <label class="text-[0.625rem] font-black uppercase text-slate-400 tracking-widest pl-1">Card Number</label>
            <input type="text" class="input-gts" placeholder="1234 5678 9012 3456" maxlength="19" v-model="cardForm.number">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[0.625rem] font-black uppercase text-slate-400 tracking-widest pl-1">Expiry Date</label>
              <input type="text" class="input-gts" placeholder="MM/YY" maxlength="5" v-model="cardForm.expiry">
            </div>
            <div class="space-y-2">
              <label class="text-[0.625rem] font-black uppercase text-slate-400 tracking-widest pl-1">CVV</label>
              <input type="text" class="input-gts" placeholder="123" maxlength="3" v-model="cardForm.cvv">
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[0.625rem] font-black uppercase text-slate-400 tracking-widest pl-1">Cardholder Name</label>
            <input type="text" class="input-gts" placeholder="John Doe" v-model="cardForm.name">
          </div>
        </div>

        <!-- Mobile payment / Bank transfer info -->
        <div v-if="selectedPayment === 'mobile'" class="p-6 bg-[#F8F6FB] rounded-2xl text-center">
          <span class="material-icons-round text-4xl text-primary-500 mb-3">phone_android</span>
          <p class="font-black text-sm text-[#1A1225] mb-1">Pay via Mobile Money</p>
          <p class="text-xs text-slate-400 font-medium">You will receive a payment prompt on your registered mobile number.</p>
        </div>
        <div v-if="selectedPayment === 'bank'" class="p-6 bg-[#F8F6FB] rounded-2xl text-center">
          <span class="material-icons-round text-4xl text-primary-500 mb-3">account_balance</span>
          <p class="font-black text-sm text-[#1A1225] mb-1">Bank Transfer</p>
          <p class="text-xs text-slate-400 font-medium">Transfer to: CBE Account 1000XXXXXXXXXX | Ref: GTS-{{ Date.now() }}</p>
        </div>

        <div class="flex items-center justify-between border-t border-[#EEEAF2] pt-6 mt-8">
          <span class="font-black text-lg text-[#1A1225]">Total: ${{ cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
          <div class="flex items-center gap-1 text-tertiary-300 text-xs font-black">
            <span class="material-icons-round text-sm">lock</span> Secure Payment
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <button @click="currentStep = 0" class="flex-1 py-5 rounded-2xl bg-[#F8F6FB] text-[#1A1225] font-black text-sm border border-[#EEEAF2] hover:bg-white transition-colors">
          ← Back
        </button>
        <button @click="processPayment" class="flex-[2] btn-gts-primary py-5 rounded-2xl text-[1rem] flex items-center justify-center gap-2 group">
          <span v-if="!processing" class="flex items-center gap-2">
            Pay Now <span class="material-icons-round group-hover:translate-x-1 transition-transform">payment</span>
          </span>
          <span v-else class="flex items-center gap-2">
            <span class="material-icons-round animate-spin">sync</span> Processing...
          </span>
        </button>
      </div>
    </div>

    <!-- Step 3: Confirmation & Rating -->
    <div v-if="currentStep === 2" class="space-y-8">
      <div class="bg-white rounded-3xl p-10 lg:p-14 border border-[#EEEAF2] shadow-soft text-center">
        <div class="w-20 h-20 bg-tertiary-300/10 text-tertiary-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="material-icons-round text-4xl">check_circle</span>
        </div>
        <h2 class="font-heading text-3xl font-black text-[#1A1225] mb-3">Order Confirmed!</h2>
        <p class="text-slate-500 font-medium text-lg mb-2">Thank you for your purchase.</p>
        <p class="text-slate-400 text-sm font-bold mb-10">Order #{{ placedOrder?.id }} • ${{ cartTotalSnapshot.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>

        <!-- Rating Section -->
        <div class="max-w-md mx-auto bg-[#F8F6FB] rounded-2xl p-8">
          <h3 class="font-heading text-lg font-black text-[#1A1225] mb-2">Rate Your Experience</h3>
          <p class="text-xs text-slate-400 font-medium mb-6">How was your shopping experience?</p>
          <div class="flex items-center justify-center gap-2 mb-6">
            <span v-for="n in 5" :key="n" 
              class="material-icons-round text-4xl cursor-pointer hover:scale-125 transition-transform"
              :class="n <= (orderRating || hoverOrderRating) ? 'text-amber-400' : 'text-slate-200'"
              @mouseenter="hoverOrderRating = n"
              @mouseleave="hoverOrderRating = 0"
              @click="orderRating = n">
              star
            </span>
          </div>
          <p v-if="orderRating" class="text-sm font-black text-tertiary-300 mb-4">
            {{ ratingText }}
          </p>
          <button v-if="orderRating && !ratingSubmitted" @click="submitRating" class="btn-gts-primary px-8 py-3 rounded-xl text-sm">
            Submit Rating
          </button>
          <p v-if="ratingSubmitted" class="text-sm font-black text-tertiary-300 flex items-center justify-center gap-1">
            <span class="material-icons-round text-base">check_circle</span> Thank you for your feedback!
          </p>
        </div>
      </div>

      <div class="flex gap-4">
        <button @click="$router.push('/customer/profile')" class="flex-1 py-5 rounded-2xl bg-[#F8F6FB] text-[#1A1225] font-black text-sm border border-[#EEEAF2] hover:bg-white transition-colors">
          View Orders
        </button>
        <button @click="$router.push('/customer/home')" class="flex-[2] btn-gts-primary py-5 rounded-2xl text-[1rem]">
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCustomerStore } from '../../store/customerStore.js'

const customerStore = useCustomerStore()
const currentStep = ref(0)
const selectedPayment = ref('card')
const processing = ref(false)
const placedOrder = ref(null)
const cartTotalSnapshot = ref(0)
const orderRating = ref(0)
const hoverOrderRating = ref(0)
const ratingSubmitted = ref(false)

const cardForm = ref({ number: '', expiry: '', cvv: '', name: '' })

const steps = [
  { id: 'summary', label: 'Order Summary' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirm', label: 'Confirmation' }
]

const paymentMethods = [
  { id: 'card', name: 'Credit Card', desc: 'Visa, Mastercard', icon: 'credit_card' },
  { id: 'mobile', name: 'Mobile Money', desc: 'M-Pesa, Telebirr', icon: 'phone_android' },
  { id: 'bank', name: 'Bank Transfer', desc: 'Direct transfer', icon: 'account_balance' }
]

const cartItems = computed(() => customerStore.cart.map(item => ({
  ...item,
  details: customerStore.getProductById(item.id)
})).filter(item => item.details))

const cartTotal = computed(() => customerStore.cartTotal)

const ratingText = computed(() => {
  const texts = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent!' }
  return texts[orderRating.value] || ''
})

function processPayment() {
  processing.value = true
  cartTotalSnapshot.value = cartTotal.value

  setTimeout(() => {
    const orderItems = cartItems.value.map(item => ({
      id: item.id,
      name: item.details?.name,
      quantity: item.quantity,
      price: item.details?.salePrice || item.details?.price,
      subtotal: (item.details?.salePrice || item.details?.price) * item.quantity
    }))

    placedOrder.value = customerStore.placeOrder({
      items: orderItems,
      total: cartTotalSnapshot.value,
      paymentMethod: selectedPayment.value
    })

    processing.value = false
    currentStep.value = 2
  }, 2000)
}

function submitRating() {
  if (placedOrder.value) {
    customerStore.rateOrder(placedOrder.value.id, orderRating.value)
    ratingSubmitted.value = true
  }
}
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.08); }
</style>
