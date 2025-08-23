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
    const userId = req.user.userId;
    return this.notificationsService.getUserNotifications(userId);
  }

  @Get()
  async getNotifications(@Req() req): Promise<any> {
    const userId = req.user.userId;
    return this.notificationsService.getUserNotifications(userId);
  }

  @Post()
  async createNotification(
    @Body() { userId, message }: { userId: string; message: string }
  ) {
    return this.notificationsService.create(userId, message);
  }

  @Patch("mark-as-read")
  async markAsRead(@Body() body: { id: string }) {
    return this.notificationsService.markAsRead(body.id);
  }
}
