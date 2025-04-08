export interface Specifications {
  screenSize: string;
  resolution: string;
  cpu: string;
  ram: string;
  storage: string;
  battery: string;
  os: string;
}

export interface Camera {
  rear: string;
  front: string;
}

export interface ColorVariant {
  color: string;
  image: string;
  stock: number;
  _id: string;
}

export interface Mobile {
  _id: string;
  name: string;
  StartingPrice: number;
  promotion: number;
  IsPromotion: boolean;
  finalPrice: number;
  description: string;
  mobile_type_id: string;
  specifications: Specifications;
  colorVariants: ColorVariant[];
  isAvailable: boolean;
  camera: Camera;
  weight: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartColorVariant {
  _id: string;
  color: string;
  image: string;
}

export interface CartItemMobile {
  _id: string;
  user_id: string;
  mobile_id: Mobile;
  quantity: number;
  unit_price: number;
  total_price: number;
  colorVariant: CartColorVariant;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
