<template>
    <div class="min-h-screen">
      <div class="container mx-auto">
        <!-- Working Hours Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-8 transform transition-all duration-500 hover:shadow-2xl">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center mb-8">
            <span class="relative">
              Vendor Availability
              <span class="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-full transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
            <Clock class="ml-3 h-6 w-6 text-orange-500" />
          </h2>
          
          <div class="space-y-6">
            <div 
              v-for="(day, index) in workingHours" 
              :key="day.name"
              class="grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-5 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              :class="{'animate-pulse-once': day.isUpdating}"
            >
              <div class="text-gray-700 dark:text-gray-300 font-medium text-lg">{{ day.name }}</div>
              
              <div class="flex justify-center">
                <div 
                  class="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 relative"
                  :class="day.isOpen ? 'bg-green-500' : 'bg-red-500'"
                  @click="confirmToggleDay(day)"
                >
                  <Clock v-if="day.isOpen" class="h-6 w-6 text-white" />
                  <X v-else class="h-6 w-6 text-white" />
                  <span class="absolute -bottom-6 text-xs font-medium" :class="day.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    {{ day.isOpen ? 'Available' : 'Unavailable' }}
                  </span>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">Opening Time</div>
                  <div class="relative group">
                    <input 
                      type="time" 
                      v-model="day.openingTime"
                      :disabled="!day.isOpen"
                      class="w-full border rounded-lg py-3 px-4 pr-10 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      :class="day.isOpen 
                        ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white' 
                        : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'"
                      @focus="day.isFocused = 'opening'"
                      @blur="day.isFocused = null"
                    />
                    <Clock 
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200" 
                      :class="day.isOpen ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'"
                    />
                    <span 
                      class="absolute inset-0 border-2 border-orange-500 rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none"
                      :class="{'opacity-100': day.isOpen && day.isFocused === 'opening'}"
                    ></span>
                  </div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">Closing Time</div>
                  <div class="relative group">
                    <input 
                      type="time" 
                      v-model="day.closingTime"
                      :disabled="!day.isOpen"
                      class="w-full border rounded-lg py-3 px-4 pr-10 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      :class="day.isOpen 
                        ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white' 
                        : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'"
                      @focus="day.isFocused = 'closing'"
                      @blur="day.isFocused = null"
                    />
                    <Clock 
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200" 
                      :class="day.isOpen ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'"
                    />
                    <span 
                      class="absolute inset-0 border-2 border-orange-500 rounded-lg opacity-0 transition-opacity duration-200 pointer-events-none"
                      :class="{'opacity-100': day.isOpen && day.isFocused === 'closing'}"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4 mt-8">
            <button 
              @click="showDiscardConfirmation = true"
              class="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 shadow-sm hover:shadow group"
            >
              <span class="flex items-center">
                <span class="relative overflow-hidden">
                  <span class="relative z-10">Discard</span>
                  <span class="absolute inset-0 bg-gray-200 dark:bg-gray-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </span>
              </span>
            </button>
            <button 
              @click="confirmUpdate"
              class="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span class="flex items-center">
                Update
                <CheckCircle class="ml-2 h-5 w-5" />
              </span>
            </button>
          </div>
        </div>
  
        <!-- Availability Summary Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Availability Summary</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
              <h4 class="text-green-700 dark:text-green-400 font-medium mb-2 flex items-center">
                <CheckCircle class="h-5 w-5 mr-2" />
                Available Days
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="day in availableDays" 
                  :key="day.name"
                  class="px-3 py-1 bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  {{ day.name }}
                </span>
                <span v-if="availableDays.length === 0" class="text-gray-500 dark:text-gray-400 text-sm italic">
                  No available days
                </span>
              </div>
            </div>
            
            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-100 dark:border-red-800">
              <h4 class="text-red-700 dark:text-red-400 font-medium mb-2 flex items-center">
                <X class="h-5 w-5 mr-2" />
                Unavailable Days
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="day in unavailableDays" 
                  :key="day.name"
                  class="px-3 py-1 bg-red-100 dark:bg-red-800/40 text-red-700 dark:text-red-300 rounded-full text-sm"
                >
                  {{ day.name }}
                </span>
                <span v-if="unavailableDays.length === 0" class="text-gray-500 dark:text-gray-400 text-sm italic">
                  No unavailable days
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h4 class="text-blue-700 dark:text-blue-400 font-medium mb-2 flex items-center">
              <Info class="h-5 w-5 mr-2" />
              Weekly Hours
            </h4>
            <p class="text-gray-700 dark:text-gray-300">
              You are available for <span class="font-bold text-blue-600 dark:text-blue-300">{{ totalHours }}</span> hours per week.
            </p>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Confirmation Modals -->
    <Teleport to="body">
      <!-- Discard Changes Confirmation -->
      <Transition name="modal">
        <div 
          v-if="showDiscardConfirmation" 
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          @click.self="showDiscardConfirmation = false"
        >
          <div 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300"
            :class="{ 'scale-100 opacity-100': showDiscardConfirmation, 'scale-95 opacity-0': !showDiscardConfirmation }"
          >
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 mb-5">
                <AlertTriangle class="h-8 w-8" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Discard Changes?</h3>
              <p class="text-gray-500 dark:text-gray-400 mb-8">Are you sure you want to discard all changes? This action cannot be undone.</p>
              
              <div class="flex justify-center space-x-4">
                <button 
                  @click="showDiscardConfirmation = false"
                  class="px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button 
                  @click="discardChanges"
                  class="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Toggle Day Confirmation -->
      <Transition name="modal">
        <div 
          v-if="showToggleDayConfirmation" 
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          @click.self="showToggleDayConfirmation = false"
        >
          <div 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300"
            :class="{ 'scale-100 opacity-100': showToggleDayConfirmation, 'scale-95 opacity-0': !showToggleDayConfirmation }"
          >
            <div class="text-center">
              <div 
                class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                :class="dayToToggle?.isOpen 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-500' 
                  : 'bg-green-100 dark:bg-green-900/30 text-green-500'"
              >
                <component :is="dayToToggle?.isOpen ? X : CheckCircle" class="h-8 w-8" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ dayToToggle?.isOpen ? 'Mark as Unavailable' : 'Mark as Available' }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-8">
                Are you sure you want to mark <span class="font-bold">{{ dayToToggle?.name }}</span> as 
                <span 
                  class="font-bold"
                  :class="dayToToggle?.isOpen ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                >
                  {{ dayToToggle?.isOpen ? 'unavailable' : 'available' }}
                </span>?
                {{ dayToToggle?.isOpen ? 'Customers will not be able to book on this day.' : 'Customers will be able to book on this day.' }}
              </p>
              
              <div class="flex justify-center space-x-4">
                <button 
                  @click="showToggleDayConfirmation = false"
                  class="px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button 
                  @click="toggleDay"
                  class="px-5 py-2.5 text-white rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                  :class="dayToToggle?.isOpen 
                    ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                    : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Update Confirmation -->
      <Transition name="modal">
        <div 
          v-if="showUpdateConfirmation" 
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          @click.self="showUpdateConfirmation = false"
        >
          <div 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300"
            :class="{ 'scale-100 opacity-100': showUpdateConfirmation, 'scale-95 opacity-0': !showUpdateConfirmation }"
          >
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 mb-5">
                <Save class="h-8 w-8" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Update Availability</h3>
              <p class="text-gray-500 dark:text-gray-400 mb-8">
                Are you sure you want to update your availability schedule? This will save all your changes.
              </p>
              
              <div class="flex justify-center space-x-4">
                <button 
                  @click="showUpdateConfirmation = false"
                  class="px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button 
                  @click="updateWorkingHours"
                  class="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
  
      <!-- Success Toast -->
      <Transition name="toast">
        <div 
          v-if="showSuccessToast" 
          class="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 transform transition-all duration-500"
          :class="{ 'translate-y-0 opacity-100': showSuccessToast, 'translate-y-8 opacity-0': !showSuccessToast }"
        >
          <CheckCircle class="h-5 w-5 mr-2" />
          <span>{{ successMessage }}</span>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { 
    Clock, 
    X,
    AlertTriangle,
    CheckCircle,
    Save,
    Info
  } from 'lucide-vue-next'
  
  // Types
  interface WorkingHour {
    name: string
    openingTime: string
    closingTime: string
    isOpen: boolean
    isUpdating?: boolean
    isFocused?: 'opening' | 'closing' | null
  }
  
  // Working Hours Data
  const workingHours = ref<WorkingHour[]>([
    { name: 'Monday', openingTime: '09:00', closingTime: '17:00', isOpen: true },
    { name: 'Tuesday', openingTime: '09:00', closingTime: '17:00', isOpen: true },
    { name: 'Wednesday', openingTime: '09:00', closingTime: '17:00', isOpen: true },
    { name: 'Thursday', openingTime: '09:00', closingTime: '17:00', isOpen: true },
    { name: 'Friday', openingTime: '09:00', closingTime: '17:00', isOpen: true },
    { name: 'Saturday', openingTime: '10:00', closingTime: '15:00', isOpen: false },
    { name: 'Sunday', openingTime: '10:00', closingTime: '15:00', isOpen: false }
  ])
  
  // Backup for discard functionality
  const originalWorkingHours = JSON.parse(JSON.stringify(workingHours.value))
  
  // Computed properties for summary
  const availableDays = computed(() => {
    return workingHours.value.filter(day => day.isOpen)
  })
  
  const unavailableDays = computed(() => {
    return workingHours.value.filter(day => !day.isOpen)
  })
  
  const totalHours = computed(() => {
    let total = 0
    
    for (const day of workingHours.value) {
      if (day.isOpen) {
        const openTime = new Date(`2000-01-01T${day.openingTime}:00`)
        const closeTime = new Date(`2000-01-01T${day.closingTime}:00`)
        
        // If closing time is before opening time, assume it's the next day
        let diff = closeTime.getTime() - openTime.getTime()
        if (diff < 0) {
          diff += 24 * 60 * 60 * 1000 // Add 24 hours
        }
        
        // Convert milliseconds to hours
        total += diff / (1000 * 60 * 60)
      }
    }
    
    return total.toFixed(1)
  })
  
  // Modal states
  const showDiscardConfirmation = ref(false)
  const showToggleDayConfirmation = ref(false)
  const showUpdateConfirmation = ref(false)
  const showSuccessToast = ref(false)
  const successMessage = ref('')
  const dayToToggle = ref<WorkingHour | null>(null)
  
  // Functions
  const confirmUpdate = () => {
    showUpdateConfirmation.value = true
  }
  
  const updateWorkingHours = () => {
    // In a real app, you would send this data to your API
    originalWorkingHours = JSON.parse(JSON.stringify(workingHours.value))
    showUpdateConfirmation.value = false
    
    // Add animation effect to show update
    workingHours.value.forEach(day => {
      day.isUpdating = true
      setTimeout(() => {
        day.isUpdating = false
      }, 1000)
    })
    
    showToast('Availability schedule updated successfully')
  }
  
  const discardChanges = () => {
    workingHours.value = JSON.parse(JSON.stringify(originalWorkingHours))
    showDiscardConfirmation.value = false
    showToast('Changes discarded')
  }
  
  const confirmToggleDay = (day: WorkingHour) => {
    dayToToggle.value = day
    showToggleDayConfirmation.value = true
  }
  
  const toggleDay = () => {
    if (dayToToggle.value) {
      const day = workingHours.value.find(d => d.name === dayToToggle.value?.name)
      if (day) {
        day.isOpen = !day.isOpen
        day.isUpdating = true
        setTimeout(() => {
          if (day) day.isUpdating = false
        }, 1000)
      }
    }
    showToggleDayConfirmation.value = false
    showToast(`${dayToToggle.value?.name} is now ${dayToToggle.value?.isOpen ? 'unavailable' : 'available'}`)
  }
  
  const showToast = (message: string) => {
    successMessage.value = message
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  }
  
  // Initialize on component mount
  onMounted(() => {
    // Any initialization code if needed
  })

  definePageMeta({
      layout: 'dashboard'
  })
  </script>
  
  <style>
  /* Add animations and transitions */
  .animate-pulse-once {
    animation: pulse 1s ease-in-out;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
      background-color: rgba(249, 115, 22, 0.1);
    }
  }
  
  /* Modal transitions */
  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  
  /* Toast transitions */
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.5s ease;
  }
  
  .toast-enter-from,
  .toast-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  
  /* Ensure smooth transitions for all interactive elements */
  button, a, input, select {
    transition: all 0.2s ease;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
  
  /* Dark mode scrollbar */
  .dark ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .dark ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .dark ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  </style>