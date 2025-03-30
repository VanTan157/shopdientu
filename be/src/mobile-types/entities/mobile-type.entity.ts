import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class MobileType extends Document {
  @Prop({ required: true, unique: true })
  type: string;
}

export const MobileTypeSchema = SchemaFactory.createForClass(MobileType); // Thay ProductTypeSchema
