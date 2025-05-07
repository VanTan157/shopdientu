import { Laptop } from "./laptop";
import { Mobile } from "./mobile";

// Type cho CartColorVariant
export interface CartColorVariant {
  _id: string;
  color: string;
  image: string;
}

// Type cho CartItem (sửa để hỗ trợ cả Mobile và Laptop)
export interface CartItem {
  _id: string;
  user_id: string;
  product_id: string; // Thay vì mobile_id
  product_type: "mobile" | "laptop"; // Enum cho product_type
  quantity: number;
  unit_price: number;
  total_price: number;
  colorVariant: CartColorVariant;
  createdAt: string;
  updatedAt: string;
  __v: number;
  product: Mobile | Laptop; // Trường product có thể là Mobile hoặc Laptop
}
