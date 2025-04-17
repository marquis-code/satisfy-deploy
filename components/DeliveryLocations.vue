<!-- components/DeliveryLocations.vue -->
<template>
  <div class="delivery-container">
    <h1 class="text-xl font-semibold text-gray-800 mb-6">Delivery Locations</h1>
    
    <transition name="fade" mode="out-in">
      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="loader"></div>
        <p class="text-gray-600 mt-4">Loading delivery information...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 animate-appear">
        <p class="flex items-center">
          <span class="mr-2">⚠️</span>
          <span>{{ error }}</span>
        </p>
        <button 
          @click="fetchLocations"
          class="mt-2 text-sm text-red-600 hover:text-red-800 underline transition-colors"
        >
          Try Again
        </button>
      </div>
      
      <!-- Main content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Pack Fee and Limit Section -->
        <div class="bg-white rounded-md shadow p-4 md:p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 class="text-lg font-medium text-gray-700 mb-2">Pack Fee and Limit</h2>
          <p class="text-gray-600 text-sm mb-6">
            Set limits to the amount of pack that can be ordered at a time. Max(15)
          </p>
          
          <div class="mb-4 group">
            <label for="packPrice" class="block text-gray-600 mb-2 transition-all group-focus-within:text-orange-500">Pack Price</label>
            <input 
              id="packPrice"
              v-model.number="tempPackSettings.price"
              type="number"
              class="w-full border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none transition-all"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          
          <div class="mb-6 group">
            <label for="packLimit" class="block text-gray-600 mb-2 transition-all group-focus-within:text-orange-500">Pack Limit</label>
            <input 
              id="packLimit"
              v-model.number="tempPackSettings.limit"
              type="number"
              class="w-full border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none transition-all"
              placeholder="10"
              min="1"
              max="15"
            />
          </div>
          
          <button 
            @click="updatePackSettings"
            class="w-full bg-[#ee7749] hover:bg-[#e06538] text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            :disabled="isUpdatingSettings"
          >
            <span v-if="isUpdatingSettings" class="inline-block mr-2">
              <div class="spinner-sm"></div>
            </span>
            <span>{{ isUpdatingSettings ? 'Updating...' : 'Update Settings' }}</span>
          </button>
        </div>
        
        <!-- Delivery Prices Section -->
        <div class="bg-white rounded-md shadow p-4 md:p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 class="text-lg font-medium text-gray-700 mb-4">Delivery Prices</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div class="md:col-span-3 group">
              <label for="locationName" class="block outline-none text-gray-600 text-sm mb-2 transition-all group-focus-within:text-orange-500">Location Name</label>
              <input 
                id="locationName"
                v-model="newLocation.name"
                type="text"
                class="w-full border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none transition-all"
                placeholder="e.g Harmony Estate"
              />
            </div>
            
            <div class="md:col-span-1 group">
              <label for="deliveryPrice" class="block outline-none text-gray-600 text-sm mb-2 transition-all group-focus-within:text-orange-500">Price</label>
              <input 
                id="deliveryPrice"
                v-model.number="newLocation.price"
                type="number"
                class="w-full border border-gray-300 rounded-md p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none transition-all"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          
          <button 
            @click="addLocation"
            class="mb-6 bg-[#ee7749] hover:bg-[#e06538] text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
            :disabled="isAddingLocation || !canAddLocation"
            :class="{ 'opacity-70 cursor-not-allowed': !canAddLocation && !isAddingLocation }"
          >
            <span v-if="isAddingLocation" class="inline-block">
              <div class="spinner-sm"></div>
            </span>
            <span v-else class="text-lg">+</span>
            <span>{{ isAddingLocation ? 'Adding...' : 'Add Location' }}</span>
          </button>
          
          <!-- Locations Table -->
          <div class="overflow-x-auto">
            <transition-group name="list" tag="table" class="w-full min-w-full">
              <thead key="header" class="border-b border-gray-200">
                <tr>
                  <th class="text-left py-3 px-2 text-sm text-gray-600">Location Name</th>
                  <th class="text-left py-3 px-2 text-sm text-gray-600">Price</th>
                  <th class="text-right py-3 px-2 text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody key="body">
                <tr 
                  v-for="(location, index) in locations" 
                  :key="location.id || index"
                  class="border-b text-sm even:bg-gray-50 border-gray-200 transition-all hover:bg-orange-50"
                >
                  <td class="py-3 px-2">
                    <input 
                      v-if="editingIndex === index"
                      v-model="editingLocation.name"
                      class="border border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none rounded-md p-2 w-full transition-all"
                    />
                    <span v-else>{{ location.name }}</span>
                  </td>
                  <td class="py-3 px-2">
                    <input 
                      v-if="editingIndex === index"
                      v-model.number="editingLocation.deliveryFee"
                      type="number"
                      step="0.01"
                      min="0"
                      class="border border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none rounded-md p-2 w-full transition-all"
                    />
                    <span v-else class="font-medium">₦{{ location?.deliveryFee?.toFixed(2) }}</span>
                  </td>
                  <td class="py-3 px-2 flex justify-end gap-1">
                    <template v-if="editingIndex === index">
                      <button 
                        @click="saveEdit"
                        class="p-2 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
                        :disabled="isUpdatingLocation"
                      >
                        <span v-if="isUpdatingLocation">
                          <div class="spinner-xs"></div>
                        </span>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M224.82,59.34l-28.16-28.16a16,16,0,0,0-22.64,0L55.34,150.82A15.52,15.52,0,0,0,51.2,161.6L40.6,214.54a8,8,0,0,0,7.55,9.79,7.54,7.54,0,0,0,2.24-.32l52.94-10.6a16,16,0,0,0,10.78-4.14L224.82,82A16,16,0,0,0,224.82,59.34ZM156.6,24.2a8,8,0,0,1,11.32,0L196.08,52.36a8,8,0,0,1,0,11.32L184,75.76,132.24,24,144.32,11.88A8,8,0,0,1,156.6,24.2ZM107.11,202a8.08,8.08,0,0,1-5.37,2.08,7.93,7.93,0,0,1-1.58-.16L58.8,195.2l8.71-41.36a7.93,7.93,0,0,1,2.11-5.12L173.37,45,213,84.63Z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="cancelEdit"
                        class="p-2 text-red-600 cursor-pointer hover:text-red-800 transition-colors rounded-full hover:bg-red-50"
                        :disabled="isUpdatingLocation"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                        </svg>
                      </button>
                    </template>
                    <template v-else>
                      <button 
                        @click="startEdit(index)"
                        class="p-2 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z"></path>
                        </svg>
                      </button>
                      
                      <button 
                        @click="confirmLocation(index)"
                        class="p-2 transition-colors rounded-full hover:bg-green-50"
                        :class="{ 'text-gray-400 cursor-not-allowed': location.confirmed, 'text-green-600 cursor-pointer hover:text-green-800': !location.confirmed }"
                        :disabled="location.confirmed || isConfirming === index"
                      >
                        <span v-if="isConfirming === index">
                          <div class="spinner-xs"></div>
                        </span>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </button>
                      
                      <button 
                        @click="removeLocation(index)"
                        class="p-2 text-red-600 hover:text-red-800 transition-colors rounded-full hover:bg-red-50"
                        :disabled="isDeleting === index"
                      >
                        <span v-if="isDeleting === index">
                          <div class="spinner-xs"></div>
                        </span>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                        </svg>
                      </button>
                    </template>
                  </td>
                </tr>
              </tbody>
            </transition-group>
            
            <!-- Empty state -->
            <div 
              v-if="locations.length === 0" 
              class="py-12 text-center text-gray-500 animate-appear border-dashed border-2 border-gray-200 rounded-md mt-4"
            >
              <div class="flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#9ca3af" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H168v40a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8V136H40a8,8,0,0,1,0-16H88V80a8,8,0,0,1,8-8h64a8,8,0,0,1,8,8v40h48A8,8,0,0,1,224,128ZM168,88H96v56h72Z"></path>
                </svg>
                <p class="mt-4">No locations added yet.</p>
                <p class="text-sm mt-2">Add your first delivery location above.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useCreateDeliveryLocation } from '@/composables/modules/delivery/useCreateDeliveryLocation'
