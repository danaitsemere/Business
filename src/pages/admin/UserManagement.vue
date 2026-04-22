<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">User Management</h1>
        <p class="text-[#475569] font-medium">Manage all platform users</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-gts-primary" @click="showCreateModal = true">
          <UserPlus class="w-5 h-5" /> New User
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div class="relative flex-1 max-w-md">
        <Search class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7C757E]" />
        <input type="text" class="input-gts pl-12" v-model="searchQuery" placeholder="Search users by name or email..." id="admin-user-search">
      </div>

      <select class="input-gts max-w-[200px]" v-model="statusFilter" id="admin-user-status-filter">
        <option value="">All Users ({{ adminStore.allUsers.length }})</option>
        <option value="active">Active ({{ adminStore.activeUsers.length }})</option>
        <option value="suspended">Suspended ({{ adminStore.suspendedUsers.length }})</option>
      </select>

      <select class="input-gts max-w-[180px]" v-model="roleFilter" id="admin-user-role-filter">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="customer">Customer</option>
      </select>

      <button v-if="statusFilter || searchQuery || roleFilter"
        class="btn-gts-secondary !rounded-full !px-5"
        @click="resetFilters" id="admin-user-reset-filters">
        <RotateCcw class="w-4 h-4" /> Reset Filters
      </button>
    </div>

    <div class="bg-white rounded-3xl border border-[#EEEAF2] shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[#EEEAF2]">
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">User</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Role</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Email</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Status</th>
              <th class="text-left px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Joined</th>
              <th class="text-right px-6 py-4 text-[0.688rem] font-black uppercase tracking-widest text-[#7C757E]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id" class="border-b border-[#EEEAF2] last:border-0 hover:bg-[#F8F6FB] transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#7630A3] flex items-center justify-center text-white text-xs font-black">{{ user.avatar }}</div>
                  <div>
                    <span class="block text-sm font-bold text-[#1A1225]">{{ user.fullName }}</span>
                    <span class="block text-xs text-[#7C757E]">{{ user.phone }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-[0.625rem] font-black uppercase tracking-widest"
                  :class="roleBadgeClass(user.role)">
                  {{ formatRole(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-[#475569]">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span v-if="user.status === 'suspended'" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.625rem] font-black uppercase tracking-widest bg-red-50 text-red-500">
                  <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Suspended
                </span>
                <span v-else class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.625rem] font-black uppercase tracking-widest bg-[#64D2B1]/10 text-[#64D2B1]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#64D2B1]"></span> Active
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-[#7C757E]">{{ user.createdAt }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button v-if="user.status === 'suspended'"
                    class="btn-gts-secondary !w-11 !h-11 !px-0 bg-[#64D2B1]/10 text-[#64D2B1] border-none hover:bg-[#64D2B1] hover:text-white"
                    @click="handleActivate(user.id)" title="Activate">
                    <CheckCircle2 class="w-5 h-5" />
                  </button>
                  <button v-else-if="user.role !== 'admin'"
                    class="btn-gts-secondary !w-11 !h-11 !px-0 bg-amber-50 text-amber-500 border-none hover:bg-amber-500 hover:text-white"
                    @click="handleSuspend(user.id)" title="Suspend">
                    <Ban class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="text-center py-16 text-[#7C757E]">
                <SearchX class="w-12 h-12 mx-auto mb-3 text-[#EEEAF2]" />
                <p class="font-medium">No users found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
      <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm"
        :disabled="currentPage === 1" @click="currentPage--">
        <ChevronLeft class="w-5 h-5" />
      </button>
      <button v-for="page in totalPages" :key="page"
        class="btn-gts !w-11 !h-11 !px-0"
        :class="currentPage === page ? 'bg-[#7630A3] text-white shadow-soft font-black' : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]'"
        @click="currentPage = page">
        {{ page }}
      </button>
      <button class="btn-gts-secondary !w-11 !h-11 !px-0 bg-white shadow-sm"
        :disabled="currentPage === totalPages" @click="currentPage++">
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showCreateModal = false">
      <div class="bg-white border border-[#EEEAF2] rounded-3xl p-8 w-full max-w-md animate-scale-in shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-heading text-xl font-black text-[#1A1225]">Create New Admin User</h3>
          <button class="btn-gts-secondary !w-11 !h-11 !px-0 !border-none" @click="showCreateModal = false">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Full Name</label>
            <input type="text" class="input-gts" v-model="newUserForm.fullName" placeholder="Enter full name" id="create-user-name">
          </div>
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Email</label>
            <input type="email" class="input-gts" v-model="newUserForm.email" placeholder="Enter email address" id="create-user-email">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Phone</label>
              <input type="text" class="input-gts" v-model="newUserForm.phone" placeholder="+251..." id="create-user-phone">
            </div>
            <div class="space-y-2">
              <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Role</label>
              <div class="input-gts flex items-center bg-[#F8F6FB] cursor-not-allowed">
                <span class="text-sm font-bold text-[#7630A3]">Admin</span>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Password</label>
            <input type="password" class="input-gts" v-model="newUserForm.password" placeholder="Set password" id="create-user-password">
          </div>
          <button class="btn-gts-primary w-full mt-2"
            @click="handleCreateUser"
            :disabled="!newUserForm.fullName || !newUserForm.email"
            id="create-user-submit">
            <UserPlus class="w-5 h-5" /> Create Admin User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'
import { Search, CheckCircle2, Ban, SearchX, UserPlus, X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const adminStore = useAdminStore()
const statusFilter = ref('')
const searchQuery = ref('')
const roleFilter = ref('')
const showCreateModal = ref(false)
const currentPage = ref(1)
const perPage = 6

const newUserForm = ref({
  fullName: '',
  email: '',
  phone: '',
  role: 'admin',
  password: ''
})

function roleBadgeClass(role) {
  const map = {
    admin: 'bg-[#7630A3]/10 text-[#7630A3]',
    customer: 'bg-[#64D2B1]/10 text-[#64D2B1]',
    merchant: 'bg-blue-50 text-blue-600',
    service_provider: 'bg-amber-50 text-amber-600'
  }
  return map[role] || 'bg-[#F8F6FB] text-[#7C757E]'
}

function formatRole(role) {
  const map = {
    admin: 'Admin',
    customer: 'Customer',
    merchant: 'Merchant',
    service_provider: 'Service Provider'
  }
  return map[role] || role
}

const filteredUsers = computed(() => {
  let list = adminStore.allUsers
  if (statusFilter.value) {
    list = list.filter(u => u.status === statusFilter.value)
  }
  if (roleFilter.value) {
    list = list.filter(u => u.role === roleFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / perPage))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})

watch([statusFilter, searchQuery, roleFilter], () => { currentPage.value = 1 })

function resetFilters() {
  statusFilter.value = ''
  searchQuery.value = ''
  roleFilter.value = ''
}

function handleActivate(id) { adminStore.activateUser(id) }
function handleSuspend(id) { adminStore.suspendUser(id) }

function handleCreateUser() {
  if (!newUserForm.value.fullName || !newUserForm.value.email) return
  adminStore.createUser({ ...newUserForm.value })
  showCreateModal.value = false
  newUserForm.value = { fullName: '', email: '', phone: '', role: 'admin', password: '' }
}
</script>
