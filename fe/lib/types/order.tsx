import { CartItem } from "./order-item";

export type OrderStatus =
  | "Đang chờ xác nhận"
  | "Đã xác nhận"
  | "Đang vận chuyển"
  | "Hoàn thành"
  | "Đã hủy";

export interface Order {
  _id: string;
  user_id: string;
  orderitem_ids: CartItem[];
  total_amount: number;
  phone_number: string;
  address: string;
  status:
    | "Đang chờ xác nhận"
    | "Đã xác nhận"
    | "Đang vận chuyển"
    | "Hoàn thành"
    | "Đã hủy";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Định nghĩa kiểu trả về từ API
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}
