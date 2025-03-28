<template>
  <section class="my-10">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">Vendors in FUNAAB</h2>
      <a href="#" class="text-red-700 hover:text-red-800 flex items-center transition-colors duration-300">
        View all
        <ChevronRight size="20" />
      </a>
    </div>
    
    <div class="relative mb-6">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search food or vendor" 
        class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        @input="handleSearch"
      />
      <Search 
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        :class="{'text-red-500': isSearching}"
        size="20" 
      />
      
      <!-- Animated search spinner -->
      <div v-if="isSearching" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="flex items-center space-x-2">
          <div class="relative">
            <div class="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <Pizza class="text-orange-500" size="12" />
            </div>
          </div>
          <span class="text-sm text-gray-500">Searching...</span>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="py-10">
      <LoadingSpinner message="Loading vendors..." containerClass="py-10" />
    </div>
    
    <!-- Search Results -->
    <div v-else-if="searchQuery && !isSearching">
      <div v-if="filteredVendors.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <VendorCard 
            v-for="vendor in filteredVendors" 
            :key="vendor.id" 
            :vendor="vendor" 
          />
        </div>
      </div>
      <div v-else>
        <EmptyState 
          title="No results found" 
          :description="`We couldn't find any vendors matching '${searchQuery}'`"
          illustration="/illustrations/no-results.svg"
          :iconTop="Pizza"
          :iconBottom="Coffee"
        >
          <div class="max-w-3xl mx-auto">
            <h3 class="text-xl font-bold mb-4">You may also like</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
              <div 
                v-for="vendor in suggestedVendors" 
                :key="vendor.id" 
                class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div class="relative">
                  <img :src="vendor.image" :alt="vendor.name" class="w-full h-32 object-cover" />
                  <div class="absolute top-2 right-2">
                    <button class="bg-white rounded-full p-1.5 shadow-sm transition-transform duration-300 hover:scale-110">
                      <Heart size="18" class="text-gray-600" />
                    </button>
                  </div>
                </div>
                <div class="p-3">
                  <h4 class="font-bold">{{ vendor.name }}</h4>
                  <p class="text-sm text-gray-500">{{ vendor.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </EmptyState>
      </div>
    </div>
    
    <!-- All Vendors Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <VendorCard 
        v-for="vendor in vendors" 
        :key="vendor.id" 
        :vendor="vendor" 
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ChevronRight, Search, Heart, Pizza, Coffee } from 'lucide-vue-next';
import { useVendors } from '@/composables/useVendors';
import VendorCard from './VendorCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import EmptyState from '@/components/EmptyState.vue';

const { vendors } = useVendors();

const searchQuery = ref('');
const isSearching = ref(false);
const isLoading = ref(false);
const searchTimeout = ref<number | null>(null);

const handleSearch = () => {
  isSearching.value = true;
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  searchTimeout.value = window.setTimeout(() => {
    isLoading.value = true;
    
    // Simulate API call delay
    setTimeout(() => {
      isSearching.value = false;
      isLoading.value = false;
    }, 1500);
  }, 500);
};

const filteredVendors = computed(() => {
  if (!searchQuery.value) return vendors.value;
  
  return vendors.value.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    vendor.tags?.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

const suggestedVendors = computed(() => {
  // Return some popular vendors or vendors with high ratings
  return vendors.value
    .filter(vendor => vendor.rating >= 4.5)
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);
});
</script>