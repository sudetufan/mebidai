"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ConfirmModal from "@/components/ConfirmModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DeletePostButton({
  postId,
}: {
  postId: number;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  async function handleDelete() {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Post deleted successfully.");

        setOpen(false);

        router.refresh();

        return;
      }

      if (response.status === 401) {
        toast.error("Please log in first.");

        setOpen(false);

        setTimeout(() => {
          router.push("/login");
        }, 1500);

        return;
      }

      if (response.status === 403) {
        toast.error(
          "You are not allowed to delete this post."
        );

        setOpen(false);

        return;
      }

      toast.error("Post could not be deleted.");

      setOpen(false);

    } catch {
      toast.error("Something went wrong.");

      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-800"
      >
        Delete
      </button>

      <ConfirmModal
        open={open}
        title="Delete Post"
        description="Are you sure you want to delete this post?"
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}