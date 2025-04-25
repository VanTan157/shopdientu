import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string; // Không bắt buộc vì người dùng đăng nhập xã hội không cần mật khẩu

  @Prop({ required: true, default: "USER" })
  type: string;

  @Prop()
  googleId: string; // Thêm trường cho Google

  @Prop()
  facebookId: string; // Thêm trường cho Facebook
}

export const UserSchema = SchemaFactory.createForClass(User);
