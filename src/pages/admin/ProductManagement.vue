<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Product Management</h1>
        <p class="text-[#475569] font-medium">Manage products from approved businesses only</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-gts-primary" @click="showAddModal = true">
          <span class="material-icons-round">add</span> Add Product
        </button>
      </div>
    </div>

    <!-- Note -->
    <div class="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#7630A3]/5 border border-[#7630A3]/10 text-sm text-[#7630A3] font-medium mb-6">
      <span class="material-icons-round text-lg">info</span>
      Only products from approved businesses are shown here
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-[#7C757E]">search</span>
        <input type="text" class="input-gts pl-12" v-model="searchQuery" placeholder="Search products..." id="admin-product-search">
      </div>
      <select class="input-gts max-w-[180px]" v-model="statusFilter">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-3xl border border-[#EEEAF2] shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[#EEEAF2]">
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Product</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Business</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Category</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Price</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Views</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Status</th>
              <th class="text-right px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id" class="border-b border-[#EEEAF2] last:border-0 hover:bg-[#F8F6FB] transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-[#F8F6FB] rounded-xl flex items-center justify-center text-[#7C757E] border border-[#EEEAF2] shrink-0">
                    <span class="material-icons-round text-lg">inventory_2</span>
                  </div>
                  <span class="text-sm font-bold text-[#1A1225] truncate max-w-[200px]">{{ product.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-[#475569]">{{ getMerchantName(product.merchantId) }}</td>
              <td class="px-6 py-4"><span class="badge-primary">{{ product.category }}</span></td>
              <td class="px-6 py-4 text-sm font-bold text-[#7630A3]">${{ product.price.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm text-[#475569]">{{ product.views.toLocaleString() }}</td>
              <td class="px-6 py-4">
                <span :class="product.status === 'active'
                  ? 'bg-[#64D2B1]/10 text-[#64D2B1]'
                  : 'bg-red-50 text-red-500'"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.625rem] font-black uppercase tracking-widest">
                  <span class="w-1.5 h-1.5 rounded-full" :class="product.status === 'active' ? 'bg-[#64D2B1]' : 'bg-red-500'"></span>
                  {{ product.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button class="w-8 h-8 rounded-lg transition-all flex items-center justify-center"
                    :class="product.status === 'active' ? 'bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white' : 'bg-[#64D2B1]/10 text-[#64D2B1] hover:bg-[#64D2B1] hover:text-white'"
                    @click="adminStore.toggleProductStatus(product.id)"
                    :title="product.status === 'active' ? 'Suspend' : 'Activate'">
                    <span class="material-icons-round text-lg">{{ product.status === 'active' ? 'pause_circle' : 'play_circle' }}</span>
                  </button>
                  <button class="w-8 h-8 rounded-lg bg-[#7630A3]/10 text-[#7630A3] flex items-center justify-center hover:bg-[#7630A3] hover:text-white transition-all"
                    @click="openEditModal(product)" title="Edit">
                    <span class="material-icons-round text-lg">edit</span>
                  </button>
                  <button class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    @click="adminStore.deleteProduct(product.id)" title="Delete">
                    <span class="material-icons-round text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="7" class="text-center py-16 text-[#7C757E]">
                <span class="material-icons-round text-5xl mb-3 block text-[#EEEAF2]">inventory_2</span>
                <p class="font-medium">No products found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showAddModal || editProduct" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="closeModal">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">{{ editProduct ? 'Edit Product' : 'Add New Product' }}</h3>
          <button class="text-[#7C757E] hover:text-[#1A1225] transition-colors" @click="closeModal">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Product Name</label>
            <input type="text" class="input-gts" v-model="productForm.name" placeholder="Product name" required>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Price (USD)</label>
              <input type="number" step="0.01" class="input-gts" v-model.number="productForm.price" placeholder="0.00">
            </div>
            <div class="space-y-2">
              <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Category</label>
              <select class="input-gts" v-model="productForm.category">
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
              </select>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Business</label>
            <select class="input-gts" v-model.number="productForm.merchantId">
              <option v-for="biz in approvedBusinesses" :key="biz.id" :value="biz.id">{{ biz.name }}</option>
            </select>
          </div>
          <button class="btn-gts-primary w-full py-4 rounded-xl mt-2" @click="handleSaveProduct" :disabled="!productForm.name || !productForm.price">
            <span class="material-icons-round">{{ editProduct ? 'save' : 'add' }}</span>
            {{ editProduct ? 'Save Changes' : 'Add Product' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const searchQuery = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const editProduct = ref(null)

const productForm = ref({
  name: '', price: 0, category: 'Electronics', merchantId: 1
})

const approvedBusinesses = computed(() => adminStore.approvedBusinesses)

const merchants = computed(() => {
  const map = {}
  adminStore.businesses.forEach(b => { map[b.id] = b.name })
  return map
})

function getMerchantName(id) {
  return merchants.value[id] || 'Unknown'
}

const filteredProducts = computed(() => {
  let list = [...adminStore.approvedProducts]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }
  if (statusFilter.value) {
    list = list.filter(p => p.status === statusFilter.value)
  }
  return list
})

function openEditModal(product) {
  editProduct.value = product
  productForm.value = { name: product.name, price: product.price, category: product.category, merchantId: product.merchantId }
}

function closeModal() {
  showAddModal.value = false
  editProduct.value = null
  productForm.value = { name: '', price: 0, category: 'Electronics', merchantId: approvedBusinesses.value[0]?.id || 1 }
}

function handleSaveProduct() {
  if (editProduct.value) {
    adminStore.updateProduct(editProduct.value.id, { ...productForm.value })
  } else {
    adminStore.addProduct({ ...productForm.value })
  }
  closeModal()
}
</script>
