<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">User Management</h1>
        <p class="text-[#475569] font-medium">Manage all platform users</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-[#7C757E] font-bold">{{ filteredUsers.length }} users</span>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <button v-for="tab in statusTabs" :key="tab.value"
        class="px-5 py-2.5 rounded-full text-[0.813rem] font-bold border-2 transition-all duration-200"
        :class="activeTab === tab.value
          ? 'bg-[#7630A3] border-[#7630A3] text-white shadow-soft'
          : 'bg-white border-[#EEEAF2] text-[#475569] hover:border-[#7630A3]/30'"
        @click="activeTab = tab.value">
        {{ tab.label }}
        <span class="ml-1 text-[0.688rem] opacity-70">({{ tab.count }})</span>
      </button>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <span class="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-[#7C757E]">search</span>
        <input type="text" class="input-gts pl-12" v-model="searchQuery" placeholder="Search users by name or email..." id="admin-user-search">
      </div>
    </div>

    <!-- Users Table -->
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
            <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-[#EEEAF2] last:border-0 hover:bg-[#F8F6FB] transition-colors">
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
                  :class="user.role === 'admin' ? 'bg-[#7630A3]/10 text-[#7630A3]' : 'bg-[#64D2B1]/10 text-[#64D2B1]'">
                  {{ user.role }}
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
                    class="w-8 h-8 rounded-lg bg-[#64D2B1]/10 text-[#64D2B1] flex items-center justify-center hover:bg-[#64D2B1] hover:text-white transition-all"
                    @click="handleActivate(user.id)" title="Activate">
                    <span class="material-icons-round text-lg">check_circle</span>
                  </button>
                  <button v-else-if="user.role !== 'admin'"
                    class="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all"
                    @click="handleSuspend(user.id)" title="Suspend">
                    <span class="material-icons-round text-lg">block</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="text-center py-16 text-[#7C757E]">
                <span class="material-icons-round text-5xl mb-3 block text-[#EEEAF2]">search_off</span>
                <p class="font-medium">No users found</p>
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
const activeTab = ref('all')
const searchQuery = ref('')

const statusTabs = computed(() => [
  { value: 'all', label: 'All Users', count: adminStore.allUsers.length },
  { value: 'active', label: 'Active', count: adminStore.activeUsers.length },
  { value: 'suspended', label: 'Suspended', count: adminStore.suspendedUsers.length }
])

const filteredUsers = computed(() => {
  let list = activeTab.value === 'all'
    ? adminStore.allUsers
    : activeTab.value === 'active'
      ? adminStore.activeUsers
      : adminStore.suspendedUsers
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  return list
})

function handleActivate(id) { adminStore.activateUser(id) }
function handleSuspend(id) { adminStore.suspendUser(id) }
</script>

<style scoped>
.shadow-soft { box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.1); }
</style>
