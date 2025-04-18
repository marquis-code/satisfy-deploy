<template>
  <div class="min-h-screen bg-gray-50 pb-10">
    <div class="container mx-auto px-4 py-6">
      <!-- Header with back button -->
      <div class="flex items-center mb-6">
        <button
          @click="goBack"
          class="px-3 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-md transition-all duration-300 mr-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Checkout</h1>
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <!-- Order Details Section -->
        <div class="w-full md:w-2/3">
          <div class="bg-white rounded-md shadow-md p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <ShoppingBagIcon class="h-5 w-5 mr-2 text-orange-500" />
                Order Details
              </h2>
              <span
                class="text-sm bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium animate-pulse"
                v-if="cart?.totalItems.value > 0"
              >
                {{ cart?.totalItems.value }} items
              </span>
            </div>

            <div
              v-if="cart.loading.value"
              class="flex justify-center items-center py-8"
            >
              <div
                class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"
              ></div>
            </div>

            <div
              v-else-if="cart.totalItems.value === 0"
              class="text-center py-8"
            >
              <ShoppingCartIcon
                class="h-12 w-12 mx-auto text-gray-300 mb-3 animate-bounce-slow"
              />
              <p class="text-gray-500 mb-4">Your cart is empty</p>
              <button
                @click="goBack"
                class="px-4 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-md transition-colors transform hover:scale-105"
              >
                Go back to menu
              </button>
            </div>

            <div
              v-else
              class="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
            >
              <div
                v-for="(pack, packIndex) in cart.packs.value"
                :key="pack.id"
                class="border border-gray-100 rounded-md p-4 hover:border-orange-200 transition-colors"
                :class="{ 'animate-fade-in': true }"
                :style="{ animationDelay: `${packIndex * 0.1}s` }"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3
                    class="text-lg font-semibold text-gray-800 flex items-center"
                  >
                    <span
                      :class="
                        pack.items.length > 0 ? 'bg-orange-500' : 'bg-gray-300'
                      "
                      class="w-2 h-2 rounded-full mr-2"
                    ></span>
                    Pack {{ packIndex + 1 }}
                  </h3>
                  <span class="text-sm text-gray-500"
                    >{{ pack.items.length }} items</span
                  >
                </div>

                <div
                  v-for="(item, itemIndex) in pack.items"
                  :key="`${pack.id}-${itemIndex}`"
                  class="flex items-center justify-between mb-4 hover:bg-gray-50 p-2 rounded-md transition-colors animate-slide-in"
                  :style="{
                    animationDelay: `${packIndex * 0.1 + itemIndex * 0.05}s`,
                  }"
                >
                  <div class="flex items-center">
                    <div
                      class="w-16 h-16 rounded-md overflow-hidden bg-gray-100"
                    >
                      <img
                        src="@/assets/img/meal1.jpg"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="ml-4">
                      <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                      <p class="text-sm text-gray-600">
                        ₦{{ formatPrice(item.price) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center">
                    <div
                      class="flex items-center bg-gray-100 rounded-md overflow-hidden"
                    >
                      <button
                        @click="decrementItemQuantity(packIndex, itemIndex)"
                        class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <MinusIcon class="h-4 w-4" />
                      </button>
                      <div class="w-10 text-center">
                        {{ item.quantity }}
                      </div>
                      <button
                        @click="incrementItemQuantity(packIndex, itemIndex)"
                        class="w-8 h-8 flex items-center justify-center bg-orange-400 text-white hover:bg-orange-500 transition-colors"
                      >
                        <PlusIcon class="h-4 w-4" />
                      </button>
                    </div>

                    <div class="ml-4 text-right">
                      <p class="font-medium text-gray-800">
                        ₦{{ formatPrice(item.price * item.quantity) }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-if="pack.note"
                  class="mt-2 text-sm italic text-gray-600 bg-gray-50 p-3 rounded-md"
                >
                  <span class="font-medium">Note:</span> {{ pack.note }}
                </div>

                <button
                  @click="openPackNoteModal(packIndex)"
                  class="mt-3 text-xs text-blue-500 hover:text-blue-700 transition-colors flex items-center transform hover:translate-x-1"
                >
                  <PencilIcon class="h-3 w-3 mr-1" />
                  {{ pack.note ? "Edit" : "Add" }} note
                </button>
              </div>
            </div>
          </div>

          <!-- Order Summary for Mobile -->
          <div
            class="md:hidden mt-6 bg-white rounded-md shadow-md p-6 border border-gray-100"
          >
            <h3 class="font-semibold text-gray-800 mb-3">Order Summary</h3>

            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium"
                  >₦{{ formatPrice(cart.subtotal.value) }}</span
                >
              </div>
              <div class="flex justify-between text-sm" v-if="deliveryMethod === 'delivery'">
                <span class="text-gray-600">Delivery</span>
                <span class="font-medium">₦{{ formatPrice(deliveryFee) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Service Charge</span>
                <span class="font-medium"
                  >₦{{ formatPrice(serviceCharge) }}</span
                >
              </div>
              <div
                class="flex justify-between mt-4 pt-4 border-t border-gray-200"
              >
                <span class="text-lg font-semibold">Grand Total</span>
                <span class="text-lg font-bold text-orange-600"
                  >₦{{ formatPrice(calculateGrandTotal()) }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Details Section -->
        <div class="w-full md:w-1/3">
          <div
            class="bg-white rounded-md shadow-md p-6 sticky top-4 border border-gray-100"
          >
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <TruckIcon class="h-5 text-sm w-5 mr-2 text-orange-500" />
              Delivery Details
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Customer Name <span class="text-red-500">*</span></label
                >
                <input
                  v-model="customerName"
                  type="text"
                  class="w-full text-sm px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Name"
                />
                <p
                  v-if="validationErrors.customerName"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ validationErrors.customerName}}
                </p>
              </div>

              <div>
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Phone Number <span class="text-red-500">*</span></label
                >
                <input
                  v-model="phoneNumber"
                  type="tel"
                  class="w-full text-sm px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Phone Number"
                />
                <p
                  v-if="validationErrors.phoneNumber"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ validationErrors.phoneNumber }}
                </p>
              </div>

              <!-- Delivery Method Selection -->
              <div class="mb-2">
                <label class="block text-gray-600 mb-2 text-sm font-medium"
                  >Delivery Method <span class="text-red-500">*</span></label
                >
                <div class="grid grid-cols-2 gap-3">
                  <div
                    @click="setDeliveryMethod('pickup')"
                    class="border rounded-md p-3 cursor-pointer transition-all duration-300 flex flex-col items-center transform hover:scale-105"
                    :class="[
                      deliveryMethod === 'pickup' 
                        ? 'border-green-400 bg-green-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <div class="relative">
                      <ShoppingBagIcon
                        class="h-6 w-6 mb-1 transition-colors duration-300"
                        :class="
                          deliveryMethod === 'pickup'
                            ? 'text-green-500'
                            : 'text-gray-400'
                        "
                      />
                      <div 
                        v-if="deliveryMethod === 'pickup'"
                        class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping-slow"
                      ></div>
                    </div>
                    <span
                      class="text-sm font-medium transition-colors duration-300"
                      :class="
                        deliveryMethod === 'pickup'
                          ? 'text-green-800'
                          : 'text-gray-600'
                      "
                      >Pickup</span
                    >
                    <span class="text-xs text-green-600 mt-1 font-medium">Free</span>
                  </div>

                  <div
                    @click="setDeliveryMethod('delivery')"
                    class="border rounded-md p-3 cursor-pointer transition-all duration-300 flex flex-col items-center transform hover:scale-105"
                    :class="[
                      deliveryMethod === 'delivery' 
                        ? 'border-orange-400 bg-orange-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <div class="relative">
                      <TruckIcon
                        class="h-6 w-6 mb-1 transition-colors duration-300"
                        :class="
                          deliveryMethod === 'delivery'
                            ? 'text-orange-500'
                            : 'text-gray-400'
                        "
                      />
                      <div 
                        v-if="deliveryMethod === 'delivery'"
                        class="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping-slow"
                      ></div>
                    </div>
                    <span
                      class="text-sm font-medium transition-colors duration-300"
                      :class="
                        deliveryMethod === 'delivery'
                          ? 'text-orange-800'
                          : 'text-gray-600'
                      "
                      >Delivery</span
                    >
                    <span class="text-xs text-orange-600 mt-1 font-medium">
                      <template v-if="selectedLocation">
                        ₦{{ formatPrice(selectedLocation.deliveryFee) }}
                      </template>
                      <template v-else>
                        Select location
                      </template>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Location Dropdown - Only shown for delivery -->
              <div v-if="deliveryMethod === 'delivery'" class="mt-4 animate-fade-in">
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Location <span class="text-red-500">*</span></label
                >
                
                <div class="relative location-dropdown">
                  <select 
                    v-if="vendorDeliveryLocations.length"  
                    class="w-full text-sm px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none"
                    v-model="selectedLocationId"
                    @change="handleLocationChange"
                  >
                    <option value="" disabled selected>Select a location</option>
                    <option 
                      v-for="item in vendorDeliveryLocations" 
                      :key="item._id" 
                      :value="item._id"
                    >
                      {{item.name}} - ₦{{ formatPrice(item.deliveryFee) }}
                    </option>
                  </select>
                  <ChevronDownIcon
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                  />
                </div>

                <div v-if="vendorDeliveryLocations.length === 0" class="p-4 text-center text-gray-500 border border-gray-200 rounded-md mt-2">
                  <MapPinOffIcon class="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p>This vendor hasn't set up delivery locations yet.</p>
                  <p class="text-xs mt-1">Please choose pickup or contact the vendor.</p>
                </div>
                
                <p
                  v-if="validationErrors.location"
                  class="mt-1 text-xs text-red-500 animate-shake"
                >
                  {{ validationErrors.location }}
                </p>
              </div>        

              <!-- Delivery Address - Only shown for delivery -->
              <div v-if="deliveryMethod === 'delivery'" class="animate-fade-in">
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Delivery Address <span class="text-red-500">*</span></label
                >
                <textarea
                  v-model="deliveryAddress"
                  rows="3"
                  class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="A proper description of your address"
                ></textarea>
                <p
                  v-if="validationErrors.deliveryAddress"
                  class="mt-1 text-xs text-red-500 animate-shake"
                >
                  {{ validationErrors.deliveryAddress }}
                </p>
              </div>

              <div>
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Additional Notes</label
                >
                <textarea
                  v-model="additionalNotes"
                  rows="2"
                  class="w-full text-sm px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Any additional instructions..."
                ></textarea>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="mt-8 border-t border-gray-200 pt-4 hidden md:block">
              <h3 class="font-semibold text-gray-800 mb-3">Order Summary</h3>

              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-medium"
                    >₦{{ formatPrice(cart.subtotal.value) }}</span
                  >
                </div>
                <div class="flex justify-between text-sm" v-if="deliveryMethod === 'delivery'">
                  <span class="text-gray-600">Delivery</span>
                  <span class="font-medium animate-highlight" key="delivery-fee">
                    ₦{{ formatPrice(deliveryFee) }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Service Charge</span>
                  <span class="font-medium"
                    >₦{{ formatPrice(serviceCharge) }}</span
                  >
                </div>
                <div
                  class="flex justify-between mt-4 pt-4 border-t border-gray-200"
                >
                  <span class="text-lg font-semibold">Grand Total</span>
                  <span
                    class="text-lg font-bold text-orange-600 animate-pulse-slow"
                    >₦{{ formatPrice(calculateGrandTotal()) }}</span
                  >
                </div>
              </div>
            </div>

            <div class="mt-6">
              <div class="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="save-order"
                  v-model="saveOrder"
                  class="h-4 w-4 text-orange-600 focus:ring-orange-500"
                />
                <label for="save-order" class="ml-2 text-gray-600 text-sm"
                  >Save this order combination for future orders.</label
                >
              </div>

              <div class="flex gap-3">
                <button
                  @click="cancelOrder"
                  class="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-all duration-300 flex items-center justify-center transform hover:scale-98"
                >
                  <XCircleIcon class="h-5 w-5 mr-1" />
                  Cancel Order
                </button>
                <button
                  @click="submitOrder"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                  :disabled="!isFormValid || orderLoading"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      !isFormValid || orderLoading,
                  }"
                >
                  <span v-if="orderLoading" class="flex items-center">
                    <span
                      class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                    ></span>
                    Processing...
                  </span>
                  <template v-else>
                    <CheckIcon class="h-5 w-5 mr-1" />
                    Place Order
                  </template>
                </button>
              </div>

              <div
                v-if="error"
                class="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm animate-shake"
              >
                <AlertTriangleIcon class="h-4 w-4 inline-block mr-1" />
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pack Note Modal -->
    <Teleport to="body">
      <div
        v-if="showPackNoteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        @click="closePackNoteModal"
      >
        <div
          class="bg-white rounded-md shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ClipboardEditIcon class="h-5 w-5 mr-2 text-blue-500" />
              Add Note to Pack
            </h2>

            <div class="mb-6">
              <label class="block text-gray-700 mb-2 font-medium"
                >Special Instructions:</label
              >
              <textarea
                v-model="packNote"
                rows="3"
                placeholder="E.g., Make it spicy, serve hot, etc."
                class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="closePackNoteModal"
                class="px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="savePackNote"
                class="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Order Success Modal -->
    <Teleport to="body">
      <div
        v-if="showOrderSuccessModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-md shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6 text-center">
            <div
              class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-success-pop"
            >
              <CheckIcon class="h-10 w-10 text-green-500" />
            </div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">
              Order Placed Successfully!
            </h2>
            <p class="text-gray-600 mb-6">
              Your order has been placed successfully. You will receive a
              confirmation shortly.
            </p>

            <div class="flex flex-col gap-3">
              <button
                @click="chatWithVendor"
                class="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat with Vendor
              </button>
              <button
                @click="goToHome"
                class="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCart } from "~/composables/useCart";
import { useToast } from "~/composables/useToast";
import { useVendorDeliveryLocations } from "@/composables/modules/delivery/useVendorDeliveryLocations";
import { useCreateOrder } from "@/composables/modules/order/useCreateOrder";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  PlusIcon,
  MinusIcon,
  XCircleIcon,
  CheckIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
  PencilIcon,
  ClipboardEditIcon,
  AlertTriangleIcon,
  MapPinIcon,
  MapPinOffIcon,
} from "lucide-vue-next";
import ToastContainer from "~/components/ToastContainer.vue";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useFetchVendorById } from "@/composables/modules/vendor/useFetchVendorById";

