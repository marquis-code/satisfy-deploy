// types/index.ts
export interface DeliveryLocation {
    id?: string;
    name: string;
    deliveryFee: number;
    confirmed?: boolean;
  }
  
  export interface PackSettings {
    price: number;
    limit: number;
  }
  
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }