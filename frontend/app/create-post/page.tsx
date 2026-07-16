"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createPost,
  getCategories,
  ApiError,
} from "@/lib/api";

import {
  Send,
} from "lucide-react";

type Category = {
  id: number;
  name: string;
};

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        setCategories(data);

        if (data.length > 0) {
          setCategoryId(data[0].id);
        }

      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error("Failed to load categories.");
        }
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    try {
      await createPost({
        title,
        content,
        category_id: categoryId,
      });

      toast.success("Post created successfully!");

      setTimeout(() => {
        router.push("/blog");
      }, 1000);

    } catch (error) {
      if (error instanceof ApiError) {
        if (
          error instanceof ApiError &&
          error.status === 401
        ) {
          toast.error("Please log in to create a post.");

          setTimeout(() => {
            router.push("/login");
          }, 1500);

          return;
        }

        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Create New Post
        </h1>

        <p className="mt-3 text-gray-500">
          Share your knowledge and ideas with the community.
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
            placeholder="Enter post title..."
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
            placeholder="Write your article..."
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
          <Send size={18} />
          Publish Post
        </button>
      </form>
    </main>
  );
}