// Composables
const { showToast } = useCustomToast();
const router = useRouter();
const route = useRoute();
const cart = useCart();
const toast = useToast();
const { createOrder, loading: orderLoading, error, orderResponse } = useCreateOrder();
const { vendor } = useFetchVendorById(route.params.id as string);
const { fetchVendorDeliveryLocations, loading: fetchingDeliveryLocations, vendorDeliveryLocations } = useVendorDeliveryLocations();

// State
const phoneNumber = ref("");
const customerName = ref("");
const deliveryAddress = ref("");
const deliveryMethod = ref("pickup"); // Default to pickup
const additionalNotes = ref("");
const saveOrder = ref(false);
const showPackNoteModal = ref(false);
const showOrderSuccessModal = ref(false);
const packNoteIndex = ref(0);
const packNote = ref("");
const isLocationDropdownOpen = ref(false);
const selectedLocationId = ref("");
const selectedLocation = ref(null);
const validationErrors = ref({
  phoneNumber: "",
  customerName: "",
  location: "",
  deliveryAddress: "",
});
const orderSuccess = ref(false);
const orderIds = ref<string[]>([]);

// Constants
const serviceCharge = 50;
const deliveryFee = computed(() => {
  if (deliveryMethod.value !== "delivery") return 0;
  return selectedLocation.value ? selectedLocation.value.deliveryFee : 0;
});

