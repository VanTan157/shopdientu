export interface MobileSpecifications {
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
  brand: string;
  specifications: MobileSpecifications;
  colorVariants: ColorVariant[];
  isAvailable: boolean;
  camera: Camera;
  weight: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
