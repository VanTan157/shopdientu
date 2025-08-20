import { IProduct } from "./product";

export interface IHeadphone extends IProduct {
  specifications: {
    driverType: string;
    driverSize: number;
    frequencyRange: string;
    impedance: number;
    noiseCancellation: string;
    batteryLife: number;
    chargingTime: number;
    chargingPort: string;
    microphone: boolean;
    connectivity: string;
  };
}
