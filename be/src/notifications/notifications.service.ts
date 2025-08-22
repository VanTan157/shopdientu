import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NotificationsGateway } from "src/notifications.gateway";
import { Notification } from "./entities/notification.entity";
import { ApiResponse } from "src/common/types/api";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async create(
    userId: string,
    message: string
  ): Promise<ApiResponse<Notification>> {
    const notification = new this.notificationModel({
      user_id: userId,
      message,
      isRead: false,
    });
    await notification.save();

    this.notificationsGateway.sendNotification(userId, {
      _id: (notification._id as Types.ObjectId).toString(),
      user_id: userId,
      message,
      isRead: false,
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
      __v: notification.__v,
    });
    return {
      data: notification,
      message: "Thông báo đã được tạo thành công",
      success: true,
    };
  }

  async getUserNotifications(
    userId: string
  ): Promise<ApiResponse<Notification[]>> {
    const notifications = await this.notificationModel
      .find({ user_id: userId })
      .sort({ createdAt: -1 })
      .exec();
    return {
      data: notifications,
      message: "Lấy thông báo thành công",
      success: true,
    };
  }

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
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

    return {
      data: notification,
      message: "Đánh dấu thông báo là đã đọc thành công",
      success: true,
    };
  }
}
