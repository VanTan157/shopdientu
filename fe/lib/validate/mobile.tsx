export type Mobile = {
  _id: string;
  name: string;
  StartingPrice: number;
  promotion: number;
  IsPromotion: boolean;
  finalPrice: number;
  description: string;
  mobile_type_id: {
    _id: string;
    type: string;
    __v: number;
  };
  specifications: {
    screenSize: string | number; // Có thể là string ("6.9") hoặc number (6.9)
    resolution: string;
    cpu: string;
    ram: string | number; // Có thể là string ("8") hoặc number (8)
    storage: string | number; // Có thể là string ("256") hoặc number (256)
    battery: string | number; // Có thể là string ("4441") hoặc number (4441)
    os: string;
  };
  colorVariants: {
    color: string;
    image: string;
    stock: number;
    _id: string;
  }[];
  isAvailable: boolean;
  camera: {
    rear: string;
    front: string;
  };
  weight: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type MobileType = {
  _id: string;
  type: string;
  __v: number;
};

export type CartItem = {
  _id: string;
  mobile_id: {
    _id: string;
    name: string;
    finalPrice: number;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
  colorVariant: {
    _id: string;
    color: string;
    image: string;
  };
};
