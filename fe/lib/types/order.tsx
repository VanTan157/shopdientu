import { CartItemMobile } from "./order-item";

export type OrderStatus =
  | "Đang chờ xác nhận"
  | "Đã xác nhận"
  | "Đang vận chuyển"
  | "Hoàn thành"
  | "Đã hủy";

export interface OrderMobile {
  _id: string;
  user_id: string;
  orderitem_ids: CartItemMobile[]; // Populate từ OrderItem
  phone_number: string;
  address: string;
  status: OrderStatus;
  total_amount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

// Định nghĩa kiểu trả về từ API
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}