// Computed
const isFormValid = computed(() => {
  if (deliveryMethod.value === 'pickup') {
    return (
      phoneNumber.value.trim() !== "" && 
      customerName.value.trim() !== "" && 
      cart.totalItems.value > 0
    );
  } else {
    return (
      phoneNumber.value.trim() !== "" && 
      customerName.value.trim() !== "" &&
      selectedLocation.value !== null &&
      deliveryAddress.value.trim() !== "" &&
      cart.totalItems.value > 0
    );
  }
});

// Methods
const formatPrice = (price: number): string => {
  return price.toLocaleString();
};

const calculateGrandTotal = (): number => {
  return cart.subtotal.value + deliveryFee.value + serviceCharge;
};

const incrementItemQuantity = (packIndex: number, itemIndex: number) => {
  cart.incrementItemQuantity(packIndex, itemIndex);
};

const decrementItemQuantity = (packIndex: number, itemIndex: number) => {
  cart.decrementItemQuantity(packIndex, itemIndex);
};

const openPackNoteModal = (index: number) => {
  packNoteIndex.value = index;
  packNote.value = cart.packs.value[index].note;
  showPackNoteModal.value = true;
};

const closePackNoteModal = () => {
  showPackNoteModal.value = false;
};

const savePackNote = () => {
  const success = cart.updatePackNote(packNoteIndex.value, packNote.value);
  if (success) {
    showToast({
      title: "Success",
      message: "Note saved successfully",
      toastType: "success",
      duration: 3000,
    });
    closePackNoteModal();
  }
};

