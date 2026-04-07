<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-extrabold mb-2">User Management</h1>
        <p class="text-neutral-500">Manage all platform users across all roles</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-neutral-500">{{ filteredUsers.length }} users</span>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <button v-for="tab in roleTabs" :key="tab.value"
        class="chip-gts" :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value">
        <span class="material-icons-round text-base">{{ tab.icon }}</span>
        {{ tab.label }}
        <span class="ml-1 text-[0.688rem] opacity-70">({{ tab.count }})</span>
      </button>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <span class="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">search</span>
        <input type="text" class="input-gts pl-10" v-model="searchQuery" placeholder="Search users by name or email..." id="admin-user-search">
      </div>
    </div>

    <!-- Users Table -->
    <div class="card-gts p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table-gts">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar-gts w-9 h-9 text-xs">{{ user.avatar }}</div>
                  <div>
                    <span class="block text-sm font-semibold text-white">{{ user.fullName }}</span>
                    <span class="block text-xs text-neutral-500">{{ user.phone }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge-gts capitalize" :class="{
                  'bg-red-500/20 text-red-300': user.role === 'admin',
                  'bg-primary-500/20 text-primary-200': user.role === 'merchant',
                  'bg-tertiary-300/20 text-tertiary-300': user.role === 'service-provider',
                  'bg-blue-500/20 text-blue-300': user.role === 'customer'
                }">
                  {{ user.role.replace('-', ' ') }}
                </span>
              </td>
              <td class="text-sm">{{ user.email }}</td>
              <td>
                <span v-if="user.suspended" class="badge-danger">Suspended</span>
                <span v-else-if="user.verified" class="badge-success">Verified</span>
                <span v-else class="badge-warning">Unverified</span>
              </td>
              <td class="text-sm">{{ user.createdAt }}</td>
              <td>
                <div class="flex items-center justify-end gap-2">
                  <button v-if="!user.verified && user.role !== 'customer'"
                    class="btn-gts-icon bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                    @click="handleVerify(user.id)" title="Verify">
                    <span class="material-icons-round text-lg">check_circle</span>
                  </button>
                  <button v-if="!user.suspended"
                    class="btn-gts-icon bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    @click="handleSuspend(user.id)" title="Suspend" :disabled="user.id === currentUser?.id">
                    <span class="material-icons-round text-lg">block</span>
                  </button>
                  <button v-else
                    class="btn-gts-icon bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    @click="handleUnsuspend(user.id)" title="Unsuspend" :disabled="user.id === currentUser?.id">
                    <span class="material-icons-round text-lg">lock_open</span>
                  </button>
                  <button class="btn-gts-icon bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    @click="handleDelete(user.id)" title="Delete" :disabled="user.id === currentUser?.id">
                    <span class="material-icons-round text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="text-center py-12 text-neutral-500">
                <span class="material-icons-round text-4xl mb-2 block">search_off</span>
                No users found
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
import { useAuthStore } from '../../store/authStore.js'

const adminStore = useAdminStore()
const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)
const activeTab = ref('all')
const searchQuery = ref('')

const roleTabs = computed(() => [
  { value: 'all', label: 'All Users', icon: 'people', count: adminStore.allUsers.length },
  { value: 'merchant', label: 'Merchants', icon: 'storefront', count: adminStore.merchantUsers.length },
  { value: 'service-provider', label: 'Providers', icon: 'local_shipping', count: adminStore.providerUsers.length },
  { value: 'customer', label: 'Customers', icon: 'person', count: adminStore.customerUsers.length }
])

const filteredUsers = computed(() => {
  let list = activeTab.value === 'all' ? adminStore.allUsers : adminStore.allUsers.filter(u => u.role === activeTab.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  return list
})

function handleVerify(id) { adminStore.verifyUser(id) }
function handleSuspend(id) { adminStore.suspendUser(id) }
function handleUnsuspend(id) { adminStore.unsuspendUser(id) }
function handleDelete(id) { adminStore.deleteUser(id) }
</script>
