export interface IProduct {
  _id: string;
  brand: string;

  name: string;

  startingPrice: number;

  promotion: number;

  isPromotion: boolean;

  finalPrice: number;

  description: string;

  colorVariants: { _id: string; color: string; image: string; stock: number }[];

  totalStock: number;

  isAvailable: boolean;

  accessories: string[];

  tags: string[];

  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };

  warranty: string;
}
