import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Product } from "src/common/entities/product.entity";

@Schema({ timestamps: true })
export class Tablet extends Product {
  @Prop({ type: Object })
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

export const TabletSchema = SchemaFactory.createForClass(Tablet);