import { useUpdateDeliveryLocation } from '@/composables/modules/delivery/useUpdateDeliveryLocation'
import { useDeleteDeliveryLocation } from '@/composables/modules/delivery/useDeleteDeliveryLocation'
import { useFetchLoggedInDeliveryLocations } from '@/composables/modules/delivery/useFetchLoggedInDeliveryLocations'
import type { DeliveryLocation } from '~/types'

// States
const locations = ref<DeliveryLocation[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const isAddingLocation = ref(false)
const isUpdatingLocation = ref(false)
const isUpdatingSettings = ref(false)
const isConfirming = ref<number | null>(null)
const isDeleting = ref<number | null>(null)

// Composables
const { createDeliveryLocation, loading: createLoading } = useCreateDeliveryLocation()
const { updateDeliveryLocation, loading: updateLoading } = useUpdateDeliveryLocation()
const { deleteDeliveryLocation, loading: deleteLoading } = useDeleteDeliveryLocation()
const { fetchLoggedInDeliveryLocations, loading: fetchLoading } = useFetchLoggedInDeliveryLocations()

// Pack settings
const packSettings = ref({
  price: 0,
  limit: 10
})

// Temporary form state for pack settings
const tempPackSettings = reactive({
  price: 0,
  limit: 10
})

// New location form
const newLocation = reactive<DeliveryLocation>({
  name: '',
  price: 0,
  confirmed: false
})

// Editing state
const editingIndex = ref<number | null>(null)
const editingLocation = reactive<DeliveryLocation>({ 
  name: '', 
  deliveryFee: 0,
  confirmed: false 
})

// Validate new location form
const canAddLocation = computed(() => {
  return newLocation.name.trim() !== '' && newLocation.price >= 0
})

// Fetch locations on component mount
onMounted(() => {
  fetchLocations()
})

// Methods
const fetchLocations = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await fetchLoggedInDeliveryLocations()
    locations.value = result.data || []
    // Assume pack settings are also returned or fetch them separately
    if (result.packSettings) {
      packSettings.value = result.packSettings
      tempPackSettings.price = result.packSettings.price
      tempPackSettings.limit = result.packSettings.limit
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load delivery locations'
  } finally {
    loading.value = false
  }
}

