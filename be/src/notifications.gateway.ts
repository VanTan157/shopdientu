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
    client.join(userId); // Tham gia room
  }

  sendNotification(userId: string, data: { message: string; timestamp: Date }) {
    console.log(`Sending notification to user ${userId}:`, data);
    this.server.to(userId).emit("newNotification", data);
  }
}
