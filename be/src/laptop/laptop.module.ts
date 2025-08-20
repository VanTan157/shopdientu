import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LaptopService } from "./laptop.service";
import { LaptopController } from "./laptop.controller";
import { Laptop, LaptopSchema } from "./entities/laptop.entity";

// Module Laptop, tổ chức các thành phần liên quan
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Laptop.name, schema: LaptopSchema }]),
  ],
  controllers: [LaptopController], // Đăng ký controller
  providers: [LaptopService], // Đăng ký service
  exports: [LaptopService], // Xuất service để sử dụng ở module khác
})
export class LaptopModule {}
