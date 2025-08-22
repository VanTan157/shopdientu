import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: { origin: "*" } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("join")
  handleJoin(client: Socket, userId: string) {
    client.join(userId);
  }

  sendNotification(
    userId: string,
    data: {
      _id: string;
      user_id: string;
      message: string;
      isRead: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }
  ) {
    this.server.to(userId).emit("newNotification", data);
  }
}
