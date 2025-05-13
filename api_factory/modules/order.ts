import { GATEWAY_ENDPOINT } from "../axios.config";

export interface OrderPayload {
    vendorId: string;
    phoneNumber:  string;
    deliveryType: string;
    location:  string;
    address: string;
    items: Record<string, any> [],
    notes?: string
  }

export const order_api = {
  $_create_order: (payload: OrderPayload) => {
    let url = `/orders`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_fetch_vendor_orders: () => {
    let url = `/orders`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_vendor_todays_order: () => {
    let url = `/orders/today`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_update_order_status: (id: string, payload: any) => {
    let url = `/orders/${id}`;
    return GATEWAY_ENDPOINT.patch(url, payload);
  },
  $_get_order_by_id: (id: any) => {
    let url = `/orders/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_orders_monthly_analysis: () => {
    let url = `/orders/monthly-analysis`;
    return GATEWAY_ENDPOINT.get(url);
  }
};
