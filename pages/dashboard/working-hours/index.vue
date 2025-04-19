<template>
  <div class="min-h-screen">
    <div class="container mx-auto">
      <!-- Working Hours Section -->
      <div class="bg-white dark:bg-gray-800 rounded-md shadow-xl p-8 mb-8 transform transition-all duration-500 hover:shadow-2xl">
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
                :class="[
                  day.isOpen ? 'bg-green-500' : 'bg-red-500',
                  day.isUpdating ? 'opacity-70' : ''
                ]"
                @click="toggleDayAvailability(day)"
              >
                <div v-if="day.isUpdating" class="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-20">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
                <Clock v-else-if="day.isOpen" class="h-6 w-6 text-white" />
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
                    :disabled="!day.isOpen || day.isUpdating || day.isUpdatingTime === 'opening'"
                    class="w-full border rounded-lg py-3 px-4 pr-10 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    :class="day.isOpen 
                      ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white' 
                      : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'"
                    @focus="day.isFocused = 'opening'"
                    @blur="day.isFocused = null"
                  />
                  <div v-if="day.isUpdatingTime === 'opening'" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                  </div>
                  <Clock 
                    v-else
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
                    :disabled="!day.isOpen || day.isUpdating || day.isUpdatingTime === 'closing'"
                    class="w-full border rounded-lg py-3 px-4 pr-10 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    :class="day.isOpen 
                      ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white' 
                      : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'"
                    @focus="day.isFocused = 'closing'"
                    @blur="day.isFocused = null"
                  />
                  <div v-if="day.isUpdatingTime === 'closing'" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                  </div>
                  <Clock 
                    v-else
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
      </div>

      <!-- Availability Summary Card -->
      <div class="bg-white dark:bg-gray-800 rounded-md shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
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

  <!-- Success Toast -->
  <Teleport to="body">
    <Transition name="toast">
      <div 
        v-if="showSuccessToast" 
        class="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 transform transition-all duration-500"
      >
        <CheckCircle class="h-5 w-5 mr-2" />
        <span>{{ successMessage }}</span>
      </div>
    </Transition>

    <!-- Error Toast -->
    <Transition name="toast">
      <div 
        v-if="showErrorToast" 
        class="fixed bottom-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 transform transition-all duration-500"
      >
        <AlertTriangle class="h-5 w-5 mr-2" />
        <span>{{ errorMessage }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUpdateWorkingHours } from "@/composables/modules/vendor/useUpdateWorkngHours"
import { 
  Clock, 
  X,
  AlertTriangle,
  CheckCircle,
  Save,
  Info
} from 'lucide-vue-next'

const { updateWorkingHours, loading: globalLoading } = useUpdateWorkingHours()

// Types
interface WorkingHour {
  name: string
  openingTime: string
  closingTime: string
  isOpen: boolean
  isUpdating?: boolean
  isUpdatingTime?: 'opening' | 'closing' | null
  isFocused?: 'opening' | 'closing' | null
  // Add these properties to track the previous values for comparison
  prevOpeningTime?: string
  prevClosingTime?: string
}

// Working Hours Data
const workingHours = ref<WorkingHour[]>([
  { name: 'Monday', openingTime: '09:00', closingTime: '17:00', isOpen: true, prevOpeningTime: '09:00', prevClosingTime: '17:00' },
  { name: 'Tuesday', openingTime: '09:00', closingTime: '17:00', isOpen: true, prevOpeningTime: '09:00', prevClosingTime: '17:00' },
  { name: 'Wednesday', openingTime: '09:00', closingTime: '17:00', isOpen: true, prevOpeningTime: '09:00', prevClosingTime: '17:00' },
  { name: 'Thursday', openingTime: '09:00', closingTime: '17:00', isOpen: true, prevOpeningTime: '09:00', prevClosingTime: '17:00' },
  { name: 'Friday', openingTime: '09:00', closingTime: '17:00', isOpen: true, prevOpeningTime: '09:00', prevClosingTime: '17:00' },
  { name: 'Saturday', openingTime: '10:00', closingTime: '15:00', isOpen: false, prevOpeningTime: '10:00', prevClosingTime: '15:00' },
  { name: 'Sunday', openingTime: '10:00', closingTime: '15:00', isOpen: false, prevOpeningTime: '10:00', prevClosingTime: '15:00' }
])

// Toast state
const showSuccessToast = ref(false)
const successMessage = ref('')
const showErrorToast = ref(false)
const errorMessage = ref('')

