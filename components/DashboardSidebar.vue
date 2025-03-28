<template>
    <div>
      <!-- Mobile Hamburger Menu Button -->
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1e2530] text-white md:hidden"
      >
        <Menu v-if="!isMobileMenuOpen" size="24" />
        <X v-else size="24" />
      </button>
      
      <!-- Sidebar -->
      <div 
        :class="[
          'fixed top-0 left-0 bg-[#1e2530] text-gray-300 h-screen transition-all duration-300 flex flex-col z-40 sidebar',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]"
      >
        <div class="p-4 border-b border-gray-700 flex items-center justify-between">
          <div :class="['flex items-center', isCollapsed && 'justify-center w-full']">
            <img v-if="!isCollapsed" src="@/assets/img/satisfy-logo-coloured.png" alt="eleste" class="h-8" />
            <img v-else src="/logo-icon.svg" alt="eleste" class="h-8 w-8" />
          </div>
          <button 
            @click="isCollapsed = !isCollapsed"
            :class="['text-gray-400 hover:text-white transition-colors', 
              isCollapsed && 'hidden',
              'hidden md:block' // Hide on mobile
            ]"
          >
            <ChevronLeft v-if="!isCollapsed" size="20" />
            <ChevronRight v-else size="20" />
          </button>
        </div>
  
        <div class="flex-1 overflow-y-auto py-4">
          <div class="mb-6">
            <p :class="[
              'px-4 text-xs uppercase text-gray-500 font-medium mb-2',
              isCollapsed && 'text-center'
            ]">
              {{ !isCollapsed ? "GENERAL" : "GEN" }}
            </p>
            
            <nav>
              <NavItem 
                :icon="LayoutGrid" 
                label="Dashboard" 
                path="/dashboard"
                :is-active="true"
                :is-collapsed="isCollapsed"
              />
              <NavItem 
                :icon="User" 
                label="Profile" 
                path=""
                :is-collapsed="isCollapsed"
              />
              <NavItem 
                :icon="FileText" 
                label="Food Categories" 
                path="/dashboard/categories"
                :is-collapsed="isCollapsed"
              />
              <NavItem 
                :icon="List" 
                label="Menu List" 
                path="/dashboard/menu"
                :is-collapsed="isCollapsed"
              />
              
              <div>
                <button 
                  @click="toggleMenu('orders')"
                  :class="[
                    'w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors',
                    isCollapsed && 'justify-center'
                  ]"
                >
                  <ShoppingBag size="20" />
                  <template v-if="!isCollapsed">
                    <span class="ml-3 flex-1 text-left">Orders</span>
                    <ChevronDown 
                      size="16" 
                      :class="[
                        'transition-transform duration-200', 
                        expandedMenus.orders && 'transform rotate-180'
                      ]" 
                    />
                  </template>
                </button>
                
                <div 
                  v-if="!isCollapsed" 
                  :class="[
                    'pl-12 py-1 overflow-hidden transition-all duration-200 ease-in-out',
                    expandedMenus.orders ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                  ]"
                >
                  <NavItem 
                    label="Today Orders" 
                    path="/dashboard/orders"
                    :is-collapsed="isCollapsed"
                    class="py-1.5"
                  />
                  <NavItem 
                    label="All Orders" 
                    path="/dashboard/orders"
                    :is-collapsed="isCollapsed"
                    class="py-1.5"
                  />
                </div>
              </div>
              
              <div>
                <button 
                  @click="toggleMenu('analysis')"
                  :class="[
                    'w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors',
                    isCollapsed && 'justify-center'
                  ]"
                >
                  <BarChart2 size="20" />
                  <template v-if="!isCollapsed">
                    <span class="ml-3 flex-1 text-left">Analysis</span>
                    <ChevronDown 
                      size="16" 
                      :class="[
                        'transition-transform duration-200', 
                        expandedMenus.analysis && 'transform rotate-180'
                      ]" 
                    />
                  </template>
                </button>
                
                <div 
                  v-if="!isCollapsed" 
                  :class="[
                    'pl-12 py-1 overflow-hidden transition-all duration-200 ease-in-out',
                    expandedMenus.analysis ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  ]"
                >
                  <NavItem 
                    label="Sales Overview" 
                    path="/dashboard/analysis"
                    :is-collapsed="isCollapsed"
                    class="py-1.5"
                  />
                  <NavItem 
                    label="Monthly Reports" 
                    path="/dashboard/analysis"
                    :is-collapsed="isCollapsed"
                    class="py-1.5"
                  />
                  <NavItem 
                    label="Customer Analytics" 
                    path="/dashboard/analysis"
                    :is-collapsed="isCollapsed"
                    class="py-1.5"
                  />
                </div>
              </div>
              
              <NavItem 
                :icon="Clock" 
                label="Working Hours" 
                path="/dashboard/working-hours"
                :is-collapsed="isCollapsed"
              />
              <NavItem 
                :icon="BarChart2" 
                path="/dashboard/promotions"
                label="Brand Promotion" 
                :is-collapsed="isCollapsed"
              />
              <NavItem 
                :icon="CreditCard" 
                label="Transactions" 
                path="/dashboard/transactions"
                :is-collapsed="isCollapsed"
              />
              <NavItem 
                :icon="Star" 
                label="Reviews" 
                :is-collapsed="isCollapsed"
              />
              <NavItem 
                :icon="Calendar" 
                label="Catering Events" 
                :is-collapsed="isCollapsed"
              />
              
              <div>
                <button 
                  @click="toggleMenu('delivery')"
                  :class="[
                    'w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors',
                    isCollapsed && 'justify-center'
                  ]"
                >
                  <Truck size="20" />
                  <template v-if="!isCollapsed">
                    <span class="ml-3 flex-1 text-left">Delivery</span>
                    <ChevronDown 
                      size="16" 
                      :class="[
                        'transition-transform duration-200', 
                        expandedMenus.delivery && 'transform rotate-180'
                      ]" 
                    />
                  </template>
                </button>
                
                <div 
                  v-if="!isCollapsed" 
                  :class="[
                    'pl-12 py-1 overflow-hidden transition-all duration-200 ease-in-out',
                    expandedMenus.delivery ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  ]"
                >
                  <NavItem 
                    label="Active Deliveries" 
                    :is-collapsed="isCollapsed"
                    class="py-1.5"
                  />
                  <NavItem 
                    label="Delivery History" 
                    :is-collapsed="isCollapsed"
                    class="py-1.5"
                  />
                  <NavItem 
                    label="Delivery Settings" 
                    :is-collapsed="isCollapsed"
                    class="py-1.5"
                  />
                </div>
              </div>
            </nav>
          </div>
          
          <div>
            <p :class="[
              'px-4 text-xs uppercase text-gray-500 font-medium mb-2',
              isCollapsed && 'text-center'
            ]">
              {{ !isCollapsed ? "SUPPORT" : "SUP" }}
            </p>
            
            <nav>
              <NavItem 
                :icon="HelpCircle" 
                label="Help Center" 
                :is-collapsed="isCollapsed"
              />
              <NavItem 
                :icon="MessageSquare" 
                label="FAQs" 
                :is-collapsed="isCollapsed"
              />
              <NavItem 
                :icon="LogOut" 
                label="Logout" 
                :is-collapsed="isCollapsed"
              />
            </nav>
          </div>
        </div>
      </div>
      
      <!-- Overlay for mobile menu -->
      <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        @click="isMobileMenuOpen = false"
      ></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
  import { 
    BarChart2, 
    Calendar, 
    ChevronDown,
    ChevronLeft,
    ChevronRight, 
    Clock, 
    CreditCard, 
    FileText, 
    HelpCircle, 
    LayoutGrid, 
    List, 
    LogOut, 
    Menu, 
    MessageSquare, 
    ShoppingBag, 
    Star, 
    Truck, 
    User,
    X
  } from 'lucide-vue-next';
  import { useWindowSize } from '~/composables/useWindowSize';
  
  const isCollapsed = ref(false);
  const isMobileMenuOpen = ref(false);
  const expandedMenus = reactive({
    orders: false,
    analysis: false,
    delivery: false
  });
  
  // Only allow one dropdown to be open at a time
  const toggleMenu = (menu: string) => {
    // If the clicked menu is already open, close it
    if (expandedMenus[menu]) {
      expandedMenus[menu] = false;
      return;
    }
    
    // Close all menus
    Object.keys(expandedMenus).forEach(key => {
      expandedMenus[key] = false;
    });
    
    // Open the clicked menu
    expandedMenus[menu] = true;
  };
  
  // Only run client-side code in onMounted
  onMounted(() => {
    if (process.client) {
      // Close mobile menu when window is resized to desktop size
      const { width } = useWindowSize();
      watch(width, (newWidth) => {
        if (newWidth >= 768) { // md breakpoint
          isMobileMenuOpen.value = false;
        }
      });
  
      // Close mobile menu when clicking outside
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.sidebar') && isMobileMenuOpen.value) {
          isMobileMenuOpen.value = false;
        }
      };
  
      // Add event listener for clicks outside sidebar
      document.addEventListener('click', handleClickOutside);
  
      // Clean up event listener
      onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
      });
    }
  });
  </script>