const setDeliveryMethod = (method: 'pickup' | 'delivery') => {
  deliveryMethod.value = method;
  
  // Reset validation errors when switching methods
  if (method === 'pickup') {
    validationErrors.value.location = "";
    validationErrors.value.deliveryAddress = "";
    selectedLocation.value = null;
    selectedLocationId.value = "";
  }
  
  // Show a toast notification
  showToast({
    title: method === 'pickup' ? "Pickup Selected" : "Delivery Selected",
    message: method === 'pickup' 
      ? "You'll pick up your order at the restaurant" 
      : "Your order will be delivered to your location",
    toastType: "info",
    duration: 2000,
  });
};

const handleLocationChange = () => {
  // Find the full location object based on the selected ID
  selectedLocation.value = vendorDeliveryLocations.value.find(
    location => location._id === selectedLocationId.value
  );
  
  if (selectedLocation.value) {
    // Clear location validation error if a location is selected
    validationErrors.value.location = "";
    
    // Show toast with the selected location and fee
    showToast({
      title: "Delivery Location Selected",
      message: `Delivery to ${selectedLocation.value.name} costs ₦${formatPrice(selectedLocation.value.deliveryFee)}`,
      toastType: "success",
      duration: 3000,
    });
  }
};

const goBack = () => {
  router.push(`/${route.params.id}`);
};

