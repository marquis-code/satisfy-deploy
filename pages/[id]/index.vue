<template>
  <div class="min-h-screen">
    <!-- Hero Banner with Restaurant Info -->
    <div class="relative">
      <div
        class="w-full h-40 md:h-64 bg-gradient-to-r from-red-800 to-red-600 overflow-hidden"
      >
        <img
          src="@/assets/img/meal.jpg"
          alt="Nigerian Food"
          class="w-full h-screen object-cover opacity-60 mix-blend-multiply"
        />
      </div>

      <!-- Restaurant Logo -->
      <div class="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <h1
          class="text-5xl md:text-7xl font-bold text-yellow-300 font-cursive logo-text drop-shadow-lg animate-float"
        >
          {{ vendor?.restaurantName ?? "Nil" }}
        </h1>
      </div>

      <!-- Restaurant Info Card -->
      <div class="card-container">
        <div
          class="relative mx-4 md:-mt-16 bg-gradient-to-r from-orange-100 to-yellow-50 rounded-md shadow-xl p-6 z-10 border border-orange-200 restaurant-card"
        >
          <!-- Decorative elements -->
          <div
            class="absolute -top-2 -right-2 w-20 h-20 bg-orange-400 rounded-full opacity-10 animate-pulse"
          ></div>
          <div
            class="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-10 animate-pulse delay-300"
          ></div>

          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div class="restaurant-info">
              <h1
                class="text-2xl md:text-3xl font-bold text-gray-800 restaurant-name"
              >
                {{ vendor?.restaurantName ?? "Nil" }}
              </h1>
              <div class="flex items-center mt-1">
                <p class="text-gray-600 location">
                  {{ vendor?.locationName ?? "Nil" }}
                </p>
                <div class="flex ml-2 stars-container">
                  <div v-for="i in 5" :key="i" class="star-wrapper">
                    <StarIcon class="h-4 w-4 text-yellow-500 star-icon" />
                  </div>
                </div>
              </div>
            </div>

            <button
              class="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 flex items-center review-button"
              @click="showReviewModal = true"
            >
              <StarIcon class="h-4 w-4 mr-1 animate-spin-slow" />
              <span class="relative">
                Leave A Review
                <span
                  class="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"
                ></span>
              </span>
            </button>
          </div>

          <div class="mt-4 flex items-center category-badge">
            <span
              class="px-2 py-1 bg-orange-200 text-orange-700 rounded-lg text-xs font-medium"
            >
              {{ vendor?.category ?? "Restaurant" }}
            </span>
          </div>

          <p class="mt-3 text-gray-700 italic quote-text">
            "Am proud of you, Dr Ben." -
            <span class="font-medium">{{ vendor?.phoneNumber ?? "Nil" }}</span>
          </p>

          <div
            class="mt-4 pt-3 border-t border-orange-200 flex justify-between items-center footer"
          >
            <div class="flex items-center">
              <div
                class="w-3 h-3 rounded-full"
                :class="vendor?.isStoreOpen ? 'bg-green-500' : 'bg-red-500'"
              ></div>
              <span
                class="ml-2 text-sm"
                :class="vendor?.isStoreOpen ? 'text-green-600' : 'text-red-600'"
              >
                {{ vendor?.isStoreOpen ? "Open Now" : "Closed" }}
              </span>
            </div>
            <div class="text-sm text-gray-500">
              {{ formatDate(vendor?.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 md:py-12">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Menu List Section -->
        <div class="w-full lg:w-2/3">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Menu List</h2>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search menu..."
                class="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <SearchIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              />
            </div>
          </div>

          <div
            v-if="fetchingMenu"
            class="flex justify-center items-center py-12"
          >
            <div
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"
            ></div>
          </div>

          <div
            v-else-if="filteredMeals.length === 0"
            class="bg-white rounded-md shadow-md p-8 text-center"
          >
            <SearchXIcon class="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p class="text-gray-600">No meals found matching your search.</p>
            <button
              @click="searchQuery = ''"
              class="mt-4 px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors"
            >
              Clear Search
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(meal, index) in filteredMeals"
              :key="meal._id"
              class="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              :class="{ 'animate-fade-in': true }"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <div class="flex h-full">
                <div class="w-1/3 overflow-hidden">
                  <img
                    :src="meal.image"
                    :alt="meal.name"
                    class="w-full h-full rounded-l-xl object-cover"
                  />
                </div>
                <div class="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 class="font-semibold text-gray-800 text-lg">
                      {{ meal.name }}
                    </h3>
                    <p class="text-sm font-semibold text-green-600 mt-1">
                      ₦{{ formatPrice(meal.price) }}
                    </p>
                  </div>
                  
                  <!-- Quantity Controls -->
                  <div class="self-end mt-2 flex items-center">
                    <template v-if="getMealQuantityInActivePack(meal._id) > 0">
                      <button
                        @click="decrementMealInActivePack(meal)"
                        class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-l-md flex items-center justify-center transition-colors"
                      >
                        <MinusIcon class="h-4 w-4" />
                      </button>
                      <span class="w-8 text-center text-sm bg-gray-100 py-1.5">
                        {{ getMealQuantityInActivePack(meal._id) }}
                      </span>
                      <button
                        @click="incrementMealInActivePack(meal)"
                        class="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-r-md flex items-center justify-center transition-colors"
                      >
                        <PlusIcon class="h-4 w-4" />
                      </button>
                    </template>
                    <button
                      v-else
                      @click="addMealToActivePack(meal)"
                      class="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md flex items-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                      <PlusIcon class="h-4 w-4 mr-1" />
                      Add to Pack
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Section -->
        <div class="w-full lg:w-1/3">
          <div
            class="bg-white rounded-md shadow-md p-3 sticky top-4 border border-gray-100"
          >
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-base font-bold text-gray-800 flex items-center">
                <ShoppingBagIcon class="h-5 w-5 mr-2 text-orange-500" />
                Your Orders
                <span
                  v-if="cart.totalItems.value > 0"
                  class="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-full animate-pulse"
                >
                  {{ cart.totalItems.value }}
                </span>
              </h2>
              <div class="flex space-x-2">
                <button
                  @click="addNewPack"
                  class="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm flex items-center transition-all duration-300 transform hover:scale-105"
                  :class="{ 'relative': true }"
                  :disabled="cart.packs.value.length >= packLimit"
                  :title="cart.packs.value.length >= packLimit ? `Maximum ${packLimit} packs allowed` : 'Add a new pack'"
                >
                  <PlusIcon class="h-4 w-4 mr-1" /> Add Pack
                  <span v-if="isNewPackActive" class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                </button>
                <button
                  @click="openDuplicatePackModal"
                  class="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-md text-sm flex items-center transition-all duration-300 transform hover:scale-105"
                  :class="{ 'relative': true }"
                  :disabled="cart.packs.value.length >= packLimit"
                  :title="cart.packs.value.length >= packLimit ? `Maximum ${packLimit} packs allowed` : 'Duplicate a pack'"
                >
                  <CopyIcon class="h-4 w-4 mr-1" /> Duplicate
                  <span v-if="isDuplicatedPackActive" class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                </button>
              </div>
            </div>

            <!-- Pack Limit Warning -->
            <div v-if="cart.packs.value.length >= packLimit" class="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-start">
              <AlertCircleIcon class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>This vendor has a limit of {{ packLimit }} packs per order.</span>
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
              <p class="text-sm text-gray-400">
                Add items from the menu to get started
              </p>
            </div>

            <div
              v-else
              class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
            >
              <div
                v-for="(pack, index) in cart.packs.value"
                :key="pack.id"
                class="border rounded-md p-3 transition-colors animate-fade-in"
                :class="[
                  index === activePackIndex ? 'border-orange-300 bg-orange-50' : 'border-gray-100',
                  { 'hover:border-orange-200': true }
                ]"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <div
                      :class="
                        pack.items.length > 0 ? 'bg-orange-500' : 'bg-gray-300'
                      "
                      class="w-2 h-2 rounded-full mr-2"
                    ></div>
                    <h3 class="font-medium text-gray-800 flex items-center">
                      Pack {{ index + 1 }}
                      <span class="text-gray-500 text-sm ml-1"
                        >( {{ pack.items.length }} items )</span
                      >
                      <span 
                        v-if="index === activePackIndex" 
                        class="ml-2 text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full"
                      >
                        Active
                      </span>
                    </h3>
                  </div>
                  <div class="flex space-x-1">
                    <button
                      @click="setActivePackIndex(index)"
                      class="text-xs px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-md transition-colors transform hover:scale-105"
                      v-if="index !== activePackIndex"
                    >
                      <CheckIcon class="h-3 w-3 inline-block" /> Select
                    </button>
                    <button
                      v-if="cart.packs.value.length > 1"
                      @click="removePack(index)"
                      class="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors transform hover:scale-105"
                    >
                      <TrashIcon class="h-3 w-3 inline-block" /> Remove
                    </button>
                  </div>
                </div>

                <div v-if="pack.items.length > 0" class="mt-3 space-y-3">
                  <div
                    v-for="(item, itemIndex) in pack.items"
                    :key="`${pack.id}-${itemIndex}`"
                    class="flex justify-between items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-all duration-300"
                  >
                    <div class="flex items-center rounded-lg">
                      <div
                        class="w-8 h-8 rounded-md overflow-hidden bg-gray-200"
                      >
                        <img
                          :src="item.image"
                          :alt="item.name"
                          class="w-full rounded-md h-full object-cover"
                        />
                      </div>
                      <div class="ml-2">
                        <p class="text-sm font-medium text-gray-800">
                          {{ item.name }}
                        </p>
                        <p class="text-xs text-gray-500">
                          ₦{{ formatPrice(item.price) }} × {{ item.quantity }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <button
                        @click="decrementItemQuantity(index, itemIndex)"
                        class="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-l-md flex items-center justify-center transition-colors"
                      >
                        <MinusIcon class="h-3 w-3" />
                      </button>
                      <span class="w-8 text-center text-sm">{{
                        item.quantity
                      }}</span>
                      <button
                        @click="incrementItemQuantity(index, itemIndex)"
                        class="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-r-md flex items-center justify-center transition-colors"
                      >
                        <PlusIcon class="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div
                    v-if="pack.note"
                    class="text-xs italic text-gray-500 bg-gray-50 p-2 rounded-md"
                  >
                    <span class="font-medium">Note:</span> {{ pack.note }}
                  </div>

                  <button
                    @click="openPackNoteModal(index)"
                    class="text-xs text-blue-500 hover:text-blue-700 transition-colors flex items-center transform hover:translate-x-1"
                  >
                    <PencilIcon class="h-3 w-3 mr-1" />
                    {{ pack.note ? "Edit" : "Add" }} note
                  </button>
                </div>

                <div v-else class="mt-3 text-center py-3 bg-gray-50 rounded-md">
                  <p class="text-sm text-gray-400">This pack is empty</p>
                </div>
              </div>
            </div>

            <div class="mt-6 border-t border-gray-100 pt-4">
              <div v-if="cart.totalItems.value > 0" class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Subtotal:</span>
                  <span class="font-medium"
                    >₦{{ formatPrice(cart.subtotal.value) }}</span
                  >
                </div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Pack Fee (₦{{ packFee }} × {{ cart.packs.value.length }}):</span>
                  <span class="font-medium">₦{{ formatPrice(packFee * cart.packs.value.length) }}</span>
                </div>
                <div class="flex justify-between text-sm font-bold text-gray-800 mt-2 pt-2 border-t border-dashed border-gray-200">
                  <span>Total:</span>
                  <span>₦{{ formatPrice(calculateTotal()) }}</span>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  @click="confirmEmptyCart"
                  class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-all duration-300 flex items-center justify-center transform hover:scale-98"
                  :disabled="cart.totalItems.value === 0"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      cart.totalItems.value === 0,
                  }"
                >
                  <TrashIcon class="h-4 w-4 mr-2" />
                  Empty Cart
                </button>
                <button
                  @click="proceedToCheckout"
                  :disabled="cart.totalItems.value === 0"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      cart.totalItems.value === 0,
                    'hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5':
                      cart.totalItems.value > 0,
                  }"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-md shadow-md transition-all duration-300 flex items-center justify-center"
                >
                  <ShoppingCartIcon class="h-4 w-4 mr-2" />
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Duplicate Pack Modal -->
    <Teleport to="body">
      <div
        v-if="showDuplicatePackModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        @click="closeDuplicatePackModal"
      >
        <div
          class="bg-white rounded-md shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <CopyIcon class="h-5 w-5 mr-2 text-green-500" />
              Duplicate Pack
            </h2>

            <div class="mb-6">
              <label class="block text-gray-700 mb-2 font-medium"
                >Select Pack to Duplicate:</label
              >
              <div class="relative">
                <select
                  v-model="packToDuplicateIndex"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                >
                  <option
                    v-for="(pack, index) in cart.packs.value"
                    :key="pack.id"
                    :value="index"
                  >
                    Pack {{ index + 1 }} ({{ pack.items.length }} items)
                  </option>
                </select>
                <ChevronDownIcon
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div v-if="cart.packs.value.length >= packLimit" class="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-start">
              <AlertCircleIcon class="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p class="font-medium mb-1">Pack limit reached</p>
                <p>This vendor has a maximum limit of {{ packLimit }} packs per order. Please remove a pack before duplicating.</p>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="closeDuplicatePackModal"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="duplicateSelectedPack"
                class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                :disabled="cart.packs.value.length >= packLimit"
                :class="{'opacity-50 cursor-not-allowed': cart.packs.value.length >= packLimit}"
              >
                Duplicate Pack
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

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
              <ClipboardEditIcon class="h-5 text-sm w-5 mr-2 text-blue-500" />
              Add Note to Pack
            </h2>

            <div class="mb-6">
              <label class="block text-gray-700 text-sm mb-2 font-medium"
                >Special Instructions:</label
              >
              <textarea
                v-model="packNote"
                rows="3"
                placeholder="E.g., Make it spicy, serve hot, etc."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="closePackNoteModal"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="savePackNote"
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Review Modal -->
    <Teleport to="body">
      <div
        v-if="showReviewModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        @click="closeReviewModal"
      >
        <div
          class="bg-white rounded-md shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <StarIcon class="h-5 w-5 mr-2 text-yellow-500" />
              Leave a Review
            </h2>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2 font-medium"
                >Rating:</label
              >
              <div class="flex space-x-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="reviewRating = star"
                  class="focus:outline-none transform hover:scale-110 transition-transform"
                >
                  <StarIcon
                    class="h-8 w-8"
                    :class="
                      star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'
                    "
                  />
                </button>
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-gray-700 mb-2 font-medium"
                >Your Review:</label
              >
              <textarea
                v-model="reviewText"
                rows="4"
                placeholder="Share your experience..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="closeReviewModal"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="submitReview"
                class="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Confirm Empty Cart Modal -->
    <Teleport to="body">
      <div
        v-if="showConfirmEmptyCartModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        @click="showConfirmEmptyCartModal = false"
      >
        <div
          class="bg-white rounded-md shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-2">
              Empty Your Cart?
            </h2>
            <p class="text-gray-600 mb-6">
              Are you sure you want to remove all items from your cart? This
              action cannot be undone.
            </p>

            <div class="flex justify-end gap-3">
              <button
                @click="showConfirmEmptyCartModal = false"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="emptyCart"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-300"
              >
                Empty Cart
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
import { useFetchVendor } from "@/composables/modules/vendor/useFetchVendor"
import { useFetchVendorById } from "@/composables/modules/vendor/useFetchVendorById";
import { useFetchVendorMenu } from "@/composables/modules/menu/useFetchVendorMenu";
import {
  PlusIcon,
  MinusIcon,
  XIcon,
  StarIcon,
  CopyIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TrashIcon,
  SearchIcon,
  SearchXIcon,
  ChevronDownIcon,
  PencilIcon,
  ClipboardEditIcon,
  MessageCircleIcon,
  AlertCircleIcon,
  CheckIcon,
} from "lucide-vue-next";
import { useCustomToast } from "@/composables/core/useCustomToast";

const route = useRoute();

// Types
interface Meal {
  _id: string;
  name: string;
  image: string;
  price: number;
  categoryId: string;
  isEnabled: boolean;
  vendorId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Router
const router = useRouter();

// Composables
const cart = useCart();
const { menus, loading: fetchingMenu, fetchVendorMenu } = useFetchVendorMenu();
const { showToast } = useCustomToast();
const { vendor, loading, error } = useFetchVendorById(route.params.id as string);
const { vendor: vendorObj } = useFetchVendor();

// State
const searchQuery = ref("");
const activePackIndex = ref(0);
const isNewPackActive = ref(false);
const isDuplicatedPackActive = ref(false);
const packFee = ref(0); // Will be set from vendor object
const packLimit = ref(0); // Will be set from vendor object

// Computed properties for filtered meals
const filteredMeals = computed(() => {
  if (!menus.value || menus.value.length === 0) return [];

  if (!searchQuery.value)
    return menus.value.filter((meal) => !meal.isDeleted && meal.isEnabled);

  const query = searchQuery.value.toLowerCase();
  return menus.value.filter(
    (meal) =>
      !meal.isDeleted &&
      meal.isEnabled &&
      meal.name.toLowerCase().includes(query)
  );
});

// Modal states
const showDuplicatePackModal = ref(false);
const showPackNoteModal = ref(false);
const showReviewModal = ref(false);
const showConfirmEmptyCartModal = ref(false);

// Form states
const selectedMeal = ref<Meal | null>(null);
const selectedPackIndex = ref(0);
const packToDuplicateIndex = ref(0);
const quantity = ref(1);
const packNoteIndex = ref(0);
const packNote = ref("");
const reviewRating = ref(5);
const reviewText = ref("");

// Methods
const formatPrice = (price: number): string => {
  return price.toLocaleString();
};

// Calculate total including pack fees (removed service charge)
const calculateTotal = (): number => {
  const subtotal = cart.subtotal.value;
  const packFees = packFee.value * cart.packs.value.length;
  
  return subtotal + packFees;
};

// Set active pack index
const setActivePackIndex = (index: number): void => {
  activePackIndex.value = index;
  isNewPackActive.value = false;
  isDuplicatedPackActive.value = false;
  
  showToast({
    title: "Pack Selected",
    message: `Pack ${index + 1} is now active`,
    toastType: "success",
    duration: 2000,
  });
};

// New methods for handling meal quantities in the active pack
const getMealQuantityInActivePack = (mealId: string): number => {
  // Ensure there's at least one pack
  if (cart.packs.value.length === 0) {
    return 0;
  }
  
  // Find the meal in the active pack
  const activePack = cart.packs.value[activePackIndex.value];
  const mealItem = activePack.items.find(item => item.mealId === mealId);
  
  return mealItem ? mealItem.quantity : 0;
};

const addMealToActivePack = (meal: Meal): void => {
  // Ensure there's at least one pack
  if (cart.packs.value.length === 0) {
    cart.addNewPack();
    activePackIndex.value = 0;
  }
  
  // Add to the active pack
  const success = cart.addItemToPack(
    activePackIndex.value,
    {
      mealId: meal._id,
      name: meal.name,
      price: meal.price,
      image: meal.image,
    },
    1 // Default quantity is 1
  );

  if (success) {
    showToast({
      title: "Success",
      message: `Added ${meal.name} to Pack ${activePackIndex.value + 1}`,
      toastType: "success",
      duration: 3000,
    });
  } else {
    showToast({
      title: "Error",
      message: "Failed to add item to pack",
      toastType: "error",
      duration: 3000,
    });
  }
};

const incrementMealInActivePack = (meal: Meal): void => {
  // Find the meal in the active pack
  if (cart.packs.value.length === 0) {
    addMealToActivePack(meal);
    return;
  }
  
  const activePack = cart.packs.value[activePackIndex.value];
  const itemIndex = activePack.items.findIndex(item => item.mealId === meal._id);
  
  if (itemIndex !== -1) {
    cart.incrementItemQuantity(activePackIndex.value, itemIndex);
  } else {
    addMealToActivePack(meal);
  }
};

const decrementMealInActivePack = (meal: Meal): void => {
  // Find the meal in the active pack
  if (cart.packs.value.length === 0) {
    return;
  }
  
  const activePack = cart.packs.value[activePackIndex.value];
  const itemIndex = activePack.items.findIndex(item => item.mealId === meal._id);
  
  if (itemIndex !== -1) {
    cart.decrementItemQuantity(activePackIndex.value, itemIndex);
  }
};

const openDuplicatePackModal = () => {
  if (cart.packs.value.length === 0) {
    showToast({
      title: "Warning",
      message: "No packs to duplicate",
      toastType: "warning",
      duration: 3000,
    });
    return;
  }
  
  // Check if we've reached the pack limit
  if (cart.packs.value.length >= packLimit.value) {
    showToast({
      title: "Pack Limit Reached",
      message: `This vendor has a maximum limit of ${packLimit.value} packs per order`,
      toastType: "warning",
      duration: 3000,
    });
    showDuplicatePackModal.value = true;
    return;
  }
  
  if (cart.packs.value.length === 1) {
    // If there's only one pack, duplicate it directly
    duplicatePack(0);
    return;
  }

  packToDuplicateIndex.value = activePackIndex.value; // Default to active pack
  showDuplicatePackModal.value = true;
};

const closeDuplicatePackModal = () => {
  showDuplicatePackModal.value = false;
};

const duplicateSelectedPack = () => {
  // Check if we've reached the pack limit
  if (cart.packs.value.length >= packLimit.value) {
    showToast({
      title: "Pack Limit Reached",
      message: `This vendor has a maximum limit of ${packLimit.value} packs per order`,
      toastType: "warning",
      duration: 3000,
    });
    return;
  }
  
  duplicatePack(packToDuplicateIndex.value);
  closeDuplicatePackModal();
};

const addNewPack = () => {
  // Check if we've reached the pack limit
  if (cart.packs.value.length >= packLimit.value) {
    showToast({
      title: "Pack Limit Reached",
      message: `This vendor has a maximum limit of ${packLimit.value} packs per order`,
      toastType: "warning",
      duration: 3000,
    });
    return;
  }
  
  const success = cart.addNewPack();
  if (success) {
    // Set the new pack as active
    activePackIndex.value = cart.packs.value.length - 1;
    isNewPackActive.value = true;
    isDuplicatedPackActive.value = false;
    
    showToast({
      title: "Success",
      message: "New pack added and set as active",
      toastType: "success",
      duration: 3000,
    });
  }
};

const duplicatePack = (index: number) => {
  // Check if we've reached the pack limit
  if (cart.packs.value.length >= packLimit.value) {
    showToast({
      title: "Pack Limit Reached",
      message: `This vendor has a maximum limit of ${packLimit.value} packs per order`,
      toastType: "warning",
      duration: 3000,
    });
    return;
  }
  
  if (cart.packs.value.length > 0) {
    const success = cart.duplicatePack(index);
    if (success) {
      // Set the duplicated pack as active
      activePackIndex.value = cart.packs.value.length - 1;
      isDuplicatedPackActive.value = true;
      isNewPackActive.value = false;
      
      showToast({
        title: "Success",
        message: `Pack ${index + 1} duplicated and set as active`,
        toastType: "success",
        duration: 3000,
      });
    }
  }
};

const removePack = (index: number) => {
  // If removing the active pack, set active to the first pack
  if (index === activePackIndex.value) {
    activePackIndex.value = 0;
  } 
  // If removing a pack before the active pack, adjust the active index
  else if (index < activePackIndex.value) {
    activePackIndex.value--;
  }
  
  const success = cart.removePack(index);
  if (success) {
    showToast({
      title: "Success",
      message: `Pack removed`,
      toastType: "success",
      duration: 3000,
    });
  }
};

const incrementItemQuantity = (packIndex: number, itemIndex: number) => {
  const success = cart.incrementItemQuantity(packIndex, itemIndex);
  if (success) {
    // No toast needed for small quantity changes
  }
};

const decrementItemQuantity = (packIndex: number, itemIndex: number) => {
  const success = cart.decrementItemQuantity(packIndex, itemIndex);
  if (success) {
    // No toast needed for small quantity changes
  }
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

const confirmEmptyCart = () => {
  if (cart.totalItems.value > 0) {
    showConfirmEmptyCartModal.value = true;
  }
};

const emptyCart = () => {
  const success = cart.clearCart();
  if (success) {
    showToast({
      title: "Success",
      message: "Cart emptied successfully",
      toastType: "info",
      duration: 3000,
    });
    showConfirmEmptyCartModal.value = false;
    activePackIndex.value = 0;
    isNewPackActive.value = false;
    isDuplicatedPackActive.value = false;
  }
};

const proceedToCheckout = () => {
  if (cart.totalItems.value > 0) {
    // Navigate to checkout page
    router.push(`/${route.params.id}/checkout`);
  } else {
    showToast({
      title: "Warning",
      message: "Your cart is empty",
      toastType: "warning",
      duration: 3000,
    });
  }
};

const closeReviewModal = () => {
  showReviewModal.value = false;
  reviewRating.value = 5;
  reviewText.value = "";
};

const submitReview = () => {
  // In a real app, you would send this to an API
  console.log("Review submitted:", {
    rating: reviewRating.value,
    text: reviewText.value,
  });

  showToast({
    title: "Success",
    message: "Thank you for your review!",
    toastType: "success",
    duration: 3000,
  });
  closeReviewModal();
};

// Format date function
const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Initialize pack settings from vendor object
const initializePackSettings = () => {
  if (vendorObj.value && vendorObj.value.packSettings) {
    // Set pack fee from vendor's packSettings
    packFee.value = vendorObj.value.packSettings.price || 0;
    
    // Set pack limit from vendor's packSettings
    packLimit.value = vendorObj.value.packSettings.limit || 0;
    
    console.log('Initialized pack settings:', {
      price: packFee.value,
      limit: packLimit.value
    });
  }
};

// Lifecycle
onMounted(() => {
  // Initialize cart from localStorage
  cart.initCart();
  
  // If cart is empty, create the first pack
  if (cart.packs.value.length === 0) {
    cart.addNewPack();
  }
  
  // Initialize pack settings from vendor object
  initializePackSettings();
});

watch(
  () => route.params.id,
  (newVendorId) => {
    if (newVendorId) {
      vendor.value = null;
      loading.value = true;
      error.value = null;
      useFetchVendorById(newVendorId as string);
    }
  },
  { immediate: true }
);

// Watch for changes in the vendor object to update pack settings
watch(
  () => vendorObj.value,
  (newVendor) => {
    if (newVendor) {
      initializePackSettings();
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => vendor.value,
  async (newVendor) => {
    if (newVendor) {
      await fetchVendorMenu(newVendor._id);
      
      // If vendor has packSettings, update our local values
      if (newVendor.packSettings) {
        packFee.value = newVendor.packSettings.price || 0;
        packLimit.value = newVendor.packSettings.limit || 0;
      }
    }
  }
);

// Watch for changes in the active pack index
watch(
  () => activePackIndex.value,
  () => {
    // Reset the flags when active pack changes
    isNewPackActive.value = false;
    isDuplicatedPackActive.value = false;
  }
);
</script>

<style scoped>
.logo-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.font-cursive {
  font-family: "Brush Script MT", cursive;
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounceSlow 2s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spinSlow 3s linear infinite;
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

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
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

@keyframes spinSlow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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