// Time update debounce
const updateDebounceTimers = ref<Record<string, NodeJS.Timeout>>({})

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

// Watch for changes in opening and closing times
workingHours.value.forEach((day, index) => {
  // Watch opening time changes
  watch(
    () => workingHours.value[index].openingTime,
    (newTime, oldTime) => {
      if (newTime !== oldTime && day.isOpen) {
        // Store previous value
        day.prevOpeningTime = oldTime
        
        // Clear any existing debounce timer for this day's opening time
        const timerKey = `${day.name}-opening`
        if (updateDebounceTimers.value[timerKey]) {
          clearTimeout(updateDebounceTimers.value[timerKey])
        }
        
        // Set loading state immediately
        day.isUpdatingTime = 'opening'
        
        // Debounce the update to prevent too many API calls while user is still typing/changing
        updateDebounceTimers.value[timerKey] = setTimeout(() => {
          updateDayHours(day, 'opening')
        }, 500) // 500ms debounce
      }
    }
  )
  
  // Watch closing time changes
  watch(
    () => workingHours.value[index].closingTime,
    (newTime, oldTime) => {
      if (newTime !== oldTime && day.isOpen) {
        // Store previous value
        day.prevClosingTime = oldTime
        
        // Clear any existing debounce timer for this day's closing time
        const timerKey = `${day.name}-closing`
        if (updateDebounceTimers.value[timerKey]) {
          clearTimeout(updateDebounceTimers.value[timerKey])
        }
        
        // Set loading state immediately
        day.isUpdatingTime = 'closing'
        
        // Debounce the update to prevent too many API calls while user is still typing/changing
        updateDebounceTimers.value[timerKey] = setTimeout(() => {
          updateDayHours(day, 'closing')
        }, 500) // 500ms debounce
      }
    }
  )
})

// Update functions
async function toggleDayAvailability(day: WorkingHour) {
  // Don't allow toggling if already updating
  if (day.isUpdating || day.isUpdatingTime) return

  try {
    // Set loading state
    day.isUpdating = true
    
    // Toggle the state locally first (optimistic UI update)
    const newIsOpen = !day.isOpen
    day.isOpen = newIsOpen
    
    // Prepare the payload for the API
    const payload = {
      day: day.name,
      openingTime: day.openingTime,
      closingTime: day.closingTime,
      isActive: newIsOpen
    }
    
    // Call the backend API
    await updateWorkingHours(payload)
    
    // Show success message
    showToast(`${day.name} is now ${newIsOpen ? 'available' : 'unavailable'}`)
  } catch (error) {
    // Revert the optimistic update on error
    day.isOpen = !day.isOpen
    
    // Show error message
    showErrorToast(`Failed to update ${day.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    // Clear loading state
    day.isUpdating = false
  }
}

async function updateDayHours(day: WorkingHour, timeField?: 'opening' | 'closing') {
  // If timeField is provided, use it; otherwise try to determine from day.isUpdatingTime
  const fieldBeingUpdated = timeField || day.isUpdatingTime
  if (!fieldBeingUpdated) return
  
  try {
    // Prepare the payload for the API
    const payload = {
      day: day.name,
      openingTime: day.openingTime,
      closingTime: day.closingTime,
      isActive: day.isOpen
    }
    
    // Call the backend API
    await updateWorkingHours(payload)
    
    // Update the previous values to match current values after successful update
    if (fieldBeingUpdated === 'opening') {
      day.prevOpeningTime = day.openingTime
    } else {
      day.prevClosingTime = day.closingTime
    }
    
    // Show success message
    showToast(`Updated ${day.name} ${fieldBeingUpdated === 'opening' ? 'opening' : 'closing'} time`)
  } catch (error) {
    // Revert to previous value on error
    if (fieldBeingUpdated === 'opening' && day.prevOpeningTime) {
      day.openingTime = day.prevOpeningTime
    } else if (fieldBeingUpdated === 'closing' && day.prevClosingTime) {
      day.closingTime = day.prevClosingTime
    }
    
    // Show error message
    showErrorToast(`Failed to update ${day.name} hours: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    // Clear loading state
    day.isUpdatingTime = null
  }
}

// Toast functions
function showToast(message: string) {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

// function showErrorToast(message: string) {
//   errorMessage.value = message
//   showErrorToast.value = true
//   setTimeout(() => {
//     showErrorToast.value = false
//   }, 4000)
// }

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