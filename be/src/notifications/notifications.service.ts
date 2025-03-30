import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NotificationsGateway } from "src/notifications.gateway";
import { Notification } from "./entities/notification.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async create(userId: string, message: string): Promise<Notification> {
    const notification = new this.notificationModel({
      user_id: userId,
      message,
      isRead: false,
    });
    await notification.save();

    // Gửi thông báo qua WebSocket
    this.notificationsGateway.sendNotification(userId, {
      message,
      timestamp: new Date(),
    });
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ user_id: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("ID không hợp lệ");
    }
    console.log(id);
    const notification = await this.notificationModel
      .findByIdAndUpdate({ _id: id }, { isRead: true }, { new: true })
      .exec();
    return notification;
  }
}
