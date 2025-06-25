import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  withCredentials: true,
  transports: ["websocket", "polling"], // Ưu tiên WebSocket
});
socket.on("connect", () => console.log("Socket connected:", socket.id));
socket.on("connect_error", (err) =>
  console.error("Socket connect error:", err)
);

export default socket;
