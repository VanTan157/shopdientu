// lib/useSocket.js
"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Thay bằng URL của server WebSocket

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [newNotification, setNewNotification] = useState(null);

  useEffect(() => {
    // Khởi tạo kết nối WebSocket
    const socketIo = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(socketIo);

    // Tham gia room với userId
    if (userId) {
      socketIo.emit("join", userId);
    }

    // Lắng nghe sự kiện newNotification
    socketIo.on("newNotification", (data) => {
      setNewNotification(data);
    });

    // Cleanup khi component unmount
    return () => {
      socketIo.disconnect();
    };
  }, [userId]);

  return { socket, newNotification };
};
