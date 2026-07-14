"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  searchUsers,
  createComment,
  ApiError,
} from "@/lib/api";

type Props = {
  postId: number;
};

type User = {
  id: number;
  username: string;
};

export default function CommentForm({ postId }: Props) {
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function findUsers() {
      const match = content.match(/@([a-zA-Z0-9_]+)$/);

      if (!match) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const query = match[1];

      if (query.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const users = await searchUsers(query);

        setSuggestions(users.slice(0, 5));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }

    findUsers();
  }, [content]);

  function selectUser(user: User) {
    const newText = content.replace(
      /@([a-zA-Z0-9_]+)$/,
      `@${user.username} `
    );

    setContent(newText);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      await createComment({
        content,
        post_id: postId,
      });

      setContent("");
      window.location.reload();
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        router.push("/login");
        return;
      }

      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }

      alert("Comment could not be added.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="relative">
        <textarea
          className="w-full border rounded-lg p-3"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 bottom-full mb-2 w-full overflow-hidden rounded-lg border bg-white shadow-lg">
            {suggestions.map((user) => (
              <button
                type="button"
                key={user.id}
                onClick={() => selectUser(user)}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                @{user.username}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
      >
        Comment
      </button>
    </form>
  );
}