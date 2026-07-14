"use client";

import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import {
  updateComment,
  createComment,
  deleteComment,
  ApiError,
} from "@/lib/api";

import MentionText from "@/components/MentionText";
type Props = {
  comments: any[];
};
export default function CommentList({ comments }: Props) {

  const { user } = useAuth();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [content, setContent] = useState("");

  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

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
  async function handleReply(
    comment: any
  ) {
    if (!replyContent.trim()) {
      return;
    }
    try {

      await createComment({
        content: replyContent,
        post_id: comment.post_id,
        parent_id: comment.id,
      });

      setReplyContent("");
      setReplyingId(null);

      window.location.reload();

    } catch(error) {
      alert("Reply could not be added.");
    }
  }
  function renderComment(
    comment: any,
    level = 0
  ) {

    const canEdit =
      user &&
      (
        user.role === "admin" ||
        user.id === comment.user.id
      );
    return (
      <div
        key={comment.id}
        id={`comment-${comment.id}`}
        className="mb-3"
        style={{
          marginLeft: `${level * 32}px`
        }}
      >
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm font-semibold mb-2">
            {comment.user.username}
          </p>
          {editingId === comment.id ? (
            <>
              <textarea
                className="w-full border rounded-lg p-2"
                value={content}
                onChange={(e)=>
                  setContent(e.target.value)
                }
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={()=>{
                    setEditingId(null);
                  }}
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
              <MentionText text={comment.content}/>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={()=>{
                    setReplyingId(comment.id);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Reply
                </button>
                {canEdit && (

                  <button
                    onClick={()=>{
                      setEditingId(comment.id);
                      setContent(comment.content);
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                )}
                {canEdit && (

                  <button
                    onClick={() =>
                      handleDelete(comment.id)
                    }
                    className="
                        text-red-600
                        hover:underline
                        text-sm
                        "
                    >
                        Delete
                    </button>

                )}
              </div>
              {replyingId === comment.id && (

                <div className="mt-3">
                  <textarea
                    className="w-full border rounded-lg p-2"
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e)=>
                      setReplyContent(e.target.value)
                    }
                  />
                  <button
                    onClick={()=>
                      handleReply(comment)
                    }
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Reply
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {
          comment.replies &&
          comment.replies.length > 0 &&
          comment.replies.map((reply:any)=>
            renderComment(
              reply,
              level + 1
            )
          )
        }
      </div>
    );
  }
  return (
    <>
      {comments.length === 0 ? (

        <p className="text-gray-500">
          No comments yet.
        </p>
      ) : (
        comments.map((comment:any)=>
          renderComment(comment)
        )
      )}
    </>
  );

}

async function handleDelete(
  commentId: number
) {
  const confirmDelete = window.confirm(
    "Delete this comment?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteComment(commentId);

    window.location.reload();

  } catch (error) {

    if (error instanceof ApiError) {
      alert(error.message);
    } else {
      alert(
        "Comment could not be deleted."
      );
    }
  }
}