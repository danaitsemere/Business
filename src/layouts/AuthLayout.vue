<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F8F6FB]">
    
    <div class="fixed inset-0 z-0">
      <div class="absolute w-[500px] h-[500px] bg-[#7630A3] rounded-full -top-32 -right-32 blur-[120px] opacity-10 animate-float"></div>
      <div class="absolute w-[400px] h-[400px] bg-[#64D2B1] rounded-full -bottom-24 -left-24 blur-[120px] opacity-10 animate-float" style="animation-delay:3s;"></div>
      <div class="absolute w-[300px] h-[300px] bg-[#7630A3] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-5 animate-float" style="animation-delay:5s;"></div>
    </div>
    <div class="relative z-10 w-full max-w-[520px] px-5 animate-fade-in">
      <router-view />
    </div>
  </div>
</template>

<script setup>
</script>
