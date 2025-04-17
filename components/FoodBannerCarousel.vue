<template>
  <div class="relative my-6">
    <!-- Loader while fetching vendors -->
    <div v-if="isLoading" class="py-10">
        <div :class="'py-10'" class="flex flex-col items-center justify-center">
          <div class="relative">
            <div class="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <Pizza class="text-orange-500" size="20" />
            </div>
          </div>
          <p class="mt-4 text-gray-600">Loading vendors...</p>
        </div>
      </div>

    <div v-else class="overflow-hidden rounded-md">
      <div
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div 
          v-for="(vendor, index) in vendors" 
          :key="vendor._id" 
          class="min-w-full"
        >
          <div class="relative h-[200px] md:h-[250px] overflow-hidden bg-gradient-to-r" :class="getBgGradient(vendor)">
            <div class="flex h-full items-center p-4 md:p-6">
              <div class="w-1/2 md:w-3/5 text-white z-10">
                <h2 class="text-xl md:text-3xl font-bold mb-2">{{ vendor.restaurantName }}</h2>
                <p v-if="vendor.category" class="text-sm md:text-base mb-4">{{ vendor.category }}</p>
                <button @click="router.push(`/vendors/${vendor._id}`)" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center">
                  <ShoppingBag size="16" class="mr-2" />
                  Order Now
                </button>
              </div>
              <div class="w-1/2 md:w-2/5 relative h-full flex items-center justify-center">
                <img 
                  :src="vendor.displayImage || defaultImage" 
                  :alt="vendor.restaurantName" 
                  class="w-auto h-[180px] md:h-[220px] object-cover rounded-md shadow-lg transform transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <button 
      @click="prevSlide" 
      class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 transition-all duration-300 hover:scale-110"
      aria-label="Previous slide"
    >
      <ChevronLeft size="24" />
    </button>
    
    <button 
      @click="nextSlide" 
      class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 transition-all duration-300 hover:scale-110"
      aria-label="Next slide"
    >
      <ChevronRight size="24" />
    </button>
    
    <!-- Indicators -->
    <div class="flex justify-center mt-4">
      <button 
        v-for="(_, index) in vendors" 
        :key="index"
        @click="goToSlide(index)"
        class="w-2 h-2 mx-1 rounded-full transition-all duration-300"
        :class="currentSlide === index ? 'bg-red-500 w-6' : 'bg-gray-300'"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useFetchVendors } from '@/composables/modules/vendor/useFetchVendors';
import meal1 from '@/assets/img/meal1.jpg';
import meal2 from '@/assets/img/meal2.jpg';
import meal3 from '@/assets/img/meal3.jpg';
import meal4 from '@/assets/img/meal4.jpg';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-vue-next';

const router = useRouter();
const { vendors, loading: isLoading } = useFetchVendors();

// Default image to use if vendor does not have a display image
const defaultImage = meal1; // You can change this to any image you prefer

const currentSlide = ref(0);
const autoplayInterval = ref<number | null>(null);

// Get the background gradient class based on the vendor (or set default)
const getBgGradient = (vendor) => {
  if (vendor.category === 'fast food') {
    return 'from-red-800 to-red-600'; // Example gradient for fast food vendors
  }
  return 'from-gray-500 to-gray-300'; // Default gradient if no specific category
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % vendors.length;
  resetAutoplay();
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + vendors.length) % vendors.length;
  resetAutoplay();
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
  resetAutoplay();
};

const startAutoplay = () => {
  autoplayInterval.value = window.setInterval(() => {
    nextSlide();
  }, 5000);
};

const resetAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
  }
  startAutoplay();
};

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
  }
});
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
