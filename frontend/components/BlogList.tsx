"use client";

import { useState } from "react";

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
};

type BlogListProps = {
  initialPosts: Post[];
};

export default function BlogList({
  initialPosts,
}: BlogListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState("");

  async function handleSearch() {
    const text = query.trim();

    if (text === "") {
      const allPosts = await getPosts();
      setPosts(allPosts);
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
          />
        ))
      )}
    </>
  );
}