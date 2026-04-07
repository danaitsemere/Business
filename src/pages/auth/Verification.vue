<template>
  <div class="w-full">
    <div class="card-glass p-10">
      <div class="text-center mb-6">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          :class="verificationStatus === 'verified' ? 'bg-green-500/15' : verificationStatus === 'pending' ? 'bg-amber-500/15' : 'bg-primary-500/15'">
          <span class="material-icons-round text-3xl"
            :class="verificationStatus === 'verified' ? 'text-green-400' : verificationStatus === 'pending' ? 'text-amber-400' : 'text-primary-300'">
            {{ verificationStatus === 'verified' ? 'verified' : verificationStatus === 'pending' ? 'hourglass_top' : 'upload_file' }}
          </span>
        </div>
        <h2 class="font-heading text-2xl font-bold mb-1.5">Account Verification</h2>
        <p class="text-neutral-500">Upload your documents for verification</p>
      </div>

      <!-- Status Banner -->
      <div class="flex items-center gap-3 p-4 rounded-lg mb-6 bg-surface-card border"
        :class="verificationStatus === 'verified' ? 'border-green-500/30' : verificationStatus === 'pending' ? 'border-amber-500/30' : 'border-white/[0.06]'">
        <span class="material-icons-round"
          :class="verificationStatus === 'verified' ? 'text-green-400' : verificationStatus === 'pending' ? 'text-amber-400' : 'text-primary-300'">
          {{ verificationStatus === 'verified' ? 'verified' : verificationStatus === 'pending' ? 'hourglass_top' : 'upload_file' }}
        </span>
        <div>
          <strong class="block text-sm">Status: {{ verificationStatus === 'verified' ? 'Verified' : verificationStatus === 'pending' ? 'Pending Review' : 'Not Submitted' }}</strong>
          <p class="text-xs text-neutral-500">{{ verificationStatus === 'verified' ? 'Your account is fully verified' : verificationStatus === 'pending' ? 'Your documents are under review' : 'Please upload your verification documents' }}</p>
        </div>
      </div>

      <!-- Upload Section -->
      <div v-if="verificationStatus === 'not-submitted'">
        <div class="border-2 border-dashed border-primary-500/20 rounded-xl p-10 text-center cursor-pointer transition-all duration-150 hover:border-primary-400 hover:bg-primary-500/[0.08] mb-5"
          @click="mockUpload">
          <span class="material-icons-round text-5xl text-primary-300 mb-3">cloud_upload</span>
          <h4 class="font-heading font-bold mb-1.5">Upload Documents</h4>
          <p class="text-neutral-500 text-[0.813rem] mb-2">Trade license, business registration, or service certification</p>
          <span class="text-xs text-neutral-500">Click to simulate upload</span>
        </div>

        <div v-if="uploadedFiles.length" class="flex flex-col gap-2 mb-5">
          <div v-for="(file, i) in uploadedFiles" :key="i"
            class="flex items-center gap-2.5 px-3.5 py-2.5 bg-surface-card rounded-lg border border-white/[0.06]">
            <span class="material-icons-round text-primary-300 text-lg">description</span>
            <span class="flex-1 text-sm">{{ file }}</span>
            <span class="material-icons-round text-neutral-500 text-lg cursor-pointer hover:text-red-400" @click="uploadedFiles.splice(i, 1)">close</span>
          </div>
        </div>

        <button class="btn-gts-primary btn-gts-lg w-full disabled:opacity-40 disabled:cursor-not-allowed" :disabled="!uploadedFiles.length" @click="submitVerification" id="verification-submit-btn">
          <span class="material-icons-round">verified</span>
          Submit for Verification
        </button>
      </div>

      <!-- Pending -->
      <div v-if="verificationStatus === 'pending'" class="text-center">
        <div class="progress-gts mb-5"><div class="progress-fill-gts" style="width: 60%;"></div></div>
        <p class="text-neutral-500 text-sm mb-4">Your documents are being reviewed. This usually takes 1-2 business days.</p>
        <button class="btn-gts-success" @click="mockApproval">
          <span class="material-icons-round">speed</span>
          Simulate Approval (Demo)
        </button>
      </div>

      <!-- Verified -->
      <div v-if="verificationStatus === 'verified'" class="text-center">
        <p class="text-neutral-500 text-sm mb-5">Your account has been verified. You now have full access to the platform.</p>
        <button class="btn-gts-primary btn-gts-lg w-full" @click="goToDashboard">
          <span class="material-icons-round">dashboard</span>
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/authStore.js'

const router = useRouter()
const authStore = useAuthStore()
const uploadedFiles = ref([])
const verificationStatus = ref('not-submitted')

function mockUpload() {
  const names = ['Trade_License.pdf', 'Business_Registration.pdf', 'Certificate.pdf']
  const f = names[Math.floor(Math.random() * names.length)]
  if (!uploadedFiles.value.includes(f)) uploadedFiles.value.push(f)
}
function submitVerification() { verificationStatus.value = 'pending'; authStore.submitVerification() }
function mockApproval() { verificationStatus.value = 'verified'; authStore.approveVerification() }
function goToDashboard() {
  const role = authStore.currentUser?.role
  if (role === 'merchant') router.push('/merchant/dashboard')
  else if (role === 'service-provider') router.push('/provider/dashboard')
  else router.push('/customer/home')
}
</script>
