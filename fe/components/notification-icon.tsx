// notification-icon.tsx
"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket"; // Import socket
import { useNotificationStore } from "@/app/store/notification-store";
import { Notification } from "@/lib/types/notification";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { apiPatch } from "@/lib/api";
import { useRouter } from "next/navigation";

const NotificationIcon = ({
  notifications: initialNotifications,
  userId,
}: {
  notifications: Notification[];
  userId?: string;
}) => {
  console.log("userId", userId);
  const router = useRouter();
  const { count, setCount } = useNotificationStore();
  const [notifications, setNotifications] = useState(initialNotifications);

  // Cập nhật số lượng thông báo chưa đọc khi mount
  useEffect(() => {
    const unreadCount = initialNotifications.filter((n) => !n.isRead).length;
    setCount(unreadCount);
  }, [initialNotifications, setCount]);

  // Lắng nghe thông báo mới từ WebSocket
  useEffect(() => {
    socket.emit("join", userId); // Thay "USER_ID" bằng userId thực tế, lấy từ context hoặc token

    socket.on(
      "newNotification",
      (data: { message: string; timestamp: string }) => {
        // Thêm thông báo mới vào danh sách
        if (!userId) return;
        setNotifications((prev) => [
          {
            _id: Date.now().toString(),
            message: data.message,
            createdAt: data.timestamp,
            isRead: false,
            user_id: userId,
            updatedAt: data.timestamp,
            __v: 0,
          },
          ...prev,
        ]);
        // Tăng số lượng thông báo chưa đọc
        setCount(count + 1);
      }
    );

    // Cleanup khi unmount
    return () => {
      socket.off("newNotification");
    };
  }, [count, setCount]);

  return (
    <HoverCard openDelay={0} closeDelay={50}>
      <HoverCardTrigger className="flex relative items-center space-x-1 text-white hover:text-blue-600 cursor-pointer transition-colors">
        <Bell className="h-5 w-5 relative" />
        {count > 0 && (
          <span className="absolute -top-4 -right-4 bg-red-600 w-5 h-5 flex justify-center items-center rounded-full text-xs text-white">
            {count}
          </span>
        )}
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
                onClick={async () => {
                  if (!notification.isRead) {
                    try {
                      const res = await apiPatch(
                        `/notifications/mark-as-read`,
                        { id: notification._id }
                      );
                      setCount(count - 1);
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n._id === notification._id
                            ? { ...n, isRead: true }
                            : n
                        )
                      );
                      router.refresh();
                      console.log("Notification marked as read:", res);
                    } catch (error) {
                      console.error(
                        "Error marking notification as read:",
                        error
                      );
                    }
                  }
                }}
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
                    {
                      locale: vi,
                    }
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

export default NotificationIcon;
