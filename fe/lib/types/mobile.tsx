import { IProduct } from "./product";

export interface IMobile extends IProduct {
  specifications: {
    screenSize: number;
    resolution: string;
    refreshRate: number;
    simType: string;
    ram: number;
    storage: number;
    battery: number;
    os: string;
    camera: {
      rear: string;
      front: string;
    };
  };
}
