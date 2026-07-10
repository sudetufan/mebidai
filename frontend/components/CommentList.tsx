"use client";

import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import {
  updateComment,
  ApiError,
} from "@/lib/api";

type Props = {
  comments: any[];
};

export default function CommentList({ comments }: Props) {
  const { user } = useAuth();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [content, setContent] = useState("");

  async function handleSave() {
    if (!editingId || !content.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      await updateComment(
        editingId,
        content
      );

      setEditingId(null);

      window.location.reload();

    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert("Comment could not be updated.");
      }
    }
  }

  return (
    <>
      {comments.length === 0 ? (
        <p className="text-gray-500">
          No comments yet.
        </p>
      ) : (
        comments.map((comment: any) => {
          const canEdit =
            user &&
            (
              user.role === "admin" ||
              user.id === comment.user.id
            );

          return (
            <div
              key={comment.id}
              className="bg-gray-100 rounded-lg p-4 mb-3"
            >
              <p className="text-sm font-semibold mb-2">
                {comment.user.username}
              </p>

              {editingId === comment.id ? (
                <>
                  <textarea
                    className="w-full border rounded-lg p-2"
                    value={content}
                    onChange={(e) =>
                      setContent(e.target.value)
                    }
                  />

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    {comment.content}
                  </p>

                  {canEdit && (
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setContent(comment.content);
                      }}
                      className="mt-3 text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })
      )}
    </>
  );
}