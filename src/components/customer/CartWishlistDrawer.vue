<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="activeDrawer"
      class="fixed top-0 right-0 z-[200] w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-[#EEEAF2]"
    >
      <div class="p-8 border-b border-[#EEEAF2] flex items-center justify-between">
        <h2 class="font-heading text-xl font-black text-[#1A1225] flex items-center gap-3">
          <ClipboardList class="w-5 h-5 text-primary-500" />
          Request Cart
        </h2>
        <button
          @click="close()"
          class="btn-gts-secondary !w-11 !h-11 !px-0 bg-[#F8F6FB]"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-8 space-y-4 [&::-webkit-scrollbar]:hide-scrollbar">
        <div v-if="!requestItems.length" class="flex flex-col items-center justify-center py-16 text-center opacity-50">
          <ClipboardList class="w-12 h-12 mb-3" />
          <p class="font-black text-sm uppercase tracking-widest">Your request cart is empty</p>
          <p class="text-xs text-slate-400 mt-1 font-medium">Add products to start a request</p>
        </div>

        <div
          v-for="item in requestItems"
          :key="item.id"
          class="p-4 bg-[#F8F6FB] rounded-2xl border border-transparent hover:border-primary-500/10 hover:bg-white transition-all duration-300 group"
        >
          <div class="flex gap-4 cursor-pointer" @click="close(); $router.push('/customer/product/' + item.id)">
            <div class="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-[#EEEAF2] shrink-0 overflow-hidden">
              <img v-if="item.details?.image" :src="item.details.image" :alt="item.details?.name" class="w-full h-full object-contain p-1.5 mix-blend-multiply" />
              <Package v-else class="w-8 h-8 text-neutral-300 opacity-30" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-black text-xs text-[#1A1225] truncate mb-0.5 uppercase tracking-tight">{{ item.details?.name }}</h4>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">{{ item.details?.businessName }}</p>
              <div class="flex items-center gap-3" @click.stop>
                <button @click="customerStore.updateRequestQuantity(item.id, item.quantity - 1)" class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white text-xs">−</button>
                <span class="text-xs font-black min-w-[20px] text-center">{{ item.quantity }}</span>
                <button @click="customerStore.updateRequestQuantity(item.id, item.quantity + 1)" class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white text-xs">+</button>
                <span class="text-[10px] font-black text-primary-500 ml-auto">ETB {{ ((item.details?.salePrice || item.details?.price || 0) * item.quantity).toLocaleString() }}</span>
              </div>
            </div>
            <button @click.stop="customerStore.removeFromRequestList(item.id)" class="text-neutral-500 opacity-30 hover:opacity-100 hover:text-red-500 self-start transition-all">
              <Trash2 class="w-5 h-5" />
            </button>
          </div>

          <div class="mt-3 pt-3 border-t border-[#EEEAF2]" @click.stop>
            <input
              v-model="itemNotes[item.id]"
              type="text"
              :placeholder="'Add note for ' + (item.details?.businessName || 'merchant') + '...'"
              class="input-gts !h-9 !px-3 !text-[10px] bg-white border border-[#EEEAF2] focus:border-primary-500/30"
            />
          </div>
        </div>
      </div>

      <div v-if="requestItems.length" class="p-8 border-t border-[#EEEAF2] space-y-4 bg-[#F8F6FB]/50">
        <div class="flex items-center justify-between text-xs font-black text-[#1A1225] uppercase tracking-widest mb-2">
          <span>{{ totalItems }} item{{ totalItems > 1 ? 's' : '' }} · {{ businessCount }} business{{ businessCount > 1 ? 'es' : '' }}</span>
        </div>
        <button
          @click="startChatWithAll"
          class="btn-gts-primary w-full group"
        >
          Start Chat
          <MessageSquare class="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
        <div class="text-center">
          <button @click="customerStore.clearRequestList()" class="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-red-500 transition-colors">Clear All Items</button>
        </div>
      </div>
    </aside>
  </transition>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '../../store/customerStore.js'
import { ClipboardList, X, Package, Trash2, MessageSquare } from 'lucide-vue-next'

const props = defineProps({
  activeDrawer: { type: String, default: null }
})

const emit = defineEmits(['update:activeDrawer'])
const router = useRouter()
const customerStore = useCustomerStore()

const itemNotes = reactive({})

const requestItems = computed(() =>
  customerStore.requestList
    .map(item => ({ ...item, details: customerStore.getProductById(item.id) }))
    .filter(item => item.details)
)

const totalItems = computed(() => requestItems.value.reduce((sum, i) => sum + i.quantity, 0))
const businessCount = computed(() => new Set(requestItems.value.map(i => i.details.businessId)).size)

function close() {
  emit('update:activeDrawer', null)
}

function startChatWithAll() {
  if (!requestItems.value.length) return
  const businessGroups = {}
  requestItems.value.forEach(item => {
    const bid = item.details.businessId
    if (!businessGroups[bid]) {
      businessGroups[bid] = { name: item.details.businessName, items: [] }
    }
    businessGroups[bid].items.push(item)
  })
  const businessIds = Object.keys(businessGroups)
  const firstBid = businessIds[0]
  const group = businessGroups[firstBid]
  const itemLines = group.items.map(i => {
    const note = itemNotes[i.id] ? ` — ${itemNotes[i.id]}` : ''
    return `- ${i.details.name} (x${i.quantity})${note}`
  }).join('\n')
  const message = `Hello! I'd like to request the following:\n${itemLines}`
  close()
  router.push({
    path: '/customer/chat',
    query: {
      type: 'request-list',
      businessId: firstBid,
      provider: group.name,
      initialMessage: message
    }
  })
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
