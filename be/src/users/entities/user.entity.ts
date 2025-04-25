import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true, default: "USER" })
  type: string;

  @Prop({ unique: true, sparse: true })
  googleId: string;

  @Prop({ unique: true, sparse: true })
  facebookId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
