"use client";

import { useEffect, useState } from "react";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
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
            No users found.
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-lg border p-3"
              >
                {user.username}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}