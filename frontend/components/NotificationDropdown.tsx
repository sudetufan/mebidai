"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import {
  getNotifications,
  markNotificationAsRead,
} from "@/lib/api";

type Notification = {
  id: number;
  type: string;
  sender_id: number;
  sender_username: string;
  is_read: boolean;
  created_at: string;
};
export default function NotificationDropdown() {

  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  async function loadNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);
  async function handleNotificationClick(
    notification: Notification
  ) {
    try {

      if (!notification.is_read) {

        await markNotificationAsRead(
          notification.id
        );

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  is_read: true,
                }
              : item
          )
        );
      }
      router.push(
        `/profile/${notification.sender_id}`
      );


    } catch (error) {
      console.error(error);
    }
  }
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative hover:text-blue-400"
      >
        <Bell size={20}/>
        {unreadCount > 0 && (

          <span
            className="
              absolute 
              -right-2 
              -top-2 
              flex 
              h-4 
              w-4 
              items-center 
              justify-center 
              rounded-full 
              bg-red-500 
              text-xs
            "
          >
            {unreadCount}
          </span>
        )}
      </button>
      {open && (

        <div
          className="
            absolute 
            right-0 
            mt-3 
            w-72 
            rounded-lg 
            border 
            border-slate-700 
            bg-slate-900 
            p-3 
            shadow-lg
          "
        >
          <h3 className="mb-2 font-semibold">
            Notifications
          </h3>
          {notifications.length === 0 ? (

            <p className="text-sm text-gray-400">
              No notifications
            </p>
          ) : (

            notifications.map((notification) => (

              <div
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(notification)
                }
                className={`
                  cursor-pointer
                  border-b
                  border-slate-700
                  py-2
                  text-sm
                  hover:bg-slate-800
                  ${
                    !notification.is_read
                      ? "font-semibold"
                      : ""
                  }
                `}
              >
                <p>

                  <span className="font-semibold">
                    {notification.sender_username}
                  </span>

                  {" "}started following you
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(
                    notification.created_at
                  ).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}