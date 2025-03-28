<template>
    <div class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
      <div class="relative">
        <img 
          :src="vendor.image" 
          :alt="vendor.name" 
          class="w-full h-48 object-cover"
        />
        <div v-if="vendor.promoted" class="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Promoted
        </div>
        <button class="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md transition-transform duration-300 hover:scale-110">
          <Heart size="20" class="text-gray-600" />
        </button>
        <div v-if="vendor.isOpen" class="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center">
          <CheckCircle size="14" class="mr-1" />
          Open
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg mb-1">{{ vendor.name }}</h3>
        <p class="text-gray-600 text-sm mb-3">{{ vendor.description }}</p>
        
        <div class="flex">
          <div v-for="i in 5" :key="i" class="mr-1">
            <Star 
              v-if="i <= Math.floor(vendor.rating)" 
              size="16" 
              class="text-yellow-400 fill-current" 
            />
            <Star 
              v-else-if="i - 0.5 <= vendor.rating" 
              size="16" 
              class="text-yellow-400" 
            />
            <Star 
              v-else
              size="16" 
              class="text-gray-300" 
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Heart, CheckCircle, Star } from 'lucide-vue-next';
  import type { Vendor } from '~/composables/useVendors';
  
  defineProps({
    vendor: {
      type: Object as () => Vendor,
      required: true
    }
  });
  </script>
