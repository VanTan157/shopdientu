import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { EProductType } from "src/common/types/order.types";

@Schema({ timestamps: true })
export class OrderItem extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productType: EProductType;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true, default: false })
  isInCart: boolean;

  @Prop({
    type: {
      _id: { type: Types.ObjectId },
      color: { type: String, required: true },
      image: { type: String, required: true },
    },
    required: true,
  })
  colorVariant: { _id: Types.ObjectId; color: string; image: string };
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