const goToHome = () => {
  showOrderSuccessModal.value = false;
  router.push(`/${route.params.id}`);
};

const cancelOrder = () => {
  if (confirm("Are you sure you want to cancel your order?")) {
    cart.clearCart();
    router.push(`/${route.params.id}`);
    showToast({
      title: "Order Cancelled",
      message: "Your order has been cancelled",
      toastType: "info",
      duration: 3000,
    });
  }
};

const validateForm = () => {
  let isValid = true;
  validationErrors.value = {
    phoneNumber: "",
    customerName: "",
    location: "",
    deliveryAddress: "",
  };

  if (!phoneNumber.value.trim()) {
    validationErrors.value.phoneNumber = "Phone number is required";
    isValid = false;
  } else if (!/^\+?[0-9]{10,15}$/.test(phoneNumber.value.trim())) {
    validationErrors.value.phoneNumber = "Please enter a valid phone number";
    isValid = false;
  }

  if (!customerName.value.trim()) {
    validationErrors.value.customerName = "Customer name is required";
    isValid = false;
  }

  if (deliveryMethod.value === "delivery") {
    if (!selectedLocation.value) {
      validationErrors.value.location = "Please select a delivery location";
      isValid = false;
    }

    if (!deliveryAddress.value.trim()) {
      validationErrors.value.deliveryAddress = "Delivery address is required";
      isValid = false;
    }
  }

  return isValid;
};

