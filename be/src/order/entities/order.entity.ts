import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { EOrderStatus } from "src/common/types/order.types";

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: "OrderItem", required: true }])
  orderitemIds: Types.ObjectId[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({
    required: true,
    enum: EOrderStatus,
    default: EOrderStatus.PENDING,
  })
  status: EOrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
