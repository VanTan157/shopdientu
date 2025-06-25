import { apiGet } from "@/lib/api";
import type { Notification } from "@/lib/types/notification";
import { cookies } from "next/headers";
import NotificationIcon from "./notification-icon";
import { User } from "next-auth";

const Notification = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const user = await apiGet<User>("/auth/get-me", {
    Cookie: `accessToken=${accessToken}`,
  });
  console.log(user);

  const res = await apiGet<Notification[]>("/notifications/get-all", {
    Cookie: `accessToken=${accessToken}`,
  });
  console.log("user", user);

  const notifications = res.data || [];

  return (
    <NotificationIcon notifications={notifications} userId={user.data?.id} />
  );
};

export default Notification;
