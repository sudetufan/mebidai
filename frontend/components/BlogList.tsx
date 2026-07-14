"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";

import PostCard from "./PostCard";

import {
  getPosts,
  searchPosts,
  getCategories,
  ApiError,
} from "@/lib/api";

type Post = {
  id: number;
  title: string;
  content: string;
  like_count: number;
  liked: boolean;
  user_id: number;
  user: {
    id: number;
    username: string;
  };
  category?: {
    id: number;
    name: string;
  };
};

type Category = {
  id: number;
  name: string;
};

type BlogListProps = {
  initialPosts: Post[];
  initialPage: number;
  total: number;
  limit: number;
};

export default function BlogList({
  initialPosts,
  initialPage,
  total,
  limit,
}: BlogListProps) {
  const [posts, setPosts] = useState(initialPosts);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    setPosts(initialPosts);

    async function loadCategories() {
      try {
        const data = await getCategories();

        setCategories(data);

      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("Failed to load categories.");
        }
      }
    }

    loadCategories();
  }, [initialPosts]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        if (query.trim() === "") {
          const data = await getPosts(
            1,
            limit,
            selectedCategory
          );

          setPosts(data.posts);

        } else {
          const results = await searchPosts(
            query,
            selectedCategory
          );

          setPosts(results);
        }

      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("Failed to load posts.");
        }

      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);

  }, [query, selectedCategory, limit]);

  function handleCategoryChange(categoryId?: number) {
    setSelectedCategory(categoryId);
  }

  const SkeletonCard = () => (
    <div className="mb-6 animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 h-6 w-24 rounded bg-gray-200" />
      <div className="mb-3 h-8 w-2/3 rounded bg-gray-200" />
      <div className="mb-2 h-4 w-40 rounded bg-gray-200" />
      <div className="mb-2 h-4 w-full rounded bg-gray-200" />
      <div className="mb-2 h-4 w-5/6 rounded bg-gray-200" />

      <div className="mt-6 flex justify-between">
        <div className="h-6 w-16 rounded bg-gray-200" />
        <div className="h-6 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );

  return (
    <>
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => handleCategoryChange(undefined)}
          className={`rounded-full border px-4 py-2 transition ${
            selectedCategory === undefined
              ? "border-blue-600 bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`rounded-full border px-4 py-2 transition ${
              selectedCategory === category.id
                ? "border-blue-600 bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <p className="mb-4 text-sm text-gray-500">
        Total Posts: {total} | Page: {initialPage} / {totalPages}
      </p>

      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16">
          <SearchX className="mb-4 h-12 w-12 text-gray-400" />

          <h3 className="text-xl font-semibold text-gray-800">
            No posts found
          </h3>

          <p className="mt-2 max-w-sm text-center text-gray-500">
            We couldn't find any posts matching your search or selected category.
          </p>

          <button
            onClick={() => {
              setQuery("");
              setSelectedCategory(undefined);
            }}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            author={post.user.username}
            authorId={post.user_id}
            content={post.content}
            likeCount={post.like_count}
            liked={post.liked}
            category={post.category}
          />
        ))
      )}

      <div className="mt-10 flex items-center justify-center gap-4">
        {initialPage > 1 ? (
          <Link
            href={`/blog?page=${initialPage - 1}`}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            ← Previous
          </Link>
        ) : (
          <span className="px-4 py-2 text-gray-400">
            ← Previous
          </span>
        )}

        <span className="font-semibold">
          Page {initialPage} of {totalPages}
        </span>

        {initialPage < totalPages ? (
          <Link
            href={`/blog?page=${initialPage + 1}`}
            className="rounded-lg border px-4 py-2 hover:bg-gray-100"
          >
            Next →
          </Link>
        ) : (
          <span className="px-4 py-2 text-gray-400">
            Next →
          </span>
        )}
      </div>
    </>
  );
}