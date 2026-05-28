export interface CreateOrderRequest {
  tableId: number;
  notes?: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
  notes?: string;
}
