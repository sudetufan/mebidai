"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/api";

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createPost({
        title,
        content,
      });

      alert("Post created successfully!");

      router.push("/blog");
    } catch (error) {
      console.error(error);
      alert("Failed to create post.");
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-8">
        Create New Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded-lg h-64"
          placeholder="Write your article..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Publish
        </button>
      </form>
    </main>
  );
}