import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Product } from "src/common/entities/product.entity";

@Schema({ timestamps: true })
export class Mobile extends Product {
  @Prop({
    type: Object,
    required: true,
  })
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

export const MobileSchema = SchemaFactory.createForClass(Mobile);
