<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-extrabold mb-2">Product Management</h1>
        <p class="text-neutral-500">Review and manage all products across the platform</p>
      </div>
      <span class="text-sm text-neutral-500">{{ filteredProducts.length }} products</span>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-md">
        <span class="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">search</span>
        <input type="text" class="input-gts pl-10" v-model="searchQuery" placeholder="Search products..." id="admin-product-search">
      </div>
      <select class="select-gts max-w-[180px]" v-model="statusFilter">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>

    <!-- Products Table -->
    <div class="card-gts p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table-gts">
          <thead>
            <tr>
              <th>Product</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>Price</th>
              <th>Views</th>
              <th>Inquiries</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-500/[0.08] rounded-lg flex items-center justify-center text-neutral-500 shrink-0">
                    <span class="material-icons-round text-lg">image</span>
                  </div>
                  <span class="text-sm font-semibold text-white truncate max-w-[200px]">{{ product.name }}</span>
                </div>
              </td>
              <td class="text-sm">{{ getMerchantName(product.merchantId) }}</td>
              <td><span class="badge-primary">{{ product.category }}</span></td>
              <td class="text-sm font-semibold text-tertiary-300">${{ product.price.toFixed(2) }}</td>
              <td class="text-sm">{{ product.views.toLocaleString() }}</td>
              <td class="text-sm">{{ product.inquiries }}</td>
              <td>
                <span :class="product.status === 'active' ? 'badge-success' : 'badge-danger'">
                  {{ product.status }}
                </span>
              </td>
              <td>
                <div class="flex items-center justify-end gap-2">
                  <button class="btn-gts-icon transition-colors"
                    :class="product.status === 'active' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'"
                    @click="adminStore.toggleProductStatus(product.id)"
                    :title="product.status === 'active' ? 'Suspend' : 'Activate'">
                    <span class="material-icons-round text-lg">{{ product.status === 'active' ? 'pause_circle' : 'play_circle' }}</span>
                  </button>
                  <button class="btn-gts-icon bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    @click="adminStore.deleteProduct(product.id)" title="Delete">
                    <span class="material-icons-round text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="8" class="text-center py-12 text-neutral-500">
                <span class="material-icons-round text-4xl mb-2 block">inventory_2</span>
                No products found
              </td>
            </tr>
          </tbody>
        </table>
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

const merchants = {
  1: 'Hassan Electronics',
  2: 'Sara Fashion House'
}

function getMerchantName(id) {
  return merchants[id] || 'Unknown'
}

const filteredProducts = computed(() => {
  let list = [...adminStore.products]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }
  if (statusFilter.value) {
    list = list.filter(p => p.status === statusFilter.value)
  }
  return list
})
</script>
