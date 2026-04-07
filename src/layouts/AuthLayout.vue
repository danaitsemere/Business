<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Background orbs -->
    <div class="fixed inset-0 z-0">
      <div class="absolute w-[400px] h-[400px] bg-primary-500 rounded-full -top-24 -right-24 blur-[80px] opacity-30 animate-float"></div>
      <div class="absolute w-[300px] h-[300px] bg-tertiary-300 rounded-full -bottom-20 -left-20 blur-[80px] opacity-30 animate-float" style="animation-delay:3s;"></div>
      <div class="absolute w-[200px] h-[200px] bg-primary-300 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[80px] opacity-20 animate-float" style="animation-delay:5s;"></div>
    </div>
    <div class="relative z-10 w-full max-w-[480px] px-5 animate-fade-in">
      <router-view />
    </div>
  </div>
</template>

<script setup>
</script>
