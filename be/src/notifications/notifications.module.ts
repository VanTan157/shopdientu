import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller";
import {
  Notification,
  NotificationSchema,
} from "./entities/notification.entity";
import { NotificationsGateway } from "src/notifications.gateway";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService], // Export để dùng trong OrdersModule
})
export class NotificationsModule {}