const submitOrder = async () => {
  if (!validateForm()) {
    showToast({
      title: "Warning",
      message: "Please fill in all required fields correctly",
      toastType: "warning",
      duration: 3000,
    });
    return;
  }

  if (cart.totalItems.value === 0) {
    showToast({
      title: "Warning",
      message: "Your cart is empty",
      toastType: "warning",
      duration: 3000,
    });
    return;
  }

  try {
    // Create a single order with all packs
    const orderData = {
      vendorId: vendor.value._id,
      customerName: customerName.value,
      phoneNumber: phoneNumber.value,
      deliveryType: deliveryMethod.value as "delivery" | "pickup",
      location: deliveryMethod.value === "delivery" && selectedLocation.value ? selectedLocation.value.name : "",
      address: deliveryMethod.value === "delivery" ? deliveryAddress.value : "",
      // Transform cart packs to match the new structure
      packs: cart.packs.value
        .filter(pack => pack.items.length > 0)
        .map(pack => ({
          items: pack.items.map(item => ({
            menuItemId: item.mealId,
            quantity: item.quantity
          })),
          // Add pack quantity if it exists, otherwise it defaults to 1
          ...(pack.quantity && pack.quantity > 1 ? { quantity: pack.quantity } : {})
        })),
      // Add general notes if provided
      notes: additionalNotes.value.trim()
    };

    // Add pack-specific notes if needed
    const packsWithNotes = cart.packs.value.filter(pack => pack.items.length > 0 && pack.note);
    if (packsWithNotes.length > 0) {
      const packNotes = packsWithNotes.map(pack => pack.note).join('. ');
      orderData.notes = orderData.notes
        ? `${orderData.notes}. ${packNotes}`
        : packNotes;
    }

    console.log(orderData, 'Order payload');
    
    // Submit the order
    const response = await createOrder(orderData);
    if (response && response._id) {
      orderIds.value = [response._id];
    }

    // Show success message with animation
    showOrderSuccessModal.value = true;

    // If save order is checked, we would save it to the user's profile
    if (saveOrder.value) {
      console.log("Saving order for future use");
    }
  } catch (err) {
    console.error("Error submitting order:", err);
    showToast({
      title: "Error",
      message: "Failed to submit order. Please try again.",
      toastType: "error",
      duration: 3000,
    });
  }
};

