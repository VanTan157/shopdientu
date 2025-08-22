import { apiGet } from "@/lib/api";
import type { Notification } from "@/lib/types/notification";
import { cookies } from "next/headers";
import NotificationIcon from "./notification-icon";
import { User } from "next-auth";
import { verify } from "jsonwebtoken";

const Notification = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  let user: User | null = null;
  console.log("123");

  if (accessToken !== null) {
    user = verify(accessToken, process.env.JWT_SECRET as string) as User;
  }

  console.log("User data:", user);

  const res = await apiGet<Notification[]>("/notifications/get-all", {
    Cookie: `accessToken=${accessToken}`,
  });

  const notifications = res.data || [];
  console.log("User notifications:", notifications);

  return <NotificationIcon notifications={notifications} userId={user?.id} />;
};

export default Notification;
