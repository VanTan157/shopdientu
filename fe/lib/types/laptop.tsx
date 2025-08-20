import { IProduct } from "./product";

export interface ILaptop extends IProduct {
  specifications: {
    screenSize: number;
    resolution: string;
    refreshRate: number;
    cpu: string;
    gpu: string;
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
