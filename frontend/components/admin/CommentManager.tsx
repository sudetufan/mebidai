"use client";

import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

const API_URL = "http://localhost:8000/api/v1";

type Comment = {
  id: number;
  content: string;
  user: {
    username: string;
  };
};

type Props = {
  comments: Comment[];
  onRefresh: () => void;
};

export default function CommentManager({
  comments,
  onRefresh,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
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
      onRefresh();
    } else {
      alert("Comment could not be deleted.");
    }
  }

  return (
    <>
      <h2 className="mt-10 mb-4 text-2xl font-bold">
        Comments
      </h2>

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