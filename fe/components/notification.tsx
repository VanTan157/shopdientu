import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { apiGet } from "@/lib/api";
import { Bell } from "lucide-react";
import { cookies } from "next/headers";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { Notification } from "@/lib/types/notification";

const Notification = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  const res = await apiGet<Notification[]>("/notifications/get-all", {
    Cookie: `accessToken=${accessToken}`,
  });

  const notifications = res.data || [];

  return (
    <HoverCard openDelay={0} closeDelay={50}>
      <HoverCardTrigger className="flex items-center space-x-1 text-white hover:text-blue-600 cursor-pointer transition-colors">
        <Bell className="h-5 w-5" />
        <span className="text-sm font-medium">Thông báo</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-white shadow-lg rounded-lg p-0 border border-gray-200 max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-gray-50 p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            Không có thông báo nào
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-3 text-sm hover:bg-gray-50 transition-colors ${
                  notification.isRead ? "bg-white" : "bg-blue-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <p
                    className={`text-gray-800 ${
                      notification.isRead ? "" : "font-medium"
                    }`}
                  >
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {format(
                    new Date(notification.createdAt),
                    "dd/MM/yyyy HH:mm",
                    { locale: vi }
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default Notification;
