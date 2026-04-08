<template>
  <footer class="bg-white border-t border-[#EEEAF2] pt-12 pb-6 px-6 lg:px-12">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-10">
        
        <!-- Brand Info -->
        <div class="md:col-span-4 space-y-5">
          <div class="flex items-center gap-5 cursor-pointer group" @click="$router.push('/customer/home')">
            <img src="../../assets/logo.png" alt="GTS Logo" class="h-16 w-auto group-hover:scale-105 transition-transform duration-300">
            <div class="h-12 w-[1.5px] bg-[#7630A3] opacity-30"></div>
            <div class="flex flex-col justify-center text-left">
              <span class="font-heading text-xl font-black text-[#7630A3] leading-none mb-1.5 tracking-tight">
                Grand Technology Solutions
              </span>
              <span class="text-[0.625rem] font-black uppercase tracking-[0.3em] text-[#7630A3]">
                Innovate • Inspire • Transform
              </span>
            </div>
          </div>
          <p class="text-[0.813rem] font-medium text-[#475569]/80 leading-relaxed max-w-xs pl-2">
            Empowering business through high-end technology curation and architectural excellence.
          </p>
    
          <div class="flex items-center gap-3 pt-2 pl-2">
            <a href="https://info@grandtechsolutions.com/" class="w-10 h-10 bg-[#F8F6FB] rounded-lg border border-[#EEEAF2] flex items-center justify-center text-[#7630A3] hover:scale-105 transition-all">
              <span class="material-icons-round text-xl">language</span>
            </a>
            <a href="https://www.youtube.com/channel/UCHEPtXsVR9g8XsBG4oXi1Vg" target="_blank" class="w-10 h-10 bg-[#F8F6FB] rounded-lg border border-[#EEEAF2] flex items-center justify-center text-[#7630A3] hover:scale-105 transition-all">
              <span class="material-icons-round text-xl">smart_display</span>
            </a>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="md:col-span-3 space-y-4">
          <h4 class="text-xs font-black text-[#7630A3] uppercase tracking-widest">Contacts</h4>
          <div class="space-y-3">
            <div class="flex items-center gap-3 text-[#475569]/80">
              <span class="material-icons-round text-base text-[#7630A3]">phone</span>
              <span class="text-[0.813rem] font-medium">+251987014339</span>
            </div>
            <div class="flex items-center gap-3 text-[#475569]/80">
              <span class="material-icons-round text-base text-[#7630A3]">mail</span>
              <span class="text-[0.813rem] font-medium">info@grandtechsolutions.com</span>
            </div>
            <div class="flex items-center gap-3 text-[#475569]/80">
              <span class="material-icons-round text-base text-[#7630A3]">location_on</span>
              <span class="text-[0.813rem] font-medium">03 Ayder, Mekelle, Tigray</span>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="md:col-span-5">
          <h4 class="text-xs font-black text-[#7630A3] uppercase tracking-widest mb-4">Find Us</h4>
          <div class="w-full h-48 rounded-2xl overflow-hidden border border-[#EEEAF2] shadow-sm">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.4!2d39.4753!3d13.4969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDI5JzQ5LjAiTiAzOcKwMjgnMzEuMCJF!5e0!3m2!1sen!2set!4v1680000000000!5m2!1sen!2set"
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              class="grayscale hover:grayscale-0 transition-all duration-500">
            </iframe>
          </div>
        </div>

      </div>

      <div class="pt-6 border-t border-[#EEEAF2]/50">
        <p class="text-[0.625rem] font-medium text-[#7C757E]/60 text-center md:text-left">
          Grand Technology Solutions || All rights reserved © 2025
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
