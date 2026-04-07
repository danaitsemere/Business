<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-extrabold mb-2">Verification Center</h1>
        <p class="text-neutral-500">Review and approve merchant & service provider verifications</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <button class="chip-gts" :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">
        Pending ({{ pendingUsers.length }})
      </button>
      <button class="chip-gts" :class="{ active: activeTab === 'verified' }" @click="activeTab = 'verified'">
        Verified ({{ verifiedUsers.length }})
      </button>
      <button class="chip-gts" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
        All
      </button>
    </div>

    <!-- Verification Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="user in displayedUsers" :key="user.id" class="card-gts">
        <div class="flex items-start gap-4">
          <div class="avatar-gts w-14 h-14 text-lg">{{ user.avatar }}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-heading text-lg font-bold text-white truncate">{{ user.fullName }}</h3>
              <span v-if="user.verified" class="badge-success">Verified</span>
              <span v-else class="badge-warning">Pending</span>
            </div>
            <p class="text-sm text-neutral-500 capitalize mb-3">{{ user.role.replace('-', ' ') }}</p>

            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="p-3 bg-surface-secondary rounded-lg">
                <div class="text-[0.688rem] text-neutral-500 mb-0.5">Email</div>
                <div class="text-sm text-[#b8b0c4] truncate">{{ user.email }}</div>
              </div>
              <div class="p-3 bg-surface-secondary rounded-lg">
                <div class="text-[0.688rem] text-neutral-500 mb-0.5">Phone</div>
                <div class="text-sm text-[#b8b0c4]">{{ user.phone }}</div>
              </div>
              <div v-if="user.businessName" class="p-3 bg-surface-secondary rounded-lg">
                <div class="text-[0.688rem] text-neutral-500 mb-0.5">Business</div>
                <div class="text-sm text-[#b8b0c4]">{{ user.businessName }}</div>
              </div>
              <div v-if="user.serviceType" class="p-3 bg-surface-secondary rounded-lg">
                <div class="text-[0.688rem] text-neutral-500 mb-0.5">Service</div>
                <div class="text-sm text-[#b8b0c4]">{{ user.serviceType }}</div>
              </div>
              <div v-if="user.location || user.coverageArea" class="p-3 bg-surface-secondary rounded-lg">
                <div class="text-[0.688rem] text-neutral-500 mb-0.5">Location</div>
                <div class="text-sm text-[#b8b0c4]">{{ user.location || user.coverageArea }}</div>
              </div>
              <div class="p-3 bg-surface-secondary rounded-lg">
                <div class="text-[0.688rem] text-neutral-500 mb-0.5">Joined</div>
                <div class="text-sm text-[#b8b0c4]">{{ user.createdAt }}</div>
              </div>
            </div>

            <!-- Mock Documents -->
            <div v-if="!user.verified" class="mb-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Submitted Documents</p>
              <div class="flex gap-3">
                <div class="flex items-center gap-2 px-3 py-2 bg-surface-secondary rounded-lg text-sm text-[#b8b0c4]">
                  <span class="material-icons-round text-base text-primary-300">description</span>
                  Business License.pdf
                </div>
                <div class="flex items-center gap-2 px-3 py-2 bg-surface-secondary rounded-lg text-sm text-[#b8b0c4]">
                  <span class="material-icons-round text-base text-primary-300">badge</span>
                  ID Document.pdf
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="!user.verified" class="flex items-center gap-3">
              <button class="btn-gts-success btn-gts-sm" @click="handleApprove(user.id)">
                <span class="material-icons-round text-base">check_circle</span>
                Approve
              </button>
              <button class="btn-gts-danger btn-gts-sm" @click="handleReject(user.id)">
                <span class="material-icons-round text-base">cancel</span>
                Reject
              </button>
            </div>
            <div v-else class="flex items-center gap-2 text-sm text-green-400">
              <span class="material-icons-round text-base">verified</span>
              Verification approved
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="displayedUsers.length === 0" class="text-center py-16 text-neutral-500">
      <span class="material-icons-round text-5xl mb-3 block">verified</span>
      <p class="text-lg">{{ activeTab === 'pending' ? 'No pending verifications' : 'No users found' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const activeTab = ref('pending')

const allVerifiableUsers = computed(() =>
  adminStore.allUsers.filter(u => u.role === 'merchant' || u.role === 'service-provider')
)
const pendingUsers = computed(() => allVerifiableUsers.value.filter(u => !u.verified))
const verifiedUsers = computed(() => allVerifiableUsers.value.filter(u => u.verified))

const displayedUsers = computed(() => {
  if (activeTab.value === 'pending') return pendingUsers.value
  if (activeTab.value === 'verified') return verifiedUsers.value
  return allVerifiableUsers.value
})

function handleApprove(userId) { adminStore.verifyUser(userId) }
function handleReject(userId) { adminStore.suspendUser(userId) }
</script>
