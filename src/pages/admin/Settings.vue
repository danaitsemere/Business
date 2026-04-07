<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-extrabold mb-2">Platform Settings</h1>
        <p class="text-neutral-500">Configure global platform preferences and policies</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- General Settings -->
      <div class="card-gts">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-primary-500/15 flex items-center justify-center">
            <span class="material-icons-round text-primary-300">tune</span>
          </div>
          <h3 class="font-heading text-lg font-bold">General</h3>
        </div>

        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#b8b0c4]">Platform Name</label>
            <input type="text" class="input-gts" v-model="localSettings.platformName" id="settings-platform-name">
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#b8b0c4]">Support Email</label>
            <input type="email" class="input-gts" v-model="localSettings.supportEmail" id="settings-support-email">
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#b8b0c4]">Default Currency</label>
            <select class="select-gts" v-model="localSettings.defaultCurrency">
              <option value="USD">USD ($)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#b8b0c4]">Default Region</label>
            <select class="select-gts" v-model="localSettings.defaultRegion">
              <option value="UAE">UAE</option>
              <option value="SAU">Saudi Arabia</option>
              <option value="QAT">Qatar</option>
              <option value="KWT">Kuwait</option>
              <option value="BHR">Bahrain</option>
              <option value="OMN">Oman</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Feature Toggles -->
      <div class="card-gts">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-tertiary-300/15 flex items-center justify-center">
            <span class="material-icons-round text-tertiary-300">toggle_on</span>
          </div>
          <h3 class="font-heading text-lg font-bold">Feature Toggles</h3>
        </div>

        <div class="flex flex-col gap-4">
          <div v-for="toggle in featureToggles" :key="toggle.key"
            class="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <span class="block text-sm font-semibold text-white">{{ toggle.label }}</span>
              <span class="block text-xs text-neutral-500 mt-0.5">{{ toggle.description }}</span>
            </div>
            <button class="relative w-12 h-6 rounded-full transition-colors duration-200"
              :class="localSettings[toggle.key] ? 'bg-green-500' : 'bg-neutral-700'"
              @click="localSettings[toggle.key] = !localSettings[toggle.key]">
              <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                :class="localSettings[toggle.key] ? 'translate-x-6' : 'translate-x-0'"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Product Limits -->
      <div class="card-gts">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <span class="material-icons-round text-blue-400">inventory_2</span>
          </div>
          <h3 class="font-heading text-lg font-bold">Product Limits</h3>
        </div>

        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#b8b0c4]">Starter Plan (max products)</label>
            <input type="number" class="input-gts" v-model.number="localSettings.maxProductsPerFree">
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#b8b0c4]">Professional Plan (max products)</label>
            <input type="number" class="input-gts" v-model.number="localSettings.maxProductsPerPro">
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-[#b8b0c4]">Enterprise Plan</label>
            <div class="input-gts flex items-center gap-2 text-neutral-500 cursor-default">
              <span class="material-icons-round text-base">all_inclusive</span>
              Unlimited
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card-gts border-red-500/20">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
            <span class="material-icons-round text-red-400">warning</span>
          </div>
          <h3 class="font-heading text-lg font-bold text-red-400">Danger Zone</h3>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between p-4 bg-red-500/[0.05] border border-red-500/20 rounded-lg">
            <div>
              <span class="block text-sm font-semibold text-white">Maintenance Mode</span>
              <span class="block text-xs text-neutral-500 mt-0.5">Temporarily disable platform access for all users</span>
            </div>
            <button class="relative w-12 h-6 rounded-full transition-colors duration-200"
              :class="localSettings.maintenanceMode ? 'bg-red-500' : 'bg-neutral-700'"
              @click="localSettings.maintenanceMode = !localSettings.maintenanceMode">
              <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                :class="localSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'"></span>
            </button>
          </div>
          <div class="flex items-center justify-between p-4 bg-red-500/[0.05] border border-red-500/20 rounded-lg">
            <div>
              <span class="block text-sm font-semibold text-white">Reset All Analytics</span>
              <span class="block text-xs text-neutral-500 mt-0.5">Clear all analytics data (irreversible)</span>
            </div>
            <button class="btn-gts-danger btn-gts-sm" @click="showResetConfirm = true">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex items-center justify-between mt-8 p-6 card-gts">
      <div class="flex items-center gap-2">
        <span v-if="saved" class="flex items-center gap-1.5 text-sm text-green-400 font-medium animate-fade-in">
          <span class="material-icons-round text-base">check_circle</span>
          Settings saved successfully
        </span>
      </div>
      <button class="btn-gts-primary" @click="handleSave">
        <span class="material-icons-round">save</span>
        Save Settings
      </button>
    </div>

    <!-- Reset Confirmation Modal -->
    <div v-if="showResetConfirm" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showResetConfirm = false">
      <div class="bg-surface-card border border-red-500/20 rounded-2xl p-8 w-full max-w-sm animate-scale-in text-center">
        <span class="material-icons-round text-5xl text-red-400 mb-4">warning</span>
        <h3 class="font-heading text-xl font-bold mb-2">Are you sure?</h3>
        <p class="text-sm text-neutral-500 mb-6">This action cannot be undone. All analytics data will be permanently deleted.</p>
        <div class="flex gap-3">
          <button class="btn-gts-secondary flex-1" @click="showResetConfirm = false">Cancel</button>
          <button class="btn-gts-danger flex-1" @click="showResetConfirm = false">Confirm Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAdminStore } from '../../store/adminStore.js'

const adminStore = useAdminStore()
const saved = ref(false)
const showResetConfirm = ref(false)

const localSettings = reactive({ ...adminStore.settings })

const featureToggles = [
  { key: 'enableNotifications', label: 'Push Notifications', description: 'Enable system-wide push notifications' },
  { key: 'enableAnalytics', label: 'Analytics Tracking', description: 'Track user behavior and platform metrics' },
  { key: 'autoApproveVerification', label: 'Auto-Approve Verification', description: 'Automatically verify new merchants and providers' }
]

function handleSave() {
  adminStore.updateSettings(localSettings)
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}
</script>
