import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Tablet, TabletSchema } from "./entities/tablet.entity";
import { TabletController } from "./tablet.controller";
import { TabletService } from "./tablet.service";
// Module Laptop, tổ chức các thành phần liên quan
@Module({
  imports: [
    // Đăng ký schema Laptop với Mongoose
    MongooseModule.forFeature([{ name: Tablet.name, schema: TabletSchema }]),
  ],
  controllers: [TabletController], // Đăng ký controller
  providers: [TabletService], // Đăng ký service
  exports: [TabletService], // Xuất service để sử dụng ở module khác
})
export class TabletModule {}
