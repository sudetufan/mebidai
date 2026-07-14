"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
} from "lucide-react";

import {
  getNotifications,
  markNotificationAsRead,
} from "@/lib/api";

type Notification = {
  id: number;
  type: string;
  sender_id: number;
  sender_username: string;
  post_id: number | null;
  comment_id: number | null;
  is_read: boolean;
  created_at: string;
};

export default function NotificationDropdown() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open]);

  async function handleNotificationClick(
    notification: Notification
  ) {
    try {
      if (!notification.is_read) {
        await markNotificationAsRead(notification.id);

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

      setOpen(false);

      if (notification.type === "follow") {
        router.push(`/profile/${notification.sender_id}`);
        router.refresh();
        return;
      }

    if (
        ["like", "comment", "mention"].includes(
            notification.type
        ) &&
        notification.post_id !== null
    ) {

        if (notification.comment_id !== null) {
            router.push(
                `/blog/${notification.post_id}#comment-${notification.comment_id}`
            );
        } else {
            router.push(
                `/blog/${notification.post_id}`
            );
        }

        router.refresh();
        return;
    }
    } catch (error) {
      console.error(error);
    }
  }

  function getNotificationMessage(type: string) {
    switch (type) {
      case "follow":
        return "started following you";

      case "like":
        return "liked your post";

      case "comment":
        return "commented on your post";

      case "mention":
        return "mentioned you in a comment";

      default:
        return "sent you a notification";
    }
  }

  function getRelativeTime(date: string) {
    const now = new Date();
    const created = new Date(date);

    const diff = Math.floor(
      (now.getTime() - created.getTime()) / 1000
    );

    if (diff < 60)
      return `${diff} second${
        diff !== 1 ? "s" : ""
      } ago`;

    const minutes = Math.floor(diff / 60);

    if (minutes < 60)
      return `${minutes} minute${
        minutes !== 1 ? "s" : ""
      } ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24)
      return `${hours} hour${
        hours !== 1 ? "s" : ""
      } ago`;

    const days = Math.floor(hours / 24);

    if (days < 7)
      return `${days} day${
        days !== 1 ? "s" : ""
      } ago`;

    return created.toLocaleDateString();
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "like":
        return (
          <Heart
            size={18}
            className="fill-red-500 text-red-500"
          />
        );

      case "comment":
        return (
          <MessageCircle
            size={18}
            className="text-sky-500"
          />
        );

      case "follow":
        return (
          <UserPlus
            size={18}
            className="text-green-500"
          />
        );

      case "mention":
        return (
          <AtSign
            size={18}
            className="text-orange-500"
          />
        );

      default:
        return (
          <Bell
            size={18}
            className="text-slate-400"
          />
        );
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        onClick={() => {
          if (!open) {
            loadNotifications();
          }

          setOpen(!open);
        }}
        className="
          relative
          rounded-full
          p-1
          transition
          hover:bg-slate-800
          hover:text-blue-400
        "
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-2
              -top-2
              flex
              h-5
              min-w-[20px]
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[10px]
              font-bold
              text-white
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
            z-50
            mt-3
            w-80
            overflow-hidden
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            shadow-2xl
          "
        >
          <div className="border-b border-slate-700 px-4 py-3">
            <h3 className="font-semibold text-white">
              Notifications
            </h3>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
                      {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`
                    flex
                    cursor-pointer
                    gap-3
                    border-b
                    border-slate-800
                    p-4
                    transition-all
                    hover:bg-slate-800/70
                    ${
                      !notification.is_read
                        ? "bg-blue-950/40"
                        : ""
                    }
                  `}
                >
                  <div
                    className="
                      mt-0.5
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-slate-800
                    "
                  >
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-5 text-white">
                      <span className="font-semibold">
                        {notification.sender_username}
                      </span>{" "}
                      {getNotificationMessage(
                        notification.type
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {getRelativeTime(
                        notification.created_at
                      )}
                    </p>
                  </div>

                  {!notification.is_read && (
                    <div
                      className="
                        mt-2
                        h-2.5
                        w-2.5
                        shrink-0
                        rounded-full
                        bg-blue-500
                      "
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div
              className="
                border-t
                border-slate-700
                px-4
                py-2
                text-center
                text-xs
                text-gray-400
              "
            >
              {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}