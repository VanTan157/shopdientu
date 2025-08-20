export type OrderStatus =
  | "Tất cả"
  | "Đang chờ xác nhận"
  | "Đã xác nhận"
  | "Đang vận chuyển"
  | "Hoàn thành"
  | "Đã hủy";

export interface Order {
  _id: string;
  userId: string;
  orderitemIds: string;
  totalAmount: number;
  phoneNumber: string;
  address: string;
  status: EOrderStatus;
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
