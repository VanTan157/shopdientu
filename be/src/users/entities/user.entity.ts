import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { EUserType } from "src/common/types/user.types";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true, default: EUserType.USER })
  type: EUserType;

  @Prop({ unique: true, sparse: true })
  googleId: string;

  @Prop({ unique: true, sparse: true })
  facebookId: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ expires: "15m" })
  code: string;

  @Prop()
  expireAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
