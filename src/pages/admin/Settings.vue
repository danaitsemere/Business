<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-heading text-3xl font-black text-[#1A1225] mb-2">Settings</h1>
        <p class="text-[#475569] font-medium">Configure your platform preferences</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- General Settings -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-2xl bg-[#7630A3]/10 flex items-center justify-center">
            <span class="material-icons-round text-[#7630A3]">tune</span>
          </div>
          <h3 class="font-heading text-lg font-black text-[#1A1225]">General</h3>
        </div>

        <div class="flex flex-col gap-5">
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Platform Name</label>
            <input type="text" class="input-gts" v-model="localSettings.platformName" id="settings-platform-name">
          </div>
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Support Email</label>
            <input type="email" class="input-gts" v-model="localSettings.supportEmail" id="settings-support-email">
          </div>
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Currency</label>
            <select class="input-gts" v-model="localSettings.defaultCurrency">
              <option value="ETB">ETB (Birr)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[0.688rem] font-black uppercase text-[#7C757E] tracking-widest pl-1">Region</label>
            <select class="input-gts" v-model="localSettings.defaultRegion">
              <option value="Ethiopia">Ethiopia</option>
              <option value="Kenya">Kenya</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Uganda">Uganda</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notifications & Toggles -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-2xl bg-[#64D2B1]/10 flex items-center justify-center">
            <span class="material-icons-round text-[#64D2B1]">notifications</span>
          </div>
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Notifications & Features</h3>
        </div>

        <div class="flex flex-col gap-4">
          <div v-for="toggle in featureToggles" :key="toggle.key"
            class="flex items-center justify-between p-4 bg-[#F8F6FB] rounded-2xl border border-[#EEEAF2]">
            <div>
              <span class="block text-sm font-bold text-[#1A1225]">{{ toggle.label }}</span>
              <span class="block text-xs text-[#7C757E] mt-0.5">{{ toggle.description }}</span>
            </div>
            <button class="relative w-12 h-6 rounded-full transition-colors duration-200"
              :class="localSettings[toggle.key] ? 'bg-[#64D2B1]' : 'bg-[#EEEAF2]'"
              @click="localSettings[toggle.key] = !localSettings[toggle.key]">
              <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                :class="localSettings[toggle.key] ? 'translate-x-6' : 'translate-x-0'"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Theme -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEAF2] shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-2xl bg-[#7630A3]/10 flex items-center justify-center">
            <span class="material-icons-round text-[#7630A3]">palette</span>
          </div>
          <h3 class="font-heading text-lg font-black text-[#1A1225]">Theme</h3>
        </div>
        <div class="flex gap-4">
          <button class="flex-1 p-4 rounded-2xl border-2 transition-all text-center"
            :class="localSettings.theme === 'light' ? 'border-[#7630A3] bg-[#7630A3]/5' : 'border-[#EEEAF2] hover:border-[#7630A3]/30'"
            @click="localSettings.theme = 'light'">
            <span class="material-icons-round text-2xl text-[#7630A3] mb-2 block">light_mode</span>
            <span class="text-sm font-bold text-[#1A1225]">Light</span>
          </button>
          <button class="flex-1 p-4 rounded-2xl border-2 transition-all text-center"
            :class="localSettings.theme === 'dark' ? 'border-[#7630A3] bg-[#7630A3]/5' : 'border-[#EEEAF2] hover:border-[#7630A3]/30'"
            @click="localSettings.theme = 'dark'">
            <span class="material-icons-round text-2xl text-[#7630A3] mb-2 block">dark_mode</span>
            <span class="text-sm font-bold text-[#1A1225]">Dark</span>
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-white rounded-3xl p-8 border border-red-200 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
            <span class="material-icons-round text-red-500">warning</span>
          </div>
          <h3 class="font-heading text-lg font-black text-red-500">Danger Zone</h3>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-2xl">
            <div>
              <span class="block text-sm font-bold text-[#1A1225]">Maintenance Mode</span>
              <span class="block text-xs text-[#7C757E] mt-0.5">Temporarily disable platform access</span>
            </div>
            <button class="relative w-12 h-6 rounded-full transition-colors duration-200"
              :class="localSettings.maintenanceMode ? 'bg-red-500' : 'bg-[#EEEAF2]'"
              @click="localSettings.maintenanceMode = !localSettings.maintenanceMode">
              <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                :class="localSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'"></span>
            </button>
          </div>
          <div class="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-2xl">
            <div>
              <span class="block text-sm font-bold text-[#1A1225]">Clear All Data</span>
              <span class="block text-xs text-[#7C757E] mt-0.5">Reset platform to default state</span>
            </div>
            <button class="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors" @click="showResetConfirm = true">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex items-center justify-between mt-8 p-6 bg-white rounded-3xl border border-[#EEEAF2] shadow-sm">
      <div class="flex items-center gap-2">
        <span v-if="saved" class="flex items-center gap-1.5 text-sm text-[#64D2B1] font-bold animate-fade-in">
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
    <div v-if="showResetConfirm" class="fixed inset-0 bg-[#1A1225]/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4" @click.self="showResetConfirm = false">
      <div class="bg-white border border-red-200 rounded-3xl p-8 w-full max-w-sm animate-scale-in text-center shadow-2xl">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons-round text-3xl text-red-500">warning</span>
        </div>
        <h3 class="font-heading text-xl font-black text-[#1A1225] mb-2">Are you sure?</h3>
        <p class="text-sm text-[#475569] mb-6">This will reset all data to its default state. This action cannot be undone.</p>
        <div class="flex gap-3">
          <button class="flex-1 py-3 rounded-xl bg-[#F8F6FB] text-[#475569] font-bold hover:bg-[#EEEAF2] transition-colors" @click="showResetConfirm = false">Cancel</button>
          <button class="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors" @click="handleReset">Confirm Reset</button>
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
  { key: 'enableNotifications', label: 'Push Notifications', description: 'Enable platform-wide notifications' },
  { key: 'enableAnalytics', label: 'Analytics Tracking', description: 'Track user behavior and metrics' }
]

function handleSave() {
  adminStore.updateSettings(localSettings)
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}

function handleReset() {
  localStorage.removeItem('gts_users')
  localStorage.removeItem('gts_businesses')
  localStorage.removeItem('gts_products')
  localStorage.removeItem('gts_requests')
  localStorage.removeItem('gts_settings')
  localStorage.removeItem('gts_plans')
  showResetConfirm.value = false
  window.location.reload()
}
</script>
