import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("notifications")
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get("get-all")
  async getAllNotifications(@Req() req): Promise<any> {
    console.log(req);
    const userId = req.user.userId;
    console.log(userId);
    const notifications = await this.notificationsService.getUserNotifications(
      userId
    );
    return notifications;
  }

  @Get("")
  async getNotifications(@Req() req): Promise<any> {
    const userId = req.user.userId;
    console.log(userId);
    const notifications = await this.notificationsService.getUserNotifications(
      userId
    );
    // return notifications;
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return { notifications, unreadCount };
  }

  @Post()
  async createNotification(
    @Body() { userId, message }: { userId: string; message: string }
  ) {
    const notification = await this.notificationsService.create(
      userId,
      message
    );
    return { message: "Notification created successfully", notification };
  }

  @Patch("mark-as-read")
  async markAsRead(@Body() body: { id: string }) {
    const notification = await this.notificationsService.markAsRead(body.id);
    return { message: "Notification marked as read", notification };
  }
}