const chatWithVendor = () => {
  // Get vendor details from local storage
  let vendorData = null;
  try {
    const vendorString = localStorage.getItem("selected-vendor");
    if (vendorString) {
      vendorData = JSON.parse(vendorString);
    }
  } catch (error) {
    console.error("Error retrieving vendor data:", error);
  }

  // If no vendor data or phone number, use a fallback approach
  const vendorPhone = vendorData?.phoneNumber || "";
  const vendorName = vendorData?.restaurantName || "Vendor";
  
  // Create an exciting and user-friendly message
  let message = `🎉 *NEW ORDER FOR ${vendorName.toUpperCase()}!* 🎉\n\n`;
  
  // Add a friendly greeting
  message += `Hi there! You've got a delicious new order from ${customerName.value}! 😋\n\n`;
  
  // Add order details with emojis and formatting
  message += `📋 *ORDER DETAILS* (${cart.totalItems.value} items) 📋\n\n`;

  message += `📌 Order ID: ${orderResponse?.value?.orderId || 'Pending'}\n`;
  
  // Add items from each pack with friendly formatting
  let packCounter = 0;
  cart.packs.value.forEach((pack, packIndex) => {
    if (pack.items.length > 0) {
      packCounter++;
      message += `🍱 *PACK ${packCounter}* (${pack.items.length} ${pack.items.length === 1 ? 'item' : 'items'}) 🍱\n\n`;
      
      // Add each item in the pack with exciting format
      pack.items.forEach(item => {
        message += `🔸 *${item.name}*\n`;
        message += `   ₦${formatPrice(item.price)} × ${item.quantity} = ₦${formatPrice(item.price * item.quantity)}\n\n`;
      });
      
      // Add pack note if exists
      if (pack.note) {
        message += `📝 *Special Request:* ${pack.note}\n\n`;
      }
    }
  });
  
  // Add order summary section with eye-catching format
  message += `💰 *ORDER SUMMARY* 💰\n\n`;
  message += `📌 Subtotal: ₦${formatPrice(cart.subtotal.value)}\n`;
  message += `📌 Service Charge: ₦${formatPrice(serviceCharge)}\n`;
  
  if (deliveryMethod.value === 'delivery' && selectedLocation.value) {
    message += `📌 Delivery Fee (${selectedLocation.value.name}): ₦${formatPrice(selectedLocation.value.deliveryFee)}\n`;
  } else {
    message += `📌 Pickup: Free\n`;
  }
  
  message += `🔥 *GRAND TOTAL: ₦${formatPrice(calculateGrandTotal())}* 🔥\n\n`;
  
  // Add customer details section with friendly format
  message += `👤 *CUSTOMER DETAILS* 👤\n\n`;
  message += `🙋 Name: ${customerName.value}\n`;
  message += `📞 Phone: ${phoneNumber.value}\n`;
  
  if (deliveryMethod.value === 'delivery' && selectedLocation.value) {
    message += `📍 Location: ${selectedLocation.value.name}\n`;
    message += `🏠 Delivery Address: ${deliveryAddress.value}\n`;
  }
  
  message += `🚚 Delivery Method: ${deliveryMethod.value === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}\n\n`;
  
  // Add additional notes if provided
  if (additionalNotes.value) {
    message += `📝 *Additional Notes:* ${additionalNotes.value}\n\n`;
  }
  
  // Add a friendly closing message
  message += `⏰ Order placed at: ${new Date().toLocaleTimeString()}\n\n`;
  message += `Thank you for your prompt attention! We're excited to receive this delicious order! 🙏\n`;
  
  // Encode the message for WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  
  // Format the phone number correctly for WhatsApp
  let formattedPhone = "";
  if (vendorPhone) {
    // Remove any non-digit characters
    formattedPhone = vendorPhone.replace(/\D/g, "");
    
    // Ensure it starts with country code (if not already)
    if (!formattedPhone.startsWith("234") && formattedPhone.startsWith("0")) {
      // Replace leading 0 with 234 (Nigeria's country code)
      formattedPhone = "234" + formattedPhone.substring(1);
    }
  }
  
  // Open WhatsApp with the message and vendor's phone number
  const whatsappUrl = formattedPhone 
    ? `https://wa.me/${formattedPhone}?text=${encodedMessage}` 
    : `https://wa.me/?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');

  // Clear cart after successful order
  cart.clearCart();
  
  // Close the success modal
  showOrderSuccessModal.value = false;
  
  // Navigate back to menu
  router.push(`/${route.params.id}`);
};

// Watch for delivery method changes to reset validation errors
watch(deliveryMethod, () => {
  if (deliveryMethod.value === "pickup") {
    validationErrors.value.location = "";
    validationErrors.value.deliveryAddress = "";
    selectedLocation.value = null;
    selectedLocationId.value = "";
  }
});

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (isLocationDropdownOpen.value) {
      const target = e.target as HTMLElement;
      if (!target.closest('.location-dropdown')) {
        isLocationDropdownOpen.value = false;
      }
    }
  });
  
  // Initialize cart from localStorage
  cart.initCart();

  // Redirect to home if no order exists
  if (cart.totalItems.value === 0) {
    router.push(`/${route.params.id}`);
    showToast({
      title: "Warning",
      message: "Your cart is empty",
      toastType: "warning",
      duration: 3000,
    });
  }
  
  // Fetch vendor delivery locations
  if (vendor.value && vendor.value._id) {
    fetchVendorDeliveryLocations(vendor.value._id);
  }
});

// Watch for vendor changes to fetch delivery locations
watch(
  () => vendor.value,
  async (newVendor) => {
    if (newVendor && newVendor._id) {
      await fetchVendorDeliveryLocations(newVendor._id);
    }
  }
);
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce-slow {
  animation: bounceSlow 2s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulseSlow 2s ease-in-out infinite;
}

.animate-success-pop {
  animation: successPop 0.5s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.4s ease-out;
}

.animate-dropdown {
  animation: dropdown 0.3s ease-out;
}

.animate-ping-slow {
  animation: pingSlow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-highlight {
  animation: highlight 1s ease-in-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounceSlow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulseSlow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes successPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pingSlow {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

@keyframes highlight {
  0% { background-color: transparent; }
  30% { background-color: rgba(249, 115, 22, 0.2); }
  100% { background-color: transparent; }
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.transform.hover\:scale-98:hover {
  transform: scale(0.98);
}
</style>
