export type ColorVariant = {
  color: string;
  image: string;
  stock: number;
  _id: string;
};

export interface HeadphoneSpecifications {
  driverType: string;
  driverSize: number;
  frequencyRange: string;
  sensitivity: number;
  impedance: number;
  noiseCancellation: string;
  batteryLife: number;
  chargingTime: number;
  chargingPort: string;
  microphone: string;
  audioQuality: string;
}

export interface Headphone {
  _id: string;
  name: string;
  brand: string;
  type: string;
  description: string;
  startingPrice: number;
  promotion: number;
  isPromotion: boolean;
  finalPrice: number;
  specifications: HeadphoneSpecifications;
  colorVariants: ColorVariant[];
  totalStock: number;
  isAvailable: boolean;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  warranty: string;
  releaseDate: string;
  tags: string[];
  connectivity: string[];
  accessories: string[];
  slug: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
