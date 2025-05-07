export type ColorVariant = {
  color: string;
  image: string;
  stock: number;
  _id: string;
};

export interface Camera {
  rear: string;
  front: string;
}

export interface LaptopSpecifications {
  screenSize: number;
  resolution: string;
  cpu: string;
  gpu: string;
  ram: number;
  storage: number;
  battery: number;
  os: string;
  refreshRate: string;
  keyboard: string;
  ports: string[];
  webcam: string;
  audio: string;
}

export interface Laptop {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  startingPrice: number;
  promotion: number;
  isPromotion: boolean;
  finalPrice: number;
  specifications: LaptopSpecifications;
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
