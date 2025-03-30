import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Mobile extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  StartingPrice: number;

  @Prop({ required: true, default: 0 })
  promotion: number;

  @Prop({ required: true, default: false })
  IsPromotion: boolean;

  @Prop({ required: true })
  finalPrice: number;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: "MobileType", required: true })
  mobile_type_id: Types.ObjectId;

  @Prop({ type: Object })
  specifications: {
    screenSize?: number;
    resolution?: string;
    cpu?: string;
    ram?: number;
    storage?: number;
    battery?: number;
    os?: string;
  };

  @Prop({
    type: [
      {
        color: { type: String, required: true },
        image: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 }, // Thêm stock cho từng màu
      },
    ],
    default: [],
  })
  colorVariants: { color: string; image: string; stock: number }[];

  @Prop({ type: Boolean, default: true })
  isAvailable: boolean;

  @Prop({ type: Object })
  camera: {
    rear?: string;
    front?: string;
  };

  @Prop({ type: Number })
  weight: number;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const MobileSchema = SchemaFactory.createForClass(Mobile);
