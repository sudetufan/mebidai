"use client";

import { useState, useEffect } from "react";

import { searchUsers } from "@/lib/api";

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

    const response = await fetch(
      "http://localhost:8000/api/v1/comments/",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          post_id: postId,
        }),
      }
    );

    if (response.ok) {
      setContent("");
      window.location.reload();
    } else {
      alert("Yorum eklenemedi.");
    }
  }


  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">

      <div className="relative">

        <textarea
          className="w-full border rounded-lg p-3"
          placeholder="Yorum yaz..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />


        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 bottom-full mb-2 w-full bg-white border rounded-lg shadow-lg overflow-hidden">

            {suggestions.map((user) => (
              <button
                type="button"
                key={user.id}
                onClick={() => selectUser(user)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                @{user.username}
              </button>
            ))}

          </div>
        )}

      </div>


      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        Yorum Yap
      </button>

    </form>
  );
}