const updatePackSettings = async () => {
  if (isUpdatingSettings.value) return
  
  isUpdatingSettings.value = true
  try {
    await updateDeliveryLocation({
      id: 'pack-settings', // Assuming an ID or endpoint for pack settings
      deliveryFee: tempPackSettings.deliveryFee,
      limit: tempPackSettings.limit
    })
    
    // Update local state on success
    packSettings.value = { ...tempPackSettings }
    
    // Show success notification - could use a toast system
    showNotification('Pack settings updated successfully!', 'success')
  } catch (err) {
    showNotification('Failed to update pack settings', 'error')
    console.error(err)
  } finally {
    isUpdatingSettings.value = false
  }
}

const addLocation = async () => {
  if (isAddingLocation.value || !canAddLocation.value) return
  
  isAddingLocation.value = true
  try {
    const result = await createDeliveryLocation({
      name: newLocation.name.trim(),
      deliveryFee: newLocation.price,
      // confirmed: false
    })

    console.log(result, 'res')
    
    // Add the new location to our array
    if (result.data) {
      locations.value.push(result.data)
    }
    
    // Reset form on success
    resetLocationForm()
    showNotification('Location added successfully!', 'success')
  } catch (err) {
    showNotification('Failed to add location', 'error')
    console.error(err)
  } finally {
    isAddingLocation.value = false
  }
}

const startEdit = (index: number) => {
  editingIndex.value = index
  const location = locations.value[index]
  editingLocation.name = location.name
  editingLocation.deliveryFee = location.deliveryFee
  editingLocation.confirmed = location.confirmed
}

const saveEdit = async () => {
  if (isUpdatingLocation.value || editingIndex.value === null) return
  
  isUpdatingLocation.value = true
  try {
    const index = editingIndex.value
    const location = locations.value[index]
    
    const result = await updateDeliveryLocation(location._id, {
      // id: location.id,
      name: editingLocation.name.trim(),
      deliveryFee: editingLocation.deliveryFee,
      // confirmed: location.confirmed
    })
    
    // Update local state
    if (result.data) {
      locations.value[index] = result.data
    } else {
      locations.value[index] = {
        ...location,
        name: editingLocation.name.trim(),
        deliveryFee: editingLocation.deliveryFee
      }
    }
    
    // Reset editing state
    editingIndex.value = null
    showNotification('Location updated successfully!', 'success')
  } catch (err) {
    showNotification('Failed to update location', 'error')
    console.error(err)
  } finally {
    isUpdatingLocation.value = false
  }
}

const cancelEdit = () => {
  editingIndex.value = null
}

const confirmLocation = async (index: number) => {
  const location = locations.value[index]
  if (location.confirmed) return
  
  isConfirming.value = index
  try {
    const result = await updateDeliveryLocation({
      id: location.id,
      name: location.name,
      price: location.price,
      confirmed: true
    })
    
    // Update local state
    if (result.data) {
      locations.value[index] = result.data
    } else {
      locations.value[index] = {
        ...location,
        confirmed: true
      }
    }
    
    showNotification('Location confirmed successfully!', 'success')
  } catch (err) {
    showNotification('Failed to confirm location', 'error')
    console.error(err)
  } finally {
    isConfirming.value = null
  }
}

const removeLocation = async (index: number) => {
  const location = locations.value[index]
  
  isDeleting.value = index
  try {
    await deleteDeliveryLocation(location._id)
    
    // Remove from local state
    locations.value.splice(index, 1)
    showNotification('Location deleted successfully!', 'success')
  } catch (err) {
    showNotification('Failed to delete location', 'error')
    console.error(err)
  } finally {
    isDeleting.value = null
  }
}

// Reset form after successful operation
const resetLocationForm = () => {
  newLocation.name = ''
  newLocation.price = 0
}

// Simple notification function (could be replaced with a proper toast system)
const showNotification = (message: string, type: 'success' | 'error') => {
  // Implementation depends on your UI notification system
  console.log(`[${type}] ${message}`)
}
</script>

<style scoped>
/* Loaders */
.loader {
  border: 3px solid rgba(238, 119, 73, 0.1);
  border-radius: 50%;
  border-top: 3px solid #ee7749;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.spinner-sm {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid #ffffff;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

.spinner-xs {
  border: 2px solid rgba(238, 119, 73, 0.1);
  border-radius: 50%;
  border-top: 2px solid #ee7749;
  width: 12px;
  height: 12px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.list-enter-active, .list-leave-active {
  transition: all 0.3s;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.animate-appear {
  animation: appear 0.5s ease-out;
}

@keyframes appear {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>