"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useWebSocket = (userId: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Kết nối WebSocket
    const socketInstance = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3000",
      {
        reconnection: true,
      }
    );

    setSocket(socketInstance);

    // Tham gia room với userId
    socketInstance.emit("join", userId);

    // Lắng nghe sự kiện newNotification
    socketInstance.on("newNotification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    // Ngắt kết nối khi component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return { notifications, socket };
};
