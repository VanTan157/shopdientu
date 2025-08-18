import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { OrderItemsModule } from "./order-items/order-items.module";
import { OrderModule } from "./order/order.module";
import { MobilesModule } from "./mobiles/mobiles.module";
import { NotificationsGateway } from "./notifications.gateway";
import { NotificationsModule } from "./notifications/notifications.module";
import { LaptopModule } from "./laptop/laptop.module";
import { HeadphoneModule } from "./headphone/headphone.module";
import { TabletModule } from "./tablet/tablet.module";
import { MailModule } from "./mail/mail.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Làm ConfigModule доступным toàn cục
      envFilePath: ".env", // Đảm bảo tải file .env
    }),
    MongooseModule.forRoot("mongodb://localhost:27017/nestjs_db"),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MobilesModule,
    OrderItemsModule,
    OrderModule,
    NotificationsModule,
    LaptopModule,
    HeadphoneModule,
    TabletModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway],
})
export class AppModule {}
