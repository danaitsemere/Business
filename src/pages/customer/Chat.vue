<template>
  <div class="animate-fade-in h-full">
    <div class="flex bg-white overflow-hidden" style="height: calc(100vh - 72px);">

      <div class="w-80 border-r border-[#EEEAF2] flex flex-col bg-white shrink-0 hidden md:flex">
        <div class="p-5 border-b border-[#EEEAF2]">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <MessageSquare class="w-4 h-4 text-white" />
            </div>
            <div>
              <p class="text-sm font-black text-[#1A1225]">Messages</p>
              <p class="text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Your Conversations</p>
            </div>
          </div>
          <div class="relative">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" v-model="searchConv" placeholder="Search chats..."
              class="w-full pl-9 pr-3 py-2.5 bg-[#F8F6FB] border-none rounded-xl text-xs font-bold text-[#1A1225] focus:ring-2 focus:ring-primary-500/10 focus:outline-none placeholder:text-slate-400">
          </div>
        </div>

        <div class="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hide-scrollbar">
          <div class="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors border-l-[3px]"
            :class="!activeConvId ? 'bg-primary-500/5 border-primary-500' : 'hover:bg-[#F8F6FB] border-transparent'"
            @click="switchToOriginal">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0"
              :class="chatType === 'product' || chatType === 'request-list' ? 'bg-primary-500' : 'bg-tertiary-300'">
              {{ providerName.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0 text-left">
              <div class="flex items-center justify-between">
                <p class="text-sm font-black text-[#1A1225] truncate uppercase tracking-tight">{{ providerName }}</p>
                <span v-if="!activeConvId" class="text-[0.5rem] font-black uppercase" :class="hasRequest ? 'text-amber-500' : 'text-primary-500'">
                  {{ hasRequest ? requestStatusLabel : 'Active' }}
                </span>
              </div>
              <p class="text-[10px] font-bold truncate uppercase tracking-widest mt-0.5 opacity-60">
                {{ chatType === 'product' ? 'Product Chat' : (chatType === 'request-list' ? 'Bulk Request' : 'Service Chat') }}
              </p>
            </div>
          </div>

          <div v-for="conv in filteredConversations" :key="conv.id"
            class="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors border-l-[3px]"
            :class="isActiveConv(conv.id) ? 'bg-emerald-50 border-emerald-500' : 'hover:bg-[#F8F6FB] border-transparent'"
            @click="switchConversation(conv)">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
              :class="isActiveConv(conv.id) ? 'bg-emerald-500 text-white' : 'bg-[#F5F3F7] text-[#1A1225]'">
              {{ conv.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0 text-left">
              <div class="flex items-center justify-between">
                <p class="text-xs font-black text-[#1A1225] truncate uppercase tracking-tight">{{ conv.name }}</p>
                <span class="text-[0.5rem] font-bold text-slate-400 uppercase tracking-widest">{{ conv.time }}</span>
              </div>
              <p class="text-[10px] text-slate-400 font-medium truncate mt-0.5 leading-none">{{ conv.lastMsg }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col min-w-0">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#EEEAF2] bg-white">
          <div class="flex items-center gap-3">
            <button @click="$router.push('/customer/home')" class="btn-gts-secondary !w-11 !h-11 !px-0 md:hidden">
              <ArrowLeft class="w-4 h-4" />
            </button>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0"
              :class="chatType === 'product' || chatType === 'request-list' ? 'bg-primary-500' : 'bg-tertiary-300'">
              {{ contactInitial }}
            </div>
            <div class="text-left">
              <p class="font-black text-sm text-[#1A1225] uppercase tracking-tight">{{ contactName }}</p>
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full" :class="currentBusinessOnline ? 'bg-tertiary-300' : 'bg-slate-300'"></span>
                <span class="text-[0.6rem] font-black uppercase tracking-[0.1em]" :class="currentBusinessOnline ? 'text-tertiary-300' : 'text-slate-400'">{{ currentBusinessOnline ? 'Online' : 'Away' }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border-2"
              :class="chatMode === 'completed' ? 'bg-emerald-50 border-emerald-100' :
                       chatMode === 'request' ? 'bg-amber-50 border-amber-100' : 'bg-primary-50 border-primary-100'">
              <component :is="chatMode === 'completed' ? CheckCircle2 : (chatMode === 'request' ? ClipboardCheck : Info)"
                class="w-3.5 h-3.5"
                :class="chatMode === 'completed' ? 'text-emerald-500' : (chatMode === 'request' ? 'text-amber-500' : 'text-primary-500')" />
              <span class="text-[0.625rem] font-black uppercase tracking-widest"
                :class="chatMode === 'completed' ? 'text-emerald-600' : (chatMode === 'request' ? 'text-amber-600' : 'text-primary-600')">
                {{ chatMode === 'completed' ? 'Completed' : (chatMode === 'request' ? 'Request Active' : 'Inquiry') }}
              </span>
            </div>

            <div class="relative group">
              <button @click="copyPhone" class="btn-gts-secondary !w-11 !h-11 !px-0">
                <Phone class="w-4 h-4" />
              </button>
              <div v-if="showPhoneCopied" class="absolute top-full mt-1 right-0 px-3 py-1.5 bg-emerald-500 text-white text-[0.55rem] font-black uppercase tracking-widest rounded-lg shadow-lg whitespace-nowrap z-50">
                Copied!
              </div>
              <div v-else class="absolute top-full mt-1 right-0 px-3 py-1.5 bg-[#1A1225] text-white text-[0.55rem] font-black uppercase tracking-widest rounded-lg shadow-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                {{ currentBusinessPhone }}
              </div>
            </div>
          </div>
        </div>

        <div ref="chatScrollArea" class="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-[#FAFAFE] [&::-webkit-scrollbar]:hide-scrollbar">
          <div v-if="hasRequest" class="bg-white border-2 border-primary-500/10 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div class="w-14 h-14 rounded-xl bg-[#F8F6FB] flex items-center justify-center shrink-0 border border-[#EEEAF2]">
              <img v-if="detailImage" :src="detailImage" class="w-full h-full object-contain p-1.5 rounded-xl" />
              <Package v-else class="w-6 h-6 text-primary-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-black text-[#1A1225] uppercase tracking-tight truncate">{{ activeRequest?.productName || activeRequest?.serviceType }}</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {{ chatQuantity > 1 ? `x${chatQuantity} · ` : '' }}{{ contactName }} · #{{ activeRequest?.id?.toString().slice(-6) }}
              </p>
            </div>
            <span class="px-3 py-1.5 rounded-lg text-[0.5rem] font-black uppercase tracking-widest border shrink-0"
              :class="requestStatusUI.class">
              {{ requestStatusLabel }}
            </span>
          </div>

          <div class="flex gap-4 items-end max-w-[85%]">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-xs text-white"
              :class="chatType === 'product' || chatType === 'request-list' ? 'bg-primary-500' : 'bg-tertiary-300'">
              {{ contactInitial }}
            </div>
            <div class="space-y-1.5">
              <div class="bg-white border-2 border-[#EEEAF2] rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm">
                <p class="text-sm text-[#1A1225] font-medium leading-relaxed">{{ welcomeMessage }}</p>
              </div>
              <span class="text-[0.6rem] text-slate-400 font-bold ml-2 uppercase tracking-widest">{{ chatStartTime }}</span>
            </div>
          </div>

          <template v-for="(msg, i) in messages" :key="i">
            <div v-if="msg.sender === 'system'" class="flex flex-col items-center justify-center py-4">
              <div class="flex items-center gap-2 px-6 py-2 rounded-full border-2 bg-white"
                :class="msg.systemType === 'completed' ? 'border-emerald-100 text-emerald-500 shadow-sm' :
                         msg.systemType === 'created' ? 'border-primary-100 text-primary-500' : 'border-amber-100 text-amber-500'">
                <component :is="msg.icon" class="w-4 h-4" />
                <span class="text-[0.625rem] font-black uppercase tracking-widest">{{ msg.text }}</span>
              </div>
              <p v-if="msg.subtext" class="text-[0.55rem] text-slate-400 font-bold uppercase mt-2 tracking-widest">{{ msg.subtext }}</p>
            </div>

            <div v-else-if="msg.sender === 'user'" class="flex flex-col items-end gap-1.5">
              <div class="bg-primary-500 text-white rounded-2xl rounded-br-sm px-5 py-3.5 max-w-[75%] shadow-lg shadow-primary-500/10">
                <p class="text-sm font-medium leading-relaxed whitespace-pre-line">{{ msg.text }}</p>
              </div>
              <div class="flex items-center gap-1.5 mr-2">
                <span class="text-[0.6rem] text-slate-400 font-bold uppercase">{{ msg.time }}</span>
                <CheckCircle2 class="w-3 h-3 text-tertiary-300" />
              </div>
            </div>

            <div v-else class="flex gap-4 items-end max-w-[85%]">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-xs text-white"
                :class="chatType === 'product' || chatType === 'request-list' ? 'bg-primary-500' : 'bg-tertiary-300'">
                {{ contactInitial }}
              </div>
              <div class="space-y-1.5">
                <div class="bg-white border-2 border-[#EEEAF2] rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm hover:border-primary-500/10 transition-colors">
                  <p class="text-sm text-[#1A1225] font-medium leading-relaxed whitespace-pre-line">{{ msg.text }}</p>
                </div>
                <span class="text-[0.6rem] text-slate-400 font-bold ml-2 uppercase tracking-widest">{{ msg.time }}</span>
              </div>
            </div>
          </template>

          <div v-if="isTyping" class="flex gap-4 items-end animate-pulse">
            <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
               <Loader2 class="w-4 h-4 text-slate-300 animate-spin" />
            </div>
            <div class="bg-white border-2 border-[#EEEAF2] rounded-2xl rounded-bl-sm px-5 py-3.5">
              <div class="flex gap-1.5">
                <div class="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-75"></div>
                <div class="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-6 border-t border-[#EEEAF2] bg-white">
          <div v-if="chatMode === 'inquiry' && messages.length > 0 && !hasRequest" class="mb-5 flex justify-center">
            <button @click="openRequestModal"
              class="btn-gts-primary group !bg-primary-500/5 !text-primary-500 !border-dashed !border-2 !border-primary-500/20 hover:!bg-primary-500 hover:!text-white hover:!border-solid transition-all duration-500"
              :disabled="!canCreateRequest"
              :class="!canCreateRequest ? 'opacity-40 cursor-not-allowed' : ''">
              <ClipboardPlus class="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <div class="text-left">
                <p class="text-[0.625rem] font-black uppercase tracking-widest leading-none mb-1">Create Request</p>
                <p class="text-[0.5rem] font-bold opacity-70 uppercase tracking-tighter">Formalize this into an order</p>
              </div>
              <ArrowRight class="w-4 h-4 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div class="flex items-center gap-4">
            <button class="btn-gts-secondary !w-11 !h-11 !px-0 flex items-center justify-center shrink-0">
              <Paperclip class="w-5 h-5" />
            </button>
            <div class="flex-1 relative">
              <input v-model="chatInput" type="text"
                class="w-full px-6 py-4 bg-[#F8F6FB] border-2 border-transparent rounded-2xl text-sm font-bold text-[#1A1225] focus:bg-white focus:border-primary-500/20 focus:outline-none placeholder:text-slate-400 transition-all"
                :placeholder="chatMode === 'completed' ? 'Follow up with merchant...' : (chatMode === 'request' ? 'Message about your request...' : 'Ask the merchant a question...')"
                @keydown.enter="sendMessage">
            </div>
            <button @click="sendMessage"
              class="btn-gts-primary !w-11 !h-11 !px-0 flex items-center justify-center shrink-0"
              :class="chatInput.trim() ? 'bg-primary-500 text-white shadow-lg active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'"
              :disabled="!chatInput.trim()">
              <Send class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div class="w-80 border-l border-[#EEEAF2] flex flex-col bg-white shrink-0 hidden lg:flex text-left relative">
        <div class="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hide-scrollbar">
          <template v-if="chatMode === 'inquiry'">
            <div class="p-8 text-center bg-gradient-to-b from-primary-500/5 to-transparent">
              <div class="w-28 h-28 rounded-3xl mx-auto mb-6 flex items-center justify-center relative bg-white shadow-xl border border-[#EEEAF2] p-4">
                <img v-if="detailImage" :src="detailImage" :alt="contactName" class="w-full h-full object-contain mix-blend-multiply" />
                <span v-else class="text-4xl font-black text-primary-500">{{ contactInitial }}</span>
                <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-tertiary-300 rounded-xl border-4 border-white flex items-center justify-center shadow-lg">
                  <BadgeCheck class="w-4 h-4 text-white" />
                </div>
              </div>
              <h4 class="text-xl font-black text-[#1A1225] mb-2 uppercase tracking-tight">{{ contactName }}</h4>
              <p class="text-[0.6rem] text-slate-400 font-black uppercase tracking-[0.2em] mb-6">Verified Business</p>

              <div class="flex items-center justify-center gap-1 mb-4">
                <Star v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= Math.round(currentBusinessRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-100'" />
                <span class="text-xs font-black text-[#1A1225] ml-2">{{ currentBusinessRating }}</span>
                <span class="text-[0.6rem] text-slate-400 font-bold ml-1 uppercase">({{ currentBusinessInquiries }})</span>
              </div>
            </div>

            <div class="p-8 space-y-8">
              <div class="space-y-4">
                <h5 class="flex items-center justify-between">
                  <span class="text-[0.65rem] font-black uppercase text-slate-400 tracking-widest">About</span>
                  <div class="h-0.5 flex-1 bg-[#EEEAF2] ml-4"></div>
                </h5>
                <div class="grid grid-cols-1 gap-4">
                  <div class="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F6FB]">
                    <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin class="w-4 h-4 text-primary-500" />
                    </div>
                    <div>
                      <p class="text-[0.55rem] text-slate-400 font-black uppercase tracking-wider">Location</p>
                      <p class="text-xs font-black text-[#1A1225] uppercase tracking-tighter">{{ currentBusinessLocation }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F6FB]">
                    <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <Clock class="w-4 h-4 text-tertiary-300" />
                    </div>
                    <div>
                      <p class="text-[0.55rem] text-slate-400 font-black uppercase tracking-wider">Avg. Response</p>
                      <p class="text-xs font-black text-[#1A1225] uppercase tracking-tighter">{{ currentBusinessResponseTime }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h5 class="flex items-center justify-between">
                  <span class="text-[0.65rem] font-black uppercase text-slate-400 tracking-widest">Performance</span>
                  <div class="h-0.5 flex-1 bg-[#EEEAF2] ml-4"></div>
                </h5>
                <div class="space-y-6">
                  <div>
                    <div class="flex justify-between items-end mb-2">
                       <span class="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest">Success Rate</span>
                       <span class="text-xs font-black text-primary-500 italic">{{ currentBusinessSuccessRate }}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-[#F5F3F7] rounded-full overflow-hidden">
                      <div class="h-full bg-primary-500 rounded-full" :style="{ width: currentBusinessSuccessRate + '%' }"></div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between border-t border-[#EEEAF2] pt-6">
                    <div class="text-center flex-1 border-r border-[#EEEAF2]">
                      <p class="text-lg font-black text-[#1A1225]">{{ currentBusinessOrders }}</p>
                      <p class="text-[0.5rem] text-slate-400 font-bold uppercase tracking-widest">Orders</p>
                    </div>
                    <div class="text-center flex-1">
                      <p class="text-lg font-black text-[#1A1225]">{{ currentBusinessYears }}</p>
                      <p class="text-[0.5rem] text-slate-400 font-bold uppercase tracking-widest">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="p-8 text-center bg-gradient-to-b" :class="chatMode === 'completed' ? 'from-emerald-500/5' : 'from-amber-500/5'" style="background-image: none;">
              <div class="w-24 h-24 rounded-3xl mx-auto mb-5 flex items-center justify-center bg-white shadow-xl border p-2 relative"
                :class="chatMode === 'completed' ? 'border-emerald-100' : 'border-amber-100'">
                 <img v-if="detailImage" :src="detailImage" class="w-full h-full object-contain" />
                 <Package v-else class="w-10 h-10 text-amber-500" />
                 <div class="absolute -top-3 -right-3 px-3 py-1 text-white text-[0.6rem] font-black rounded-lg shadow-lg uppercase tracking-widest"
                   :class="chatMode === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'">
                   #{{ activeRequest?.id?.toString().slice(-6) }}
                 </div>
              </div>

              <h4 class="text-lg font-black text-[#1A1225] mb-2 uppercase tracking-tight">{{ activeRequest?.productName || activeRequest?.serviceType }}</h4>
              <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.6rem] font-black uppercase tracking-[0.15em] border-2 shadow-sm"
                :class="requestStatusUI.class">
                <component :is="requestStatusUI.icon" class="w-3 h-3" />
                {{ requestStatusLabel }}
              </div>
            </div>

            <div class="p-8 space-y-8">
              <div class="space-y-4">
                <h5 class="flex items-center justify-between">
                  <span class="text-[0.65rem] font-black uppercase text-slate-400 tracking-widest">Request Details</span>
                  <div class="h-0.5 flex-1 bg-[#EEEAF2] ml-4"></div>
                </h5>

                <div v-if="activeRequest?.items?.length" class="space-y-2">
                  <div v-for="(item, idx) in activeRequest.items" :key="idx"
                    class="flex items-center justify-between px-3 py-2.5 bg-[#F8F6FB] rounded-xl">
                    <span class="text-[0.65rem] font-black text-[#1A1225] uppercase tracking-tight">{{ item.name }} <span class="text-primary-500">x{{ item.quantity }}</span></span>
                    <span class="text-[0.65rem] font-black text-slate-500">ETB {{ (item.price * item.quantity).toLocaleString() }}</span>
                  </div>
                </div>

                <div class="space-y-3">
                  <div v-if="activeRequest?.totalPrice" class="flex justify-between items-center py-3 border-b border-[#EEEAF2]">
                    <span class="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest">Total Price</span>
                    <span class="text-sm font-black text-[#1A1225]">ETB {{ activeRequest.totalPrice.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between items-center py-3 border-b border-[#EEEAF2]">
                    <span class="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest">Request Type</span>
                    <span class="text-xs font-black uppercase">{{ activeRequest?.type === 'product' ? 'Product' : 'Service' }}</span>
                  </div>
                  <div class="flex justify-between items-center py-3 border-b border-[#EEEAF2]">
                    <span class="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest">Provider</span>
                    <span class="text-xs font-black text-[#1A1225]">{{ contactName }}</span>
                  </div>
                  <div class="flex justify-between items-center py-3 border-b border-[#EEEAF2]">
                    <span class="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest">Status</span>
                    <span class="text-xs font-black uppercase" :class="chatMode === 'completed' ? 'text-emerald-500' : 'text-amber-500'">{{ requestStatusLabel }}</span>
                  </div>
                  <div v-if="activeRequest?.deliveryDate" class="flex justify-between items-center py-3 border-b border-[#EEEAF2]">
                    <span class="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest">Est. Delivery</span>
                    <span class="text-xs font-black text-[#1A1225]">{{ formatDate(activeRequest.deliveryDate) }}</span>
                  </div>
                  <div class="flex justify-between items-center py-3">
                    <span class="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest">Placed On</span>
                    <span class="text-xs font-black text-[#1A1225]">{{ formatDate(activeRequest?.createdAt) }}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                 <h5 class="flex items-center justify-between">
                  <span class="text-[0.65rem] font-black uppercase text-slate-400 tracking-widest">Timeline</span>
                  <div class="h-0.5 flex-1 bg-[#EEEAF2] ml-4"></div>
                </h5>

                <div class="relative space-y-0">
                  <div v-for="(step, idx) in activeRequest?.timeline" :key="idx" class="flex items-start gap-4 group">
                    <div class="flex flex-col items-center">
                      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-500 shadow-sm"
                        :class="idx === activeRequest.timeline.length - 1 ? 'border-primary-500 bg-primary-500 text-white' : 'border-[#EEEAF2] bg-white text-slate-300'">
                        <Check v-if="idx < activeRequest.timeline.length - 1" class="w-3 h-3" />
                        <div v-else class="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <div v-if="idx < activeRequest.timeline.length - 1" class="w-0.5 h-10 bg-[#EEEAF2] transition-colors duration-500"></div>
                    </div>
                    <div class="pb-6">
                      <p class="text-[0.65rem] font-black uppercase tracking-widest leading-none mb-1.5"
                        :class="idx === activeRequest.timeline.length - 1 ? 'text-primary-500' : 'text-slate-400'">
                        {{ step.label }}
                      </p>
                      <p class="text-[0.55rem] font-bold text-slate-300 uppercase tracking-tighter">{{ formatTime(step.date) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-if="showRequestModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showRequestModal = false">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div class="flex items-center justify-between px-8 py-6 border-b border-[#EEEAF2] bg-gradient-to-r from-primary-500/5 to-transparent">
          <div>
            <h3 class="text-lg font-black text-[#1A1225] uppercase tracking-tight">{{ isProductRequest ? 'Product Request' : 'Service Request' }}</h3>
            <p class="text-[0.6rem] text-slate-400 font-bold uppercase tracking-widest mt-1">Review & confirm your order</p>
          </div>
          <button @click="showRequestModal = false" class="btn-gts-secondary !w-11 !h-11 !px-0 bg-[#F8F6FB] hover:!bg-red-50 hover:!text-red-500">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div class="flex items-center gap-3 p-4 bg-[#F8F6FB] rounded-2xl">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0" :class="isProductRequest ? 'bg-primary-500' : 'bg-tertiary-300'">
              {{ contactInitial }}
            </div>
            <div>
              <p class="text-xs font-black text-[#1A1225] uppercase tracking-tight">{{ contactName }}</p>
              <p class="text-[0.55rem] text-slate-400 font-bold uppercase tracking-widest">{{ isProductRequest ? 'Product Supplier' : 'Service Provider' }}</p>
            </div>
          </div>

          <template v-if="isProductRequest">
            <div class="space-y-3">
              <label class="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">Items</label>
              <div v-for="(item, idx) in modalItems" :key="idx" class="flex items-center gap-3 p-3 bg-[#F8F6FB] rounded-xl border border-[#EEEAF2]">
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-[#1A1225] uppercase tracking-tight truncate">{{ item.name }}</p>
                  <p v-if="item.price > 0" class="text-[0.55rem] text-slate-400 font-bold">ETB {{ item.price.toLocaleString() }} each</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button @click="item.quantity = Math.max(1, item.quantity - 1)" class="btn-gts-secondary !w-11 !h-11 !px-0 font-black text-lg">−</button>
                  <span class="w-8 text-center text-sm font-black text-[#1A1225]">{{ item.quantity }}</span>
                  <button @click="item.quantity++" class="btn-gts-secondary !w-11 !h-11 !px-0 font-black text-lg">+</button>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="space-y-2">
              <label class="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">Service Type</label>
              <input type="text" v-model="modalServiceName" class="input-gts" />
            </div>
            <div class="space-y-2">
              <label class="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">Description</label>
              <textarea v-model="modalDescription" rows="3" class="w-full px-4 py-3 bg-[#F8F6FB] border-2 border-transparent rounded-xl text-sm font-medium text-[#1A1225] focus:bg-white focus:border-primary-500/20 focus:outline-none resize-none" placeholder="Describe what you need..."></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">Budget (ETB)</label>
              <input type="number" v-model.number="modalServicePrice" min="0" class="input-gts" placeholder="0 = To be quoted" />
            </div>
          </template>

          <div class="space-y-2">
            <label class="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">{{ isProductRequest ? 'Preferred Delivery Date' : 'Needed By' }}</label>
            <input type="date" v-model="modalDeliveryDate" class="input-gts" />
          </div>

          <div v-if="modalTotal > 0" class="flex items-center justify-between p-4 bg-primary-500/5 rounded-2xl border-2 border-primary-500/10">
            <span class="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Estimated Total</span>
            <span class="text-lg font-black text-primary-500">ETB {{ modalTotal.toLocaleString() }}</span>
          </div>
        </div>

        <div class="px-8 py-6 border-t border-[#EEEAF2] flex items-center gap-3">
          <button @click="showRequestModal = false" class="flex-1 btn-gts-secondary">
            Cancel
          </button>
          <button @click="confirmRequest" class="flex-1 btn-gts-primary">
            Confirm Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '../../store/customerStore.js'
import {
  MessageSquare, Search, ArrowLeft, Phone, BadgeCheck,
  MapPin, Clock, Star, Paperclip, Send, CheckCircle2,
  Package, Check, Loader2, ClipboardPlus, ClipboardCheck, Info,
  ArrowRight, X
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const customerStore = useCustomerStore()

const chatInput = ref('')
const isTyping = ref(false)
const chatScrollArea = ref(null)
const searchConv = ref('')
const messages = ref([])
const activeRequest = ref(null)
const hoverRating = ref(0)
const selectedRating = ref(0)
const chatStartTime = ref('')
const showPhoneCopied = ref(false)
const switchedContactName = ref(null)
const switchedBusinessId = ref(null)
const originalMessages = ref([])
const originalRequest = ref(null)
const currentChatId = ref(null)

const showRequestModal = ref(false)
const modalItems = ref([])
const modalServiceName = ref('')
const modalDescription = ref('')
const modalServicePrice = ref(0)
const modalDeliveryDate = ref('')

const isProductRequest = computed(() => chatType.value === 'product' || chatType.value === 'request-list')
const modalTotal = computed(() => {
  if (isProductRequest.value) {
    return modalItems.value.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  }
  return modalServicePrice.value || 0
})

const chatType = computed(() => route.query.type || 'service')
const providerName = computed(() => route.query.provider || 'Business')
const productName = computed(() => route.query.product || '')
const serviceType = computed(() => route.query.serviceType || 'Inquiry')
const productId = computed(() => route.query.productId ? parseInt(route.query.productId) : null)
const businessId = computed(() => route.query.businessId ? parseInt(route.query.businessId) : null)
const initialMessage = computed(() => route.query.initialMessage || '')
const chatQuantity = computed(() => route.query.quantity ? parseInt(route.query.quantity) : 1)

const contactName = computed(() => switchedContactName.value || providerName.value)
const contactInitial = computed(() => contactName.value.charAt(0))
const hasRequest = computed(() => !!activeRequest.value)
const canCreateRequest = computed(() => {
  if (chatType.value === 'product') return !!productId.value
  return true 
})

const chatMode = computed(() => {
  if (!activeRequest.value) return 'inquiry'
  if (activeRequest.value.status === 'completed' || activeRequest.value.status === 'rated') return 'completed'
  return 'request'
})

const product = computed(() => productId.value ? customerStore.getProductById(productId.value) : null)
const effectiveBusinessId = computed(() => switchedBusinessId.value || businessId.value)
const business = computed(() => effectiveBusinessId.value ? customerStore.getBusinessById(effectiveBusinessId.value) : null)
const detailImage = computed(() => product.value?.image || null)
const detailLocation = computed(() => business.value?.location || 'Addis Ababa')

const currentBusinessRating = computed(() => business.value?.rating || 4.8)
const currentBusinessInquiries = computed(() => business.value?.totalInquiries || 162)
const currentBusinessLocation = computed(() => business.value?.location || 'Addis Ababa')
const currentBusinessPhone = computed(() => business.value?.phone || '+251911234567')
const currentBusinessSuccessRate = computed(() => {
  const r = business.value?.rating || 4.8
  return (r / 5 * 100).toFixed(1)
})
const currentBusinessOrders = computed(() => {
  const v = business.value?.totalViews || 1200
  return v >= 1000 ? (v/1000).toFixed(1) + 'k+' : v + '+'
})
const currentBusinessYears = computed(() => {
  if (!business.value?.createdAt) return '2 Years'
  const yrs = Math.max(1, Math.floor((Date.now() - new Date(business.value.createdAt).getTime()) / (365.25*24*60*60*1000)))
  return yrs === 1 ? '1 Year' : yrs + ' Years'
})

const currentBusinessResponseTime = computed(() => business.value?.responseTime || '~15 Minutes')
const currentBusinessOnline = computed(() => {
  if (!business.value) return true
  return business.value.status === 'approved'
})

const requestStatusLabel = computed(() => {
  const s = activeRequest.value?.status
  const map = {
    'pending': 'Pending',
    'accepted': 'Accepted',
    'in-progress': 'Processing',
    'completed': 'Completed',
    'rated': 'Closed'
  }
  return map[s] || 'Pending'
})

const requestStatusUI = computed(() => {
  const s = activeRequest.value?.status
  if (s === 'completed' || s === 'rated') return { class: 'bg-emerald-50 border-emerald-100 text-emerald-600', icon: CheckCircle2 }
  if (s === 'in-progress') return { class: 'bg-blue-50 border-blue-100 text-blue-600', icon: Loader2 }
  if (s === 'accepted') return { class: 'bg-blue-50 border-blue-100 text-blue-500', icon: CheckCircle2 }
  return { class: 'bg-amber-50 border-amber-100 text-amber-600', icon: Clock }
})

const welcomeMessage = computed(() => {
  if (chatType.value === 'product') return `Hello! Thanks for your interest in "${productName.value || 'this product'}". How can I help you?`
  if (chatType.value === 'request-list') return `I see you have items in your cart. I'm ready to discuss availability and pricing.`
  return `Hi! How can I help you with our ${serviceType.value} services?`
})

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'
const formatTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Just now'

onMounted(() => {
  chatStartTime.value = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  currentChatId.value = customerStore.getChatId(businessId.value, chatType.value, productId.value)
  const reqId = route.query.requestId
  if (reqId) {
    const existing = customerStore.serviceRequests.find(r => r.id === parseInt(reqId))
    if (existing) {
       activeRequest.value = existing
       const hist = customerStore.getChatMessages(existing.id)
       messages.value = hist.map(m => ({
         ...m,
         time: new Date(m.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
       }))
    }
  }
  if (messages.value.length === 0) {
    const savedSession = customerStore.getChatSession(currentChatId.value)
    if (savedSession) {
      if (savedSession.messages?.length) {
        messages.value = [...savedSession.messages]
      }
      if (savedSession.requestId && !activeRequest.value) {
        const linked = customerStore.serviceRequests.find(r => r.id === savedSession.requestId)
        if (linked) activeRequest.value = linked
      }
    }
  }
  if (initialMessage.value && messages.value.length === 0) {
    chatInput.value = initialMessage.value
    setTimeout(() => {
      sendMessage()
      setTimeout(() => {
        originalMessages.value = [...messages.value]
        persistChat()
      }, 2000)
    }, 400)
  } else {
    originalMessages.value = [...messages.value]
  }
  originalRequest.value = activeRequest.value
  const sess = customerStore.getChatSession(currentChatId.value)
  customerStore.saveChatSession(currentChatId.value, {
    businessId: businessId.value,
    providerName: providerName.value,
    chatType: chatType.value,
    productId: productId.value,
    productName: productName.value,
    createdAt: sess?.createdAt || new Date().toISOString()
  })
})

function scrollToBottom() {
  nextTick(() => {
    if (chatScrollArea.value) chatScrollArea.value.scrollTop = chatScrollArea.value.scrollHeight
  })
}

function persistChat() {
  if (!currentChatId.value) return
  customerStore.saveChatMessages(currentChatId.value, messages.value)
}

function openRequestModal() {
  if (hasRequest.value) return
  if (!canCreateRequest.value) return
  const p = product.value
  const defaultDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  modalDeliveryDate.value = defaultDate
  if (isProductRequest.value && p) {
    modalItems.value = [{ id: p.id, name: p.name, quantity: chatQuantity.value, price: p.salePrice || p.price }]
    modalServiceName.value = ''
    modalDescription.value = ''
    modalServicePrice.value = 0
  } else if (isProductRequest.value && chatType.value === 'request-list') {
    modalItems.value = customerStore.requestList.map(cartItem => {
      const prod = customerStore.getProductById(cartItem.id)
      return prod ? { id: prod.id, name: prod.name, quantity: cartItem.quantity, price: prod.salePrice || prod.price } : null
    }).filter(Boolean)
    modalServiceName.value = ''
    modalDescription.value = ''
    modalServicePrice.value = 0
  } else {
    const lastUserMsg = [...messages.value].reverse().find(m => m.sender === 'user')
    modalItems.value = []
    modalServiceName.value = serviceType.value || 'Service'
    modalDescription.value = lastUserMsg?.text || ''
    modalServicePrice.value = 0
  }
  showRequestModal.value = true
}

function confirmRequest() {
  if (hasRequest.value) return
  showRequestModal.value = false
  const now = new Date()
  let items = []
  let itemLabel = ''
  let description = ''
  if (isProductRequest.value) {
    items = modalItems.value.map(i => ({ ...i }))
    itemLabel = items.length === 1 ? items[0].name : `${items.length} Items`
  } else {
    const svcName = modalServiceName.value || 'Service'
    description = modalDescription.value || `${svcName} service request`
    itemLabel = svcName
    items = [{ name: svcName, quantity: 1, price: modalServicePrice.value || 0 }]
  }
  const totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  const qty = isProductRequest.value && items.length === 1 ? items[0].quantity : 1
  const qtyLabel = qty > 1 ? ` (x${qty})` : ''
  const reqData = {
    chatId: currentChatId.value,
    type: isProductRequest.value ? 'product' : 'service',
    serviceType: isProductRequest.value ? 'Product' : (modalServiceName.value || serviceType.value || 'Service'),
    providerName: contactName.value,
    productName: itemLabel,
    productId: productId.value,
    businessId: effectiveBusinessId.value,
    quantity: qty,
    items,
    description,
    location: currentBusinessLocation.value,
    deliveryDate: modalDeliveryDate.value ? new Date(modalDeliveryDate.value).toISOString() : undefined,
    createdAt: now.toISOString()
  }
  const req = customerStore.submitServiceRequest(reqData)
  activeRequest.value = req
  if (currentChatId.value) {
    customerStore.linkRequestToChat(currentChatId.value, req.id)
  }
  const totalStr = totalPrice > 0 ? ` · ETB ${totalPrice.toLocaleString()}` : ''
  messages.value.push({
    sender: 'system',
    text: 'Request Created',
    subtext: `${itemLabel}${qtyLabel}${totalStr} · #${req.id.toString().slice(-6)}`,
    icon: markRaw(ClipboardCheck),
    systemType: 'created',
    time: formatTime(now)
  })
  persistChat()
  simulateMerchantResponse()
  scrollToBottom()
}

function simulateMerchantResponse() {
  if (!activeRequest.value) return
  const rid = activeRequest.value.id
  setTimeout(() => {
    customerStore.updateRequestStatus(rid, 'accepted')
    refreshActiveRequest()
    messages.value.push({ sender: 'system', text: 'Request Accepted', icon: markRaw(CheckCircle2), time: formatTime(new Date()) })
    messages.value.push({ sender: 'merchant', text: "I've reviewed your request and I'm happy to help. Starting now!", time: formatTime(new Date()) })
    persistChat()
    scrollToBottom()
    setTimeout(() => {
      customerStore.updateRequestStatus(rid, 'in-progress')
      refreshActiveRequest()
      messages.value.push({ sender: 'system', text: 'In Progress', icon: markRaw(Loader2), time: formatTime(new Date()) })
      persistChat()
      scrollToBottom()
      setTimeout(() => {
        customerStore.updateRequestStatus(rid, 'completed')
        refreshActiveRequest()
        messages.value.push({
          sender: 'system', text: 'Request Completed', icon: markRaw(Star), systemType: 'completed', time: formatTime(new Date())
        })
        messages.value.push({ sender: 'merchant', text: "All done! Your request has been fulfilled. Please rate your experience.", time: formatTime(new Date()) })
        persistChat()
        scrollToBottom()
      }, 7000)
    }, 5000)
  }, 3000)
}

function refreshActiveRequest() {
  if (activeRequest.value) {
    activeRequest.value = { ...customerStore.serviceRequests.find(r => r.id === activeRequest.value.id) }
  }
}

function sendMessage() {
  const text = chatInput.value.trim()
  if (!text) return
  messages.value.push({ sender: 'user', text, time: formatTime(new Date()) })
  if (activeRequest.value) customerStore.addChatMessage(activeRequest.value.id, { sender: 'user', text })
  chatInput.value = ''
  persistChat()
  scrollToBottom()
  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    const replies = hasRequest.value
      ? [`Understood, I've noted that.`, `Got it, working on it.`, `Thanks for the update!`]
      : [`Good question! Let me check on that.`, `Yes, we have that available. Want to create a request?`, `I'll look into it right away.`]
    const reply = replies[Math.floor(Math.random() * replies.length)]
    messages.value.push({ sender: 'merchant', text: reply, time: formatTime(new Date()) })
    if (activeRequest.value) customerStore.addChatMessage(activeRequest.value.id, { sender: 'merchant', text: reply })
    persistChat()
    scrollToBottom()
  }, 1500)
}

const mockConversations = [
  { id: 1, name: 'Selam Fashion House', businessId: 2, time: 'Yesterday', lastMsg: 'We have new arrivals in our latest collection!',
    messages: [
      { sender: 'user', text: 'Hi, do you have the Designer Silk Scarf in stock?', time: '10:30 AM' },
      { sender: 'merchant', text: 'Yes! We have it in several colors. Would you like to see options?', time: '10:35 AM' },
      { sender: 'user', text: 'The midnight blue sounds perfect, what\'s the price?', time: '10:38 AM' },
      { sender: 'merchant', text: 'We have new arrivals in our latest collection!', time: '10:42 AM' }
    ]
  },
  { id: 2, name: 'Sheger Organic Foods', businessId: 3, time: '2d ago', lastMsg: 'The coffee beans are freshly roasted!',
    messages: [
      { sender: 'user', text: 'Do you have Yirgacheffe coffee beans in stock?', time: '2:15 PM' },
      { sender: 'merchant', text: 'Yes, we just received a fresh batch! How many kilos?', time: '2:20 PM' },
      { sender: 'user', text: 'I need 5kg for my cafe. What\'s the bulk price?', time: '2:22 PM' },
      { sender: 'merchant', text: 'The coffee beans are freshly roasted!', time: '2:28 PM' }
    ]
  },
  { id: 3, name: 'Lucy Beauty & Wellness', businessId: 5, time: '3d ago', lastMsg: 'Your skincare consultation is confirmed.',
    messages: [
      { sender: 'user', text: 'Hi, I\'m looking for organic skincare for sensitive skin.', time: '11:00 AM' },
      { sender: 'merchant', text: 'We have a great range! I\'d recommend our Shea Butter line.', time: '11:10 AM' },
      { sender: 'user', text: 'That sounds wonderful, what\'s available?', time: '11:15 AM' },
      { sender: 'merchant', text: 'Your skincare consultation is confirmed.', time: '11:20 AM' }
    ]
  }
]

const activeConvId = ref(null)
const filteredConversations = computed(() => mockConversations.filter(c => c.name.toLowerCase().includes(searchConv.value.toLowerCase())))

function switchConversation(conv) {
  if (!activeConvId.value && originalMessages.value.length === 0) {
    originalMessages.value = [...messages.value]
    originalRequest.value = activeRequest.value
  }
  activeConvId.value = conv.id
  switchedContactName.value = conv.name
  switchedBusinessId.value = conv.businessId
  messages.value = [...conv.messages]
  activeRequest.value = null
  hoverRating.value = 0
  selectedRating.value = 0
  scrollToBottom()
}

function switchToOriginal() {
  if (!activeConvId.value) return
  activeConvId.value = null
  switchedContactName.value = null
  switchedBusinessId.value = null
  messages.value = [...originalMessages.value]
  activeRequest.value = originalRequest.value
  hoverRating.value = 0
  selectedRating.value = 0
  scrollToBottom()
}

function isActiveConv(convId) {
  return activeConvId.value === convId
}

function copyPhone() {
  const phone = currentBusinessPhone.value
  navigator.clipboard.writeText(phone).then(() => {
    showPhoneCopied.value = true
    setTimeout(() => { showPhoneCopied.value = false }, 2000)
  })
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
