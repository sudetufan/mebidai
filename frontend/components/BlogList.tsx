"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import PostCard from "./PostCard";
import { getPosts, searchPosts } from "@/lib/api";

type Post = {
  id: number;
  title: string;
  content: string;
  like_count: number;
  liked: boolean;

  user: {
    id: number;
    username: string;
  };

  category?: {
    id: number;
    name: string;
  };
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

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  async function handleSearch() {
    const text = query.trim();

    if (text === "") {
      const data = await getPosts();
      setPosts(data.posts);
      return;
    }

    const results = await searchPosts(text);
    setPosts(results);
  }

  return (
    <>
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-3"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Total Posts: {total} | Page: {initialPage} / {totalPages}
      </p>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No posts found.
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            author={post.user.username}
            content={post.content}
            likeCount={post.like_count}
            liked={post.liked}
            category={post.category}
          />
        ))
      )}

      <div className="flex justify-center items-center gap-4 mt-10">
        {initialPage > 1 ? (
          <Link
            href={`/blog?page=${initialPage - 1}`}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
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
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
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