<template>
  <div class="w-full max-w-4xl mx-auto px-4">
    <div class="bg-white rounded-[2.5rem] p-10 lg:p-14 border border-[#EEEAF2] shadow-xl relative overflow-hidden">
      <!-- Back -->
      <router-link to="/" class="absolute left-10 top-10 text-slate-400 hover:text-[#7630A3] transition-colors group">
         <span class="material-icons-round text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
      </router-link>

      <div class="text-center mb-16">
        <h2 class="font-heading text-3xl font-black text-[#1A1225] mb-2 tracking-tight">Identity Hub</h2>
        <p class="text-slate-500 font-medium text-sm">Select your gateway into the GTS Ecosystem.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div v-for="role in roles" :key="role.id"
          class="group bg-[#F8F6FB]/50 border border-[#EEEAF2] rounded-3xl p-8 transition-all hover:bg-white hover:border-[#7630A3]/30 hover:shadow-xl cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
          @click="selectRole(role.id)">
          
          <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#7630A3] shadow-soft mb-6 group-hover:bg-[#7630A3] group-hover:text-white transition-all transform group-hover:scale-110">
            <span class="material-icons-round text-3xl">{{ role.icon }}</span>
          </div>
          
          <h3 class="font-heading text-lg font-black text-[#1A1225] mb-2">{{ role.title }}</h3>
          <p class="text-[0.813rem] text-slate-500 font-medium leading-relaxed">{{ role.desc }}</p>
          
          <div class="mt-8 flex items-center gap-2 text-[#7630A3] font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Select Role <span class="material-icons-round text-sm">arrow_forward</span>
          </div>
        </div>
      </div>

      <div class="text-center space-y-4 pt-8 border-t border-[#F5F3F7]">
        <p class="text-sm font-medium text-slate-400">
          Already have an identity? <router-link to="/login" class="text-[#7630A3] font-black hover:underline">Sign In</router-link>
        </p>
        <p class="text-[0.625rem] text-slate-300 font-black uppercase tracking-[0.2em] pt-4">Looking for platform management? System Admin</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const roles = [
  { id: 'customer', title: 'Customer', icon: 'person', desc: 'Browse products, book services & discover merchants.' },
]

function selectRole(role) { router.push(`/register?role=${role}`) }
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 4px 20px -4px rgba(118, 48, 163, 0.12);
}
</style>
