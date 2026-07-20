"use client";

import { useState } from "react";

import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "sonner";
import { Comment } from "@/types";

const API_URL = "http://localhost:8000/api/v1";

type Props = {
  comments: Comment[];
  onRefresh: () => void;

  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  query: string;
  onQueryChange: (value: string) => void;
};

export default function CommentManager({
  comments,
  onRefresh,
  page,
  totalPages,
  onPageChange,
  query,
  onQueryChange,
}: Props) {
  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [selectedComment, setSelectedComment] =
    useState<Comment | null>(null);

  async function deleteComment() {
    if (!selectedComment) return;

    const response = await fetch(
      `${API_URL}/admin/comments/${selectedComment.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      setConfirmOpen(false);
      setSelectedComment(null);

      toast.success(
        "Comment deleted successfully."
      );

      onRefresh();
    } else {
      toast.error(
        "Comment could not be deleted."
      );
    }
  }

  return (
    <>
      <div className="mt-10 mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">
          Comments
        </h2>

        <input
          type="text"
          placeholder="Search comments..."
          value={query}
          onChange={(e) => {
            onPageChange(1);
            onQueryChange(e.target.value);
          }}
          className="w-72 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="mb-3 flex items-center justify-between rounded-xl bg-white p-4 shadow"
        >
          <div className="max-w-3xl">
            <p className="break-words">
              {comment.content}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {comment.user.username}
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedComment(comment);
              setConfirmOpen(true);
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Delete
          </button>
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
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedComment(null);
        }}
        onConfirm={deleteComment}
      />
    </>
  );
}