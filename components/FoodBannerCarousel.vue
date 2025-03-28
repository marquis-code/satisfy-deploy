<template>
    <div class="relative my-6">
      <div class="overflow-hidden rounded-xl">
        <div 
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div 
            v-for="(banner, index) in banners" 
            :key="index" 
            class="min-w-full"
          >
            <div class="relative h-[200px] md:h-[250px] overflow-hidden bg-gradient-to-r" :class="banner.bgGradient">
              <div class="flex h-full items-center p-4 md:p-6">
                <div class="w-1/2 md:w-3/5 text-white z-10">
                  <h2 class="text-xl md:text-3xl font-bold mb-2">{{ banner.title }}</h2>
                  <p v-if="banner.subtitle" class="text-sm md:text-base mb-4">{{ banner.subtitle }}</p>
                  <button class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center">
                    <ShoppingBag size="16" class="mr-2" />
                    Order Now
                  </button>
                </div>
                <div class="w-1/2 md:w-2/5 relative h-full flex items-center justify-center">
                  <img 
                    :src="banner.image" 
                    :alt="banner.title" 
                    class="w-auto h-[180px] md:h-[220px] object-cover rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
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
          v-for="(_, index) in banners" 
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
  import meal1 from '@/assets/img/meal1.jpg'
  import meal2 from '@/assets/img/meal2.jpg'
  import meal3 from '@/assets/img/meal3.jpg'
  import meal4 from '@/assets/img/meal4.jpg'
  import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-vue-next';
  
  const banners = [
    {
      title: 'Party Jollof that Hit Well',
      image: meal1,
      bgGradient: 'from-red-800 to-red-600'
    },
    {
      title: 'Abula Tiwa Tiwa',
      image: meal2,
      bgGradient: 'from-red-700 to-red-500'
    },
    {
      title: 'Bringing Justrite Supermarket Closer',
      subtitle: 'to you',
      image: meal3,
      bgGradient: 'from-orange-600 to-yellow-500'
    },
    {
      title: 'Party Jollof that Hit Well',
      image: meal4,
      bgGradient: 'from-red-800 to-red-600'
    }
  ];
  
  const currentSlide = ref(0);
  const autoplayInterval = ref<number | null>(null);
  
  const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % banners.length;
    resetAutoplay();
  };
  
  const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + banners.length) % banners.length;
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