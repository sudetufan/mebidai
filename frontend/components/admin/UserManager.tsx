"use client";

import { useState } from "react";

import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "sonner";
import { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  users: User[];
  onRefresh: () => void;

  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  query: string;
  onQueryChange: (value: string) => void;
};

export default function UserManager({
  users,
  onRefresh,
  page,
  totalPages,
  onPageChange,
  query,
  onQueryChange,
}: Props) {
  const [confirmOpen, setConfirmOpen] =
    useState(false);

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
      toast.error("User could not be deleted.");
    }
  }

  return (
    <>
      <h2 className="mt-10 mb-4 text-2xl font-bold">
        Users
      </h2>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          onPageChange(1);
          onQueryChange(e.target.value);
        }}
        placeholder="Search users..."
        className="mb-5 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

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

            <span>{user.role}</span>
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

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-medium">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${
          selectedUser?.username ??
          "this user"
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