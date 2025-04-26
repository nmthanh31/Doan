export interface CartItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: "incart" | "completed";
  create_at: string;
}
