"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  updatePost,
  getPost,
  getCategories,
  ApiError,
} from "@/lib/api";

import {
  Save,
} from "lucide-react";

type Category = {
  id: number;
  name: string;
};

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const post = await getPost(String(id));
        const categoryData = await getCategories();

        setTitle(post.title);
        setContent(post.content);
        setCategoryId(post.category_id);
        setCategories(categoryData);

      } catch (error) {
        if (error instanceof ApiError) {
          alert(error.message);
        } else {
          alert("Post could not be loaded.");
        }
      }
    }

    loadData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    if (!categoryId) {
      alert("Please select a category");
      return;
    }

    try {
      await updatePost(id, {
        title,
        content,
        category_id: categoryId,
      });

      alert("Post updated successfully!");

      router.push("/dashboard");

    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Edit Post
        </h1>

        <p className="mt-3 text-gray-500">
          Update your article and keep your content fresh.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border bg-white p-8 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Title
          </label>

          <input
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Content
          </label>

          <textarea
            className="h-64 w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Category
          </label>

          <select
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
        >
          <Save size={18} />
          Update Post
        </button>
      </form>
    </main>
  );
}