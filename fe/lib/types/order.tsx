import { CartItem } from "./order-item";

export type OrderStatus =
  | "Tất cả"
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

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export enum EOrderStatus {
  ALL = "Tất cả",
  PENDING = "Đang chờ xác nhận",
  CONFIRMED = "Đã xác nhận",
  SHIPPED = "Đang vận chuyển",
  COMPLETED = "Hoàn thành",
  CANCELED = "Đã hủy",
}

export enum EProductType {
  LAPTOP = "laptop",
  MOBILE = "mobile",
  HEADPHONE = "headphone",
  TABLET = "tablet",
}
