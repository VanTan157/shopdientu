import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startingPrice: number;

  @Prop({ required: true, default: 0 })
  promotion: number;

  @Prop({ required: true, default: false })
  isPromotion: boolean;

  @Prop({ required: true })
  finalPrice: number;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [
      {
        color: { type: String, required: true },
        image: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    default: [],
    required: true,
  })
  colorVariants: { color: string; image: string; stock: number }[];

  @Prop({ required: true, default: 0 })
  totalStock: number;

  @Prop({ type: Boolean, default: true, required: true })
  isAvailable: boolean;

  @Prop({ type: [String], default: [], required: true })
  accessories: string[];

  @Prop({ type: [String], default: [], required: true })
  tags: string[];

  @Prop({ type: Object, required: true })
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };

  @Prop({ required: true })
  warranty: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
