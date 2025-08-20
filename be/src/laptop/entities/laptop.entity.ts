import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "src/common/entities/product.entity";
@Schema({ timestamps: true })
export class Laptop extends Product {
  @Prop({ type: Object })
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

export const LaptopSchema = SchemaFactory.createForClass(Laptop);
