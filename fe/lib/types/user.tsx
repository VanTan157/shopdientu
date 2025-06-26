export interface User {
  _id: string;
  email: string;
  name: string;
  password: string; // Mật khẩu mã hóa, thường không hiển thị
  type: "ADMIN" | "USER"; // Giả định có hai loại người dùng
  isActive: boolean;
  __v: number; // Version của MongoDB
}
