"use client";

import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

const API_URL = "http://localhost:8000/api/v1";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

type Props = {
  users: User[];
  onRefresh: () => void;
};

export default function UserManager({
  users,
  onRefresh,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  async function deleteUser() {
    if (!selectedUser) return;

    const response = await fetch(
      `${API_URL}/admin/users/${selectedUser.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      setConfirmOpen(false);
      setSelectedUser(null);
      onRefresh();
    } else {
      alert("User could not be deleted.");
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-4">
        Users
      </h2>

      {users.map((user) => (
        <div
          key={user.id}
          className="mb-3 flex items-center justify-between rounded-xl bg-white p-4 shadow"
        >
          <div>
            <p className="font-bold">
              {user.username}
            </p>

            <p className="text-gray-500">
              {user.email}
            </p>

            <span
              className={
                user.role === "admin"
                  ? "font-semibold text-red-600"
                  : "text-gray-600"
              }
            >
              {user.role}
            </span>
          </div>

          {user.role !== "admin" && (
            <button
              onClick={() => {
                setSelectedUser(user);
                setConfirmOpen(true);
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      ))}

      <ConfirmModal
        open={confirmOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${
          selectedUser?.username ?? "this user"
        }? This action cannot be undone.`}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={deleteUser}
      />
    </>
  );
}