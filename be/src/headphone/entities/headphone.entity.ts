import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "src/common/entities/product.entity";
@Schema({ timestamps: true })
export class Headphone extends Product {
  @Prop({ type: Object, required: true })
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

export const HeadphoneSchema = SchemaFactory.createForClass(Headphone);
