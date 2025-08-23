import { apiGet } from "@/lib/api";
import type { Notification } from "@/lib/types/notification";
import { cookies } from "next/headers";
import NotificationIcon from "./notification-icon";
import { verify } from "jsonwebtoken";
import { User } from "@/lib/types/user";

const Notification = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  let user: User | null = null;

  if (accessToken !== null) {
    user = verify(accessToken, process.env.JWT_SECRET as string) as User;
  }
  console.log("User data:", user);

  const res = await apiGet<Notification[]>(
    "/notifications/get-all",
    {
      Cookie: `accessToken=${accessToken}`,
    },
    ["notification"]
  );

  const notifications = res.data || [];

  return (
    <NotificationIcon notifications={notifications} userId={user?.userId} />
  );
};

export default Notification;
