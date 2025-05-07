import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Headphone, HeadphoneSchema } from "./entities/headphone.entity";
import { HeadphoneController } from "./headphone.controller";
import { HeadphoneService } from "./headphone.service";

// Module Laptop, tổ chức các thành phần liên quan
@Module({
  imports: [
    // Đăng ký schema Laptop với Mongoose
    MongooseModule.forFeature([
      { name: Headphone.name, schema: HeadphoneSchema },
    ]),
  ],
  controllers: [HeadphoneController], // Đăng ký controller
  providers: [HeadphoneService], // Đăng ký service
  exports: [HeadphoneService], // Xuất service để sử dụng ở module khác
})
export class HeadphoneModule {}
