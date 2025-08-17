export interface User {
  userId: string;
  email: string;
  name: string;
  type: "ADMIN" | "USER";
  // isActive: boolean;
}
