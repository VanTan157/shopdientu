import { EProductType } from "./order";
import { IProduct } from "./product";

export interface CartColorVariant {
  _id: string;
  color: string;
  image: string;
}

export interface IOrderItem {
  _id: string;
  userId: string;
  productId: string;
  productName: string;
  productType: EProductType;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  isInCart: boolean;
  colorVariant: { _id: string; color: string; image: string };
}
