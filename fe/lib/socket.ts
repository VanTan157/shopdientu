import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  // Thay bằng URL backend của bạn
  withCredentials: true,
});

export default socket;
