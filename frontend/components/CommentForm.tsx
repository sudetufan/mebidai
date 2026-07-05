"use client";

import { useState } from "react";

type Props = {
  postId: number;
};

export default function CommentForm({ postId }: Props) {
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/comments/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          post_id: postId,
        }),
      }
    );

    if (response.ok) {
      alert("Yorum eklendi!");
      setContent("");
      window.location.reload();
    } else {
      alert("Yorum eklenemedi.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <textarea
        className="w-full border rounded-lg p-3"
        placeholder="Yorum yaz..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        Yorum Yap
      </button>
    </form>
  );
}