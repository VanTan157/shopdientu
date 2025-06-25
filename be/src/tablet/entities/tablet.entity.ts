import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Tablet extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  category: string; // ví dụ: "Tablet", "2-in-1", "Kids", v.v.

  @Prop()
  description: string;

  @Prop({ required: true })
  startingPrice: number;

  @Prop({ required: true, default: 0 })
  promotion: number;

  @Prop({ required: true, default: false })
  isPromotion: boolean;

  @Prop({ required: true })
  finalPrice: number;

  @Prop({ type: Object })
  specifications: {
    screenSize?: number;
    resolution?: string;
    cpu?: string;
    gpu?: string;
    ram?: number;
    storage?: number;
    battery?: number;
    os?: string;
    refreshRate?: string;
    cameraFront?: string; // ví dụ: "8MP"
    cameraRear?: string; // ví dụ: "13MP"
    simSupport?: boolean; // có hỗ trợ SIM không
    stylusSupport?: boolean; // có hỗ trợ bút cảm ứng không
    ports?: string[];
    audio?: string;
  };

  @Prop({
    type: [
      {
        color: { type: String, required: true },
        image: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    default: [],
  })
  colorVariants: { color: string; image: string; stock: number }[];

  @Prop({ required: true, default: 0 })
  totalStock: number;

  @Prop({ type: Boolean, default: true })
  isAvailable: boolean;

  @Prop({ type: Number })
  weight: number;

  @Prop({ type: Object })
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  };

  @Prop()
  warranty: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  connectivity: string[]; // ví dụ: ["Wi-Fi 6", "Bluetooth 5.2", "4G LTE"]

  @Prop({ type: [String], default: [] })
  accessories: string[]; // ví dụ: ["Charger", "Stylus Pen", "Keyboard"]

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  sku: string;
}

export const TabletSchema = SchemaFactory.createForClass(Tablet);
