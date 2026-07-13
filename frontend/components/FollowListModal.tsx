"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getFollowers, getFollowing } from "@/lib/api";

type FollowListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: "Followers" | "Following";
  userId: string;
};

type User = {
  id: number;
  username: string;
};

export default function FollowListModal({
  isOpen,
  onClose,
  title,
  userId,
}: FollowListModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadUsers() {
      setLoading(true);

      try {
        const data =
          title === "Followers"
            ? await getFollowers(userId)
            : await getFollowing(userId);

        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [isOpen, title, userId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {users.length} {title.toLowerCase()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 transition hover:text-black"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-500">
            Loading...
          </div>
        ) : users.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            {title === "Followers"
              ? "No followers yet."
              : "Not following anyone yet."}
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto pr-2">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                onClick={onClose}
                className="flex items-center justify-between rounded-xl border p-4 transition hover:border-slate-300 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {user.username}
                    </p>

                    <p className="text-sm text-gray-500">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  className="text-gray-400"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}