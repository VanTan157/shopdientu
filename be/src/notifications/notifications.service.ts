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
      _id: (notification._id as Types.ObjectId).toString(),
      user_id: userId,
      message,
      isRead: false,
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
      __v: notification.__v,
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
      console.error("Invalid ID format:", id);
      throw new NotFoundException("ID không hợp lệ");
    }
    const notification = await this.notificationModel
      .findByIdAndUpdate({ _id: id }, { isRead: true }, { new: true })
      .exec();

    if (!notification) {
      throw new NotFoundException("Không tìm thấy thông báo");
    }

    return notification;
  }
}
