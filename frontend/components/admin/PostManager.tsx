"use client";

import { useState } from "react";

import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "sonner";
import { AdminPost } from "@/types";

const API_URL = "http://localhost:8000/api/v1";

type Props = {
  posts: AdminPost[];
  onRefresh: () => void;

  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  query: string;
  onQueryChange: (value: string) => void;
};

export default function PostManager({
  posts,
  onRefresh,
  page,
  totalPages,
  onPageChange,
  query,
  onQueryChange,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedPost, setSelectedPost] =
    useState<AdminPost | null>(null);

  async function deletePost() {
    if (!selectedPost) return;

    const response = await fetch(
      `${API_URL}/admin/posts/${selectedPost.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      setConfirmOpen(false);
      setSelectedPost(null);

      toast.success("Post deleted successfully.");

      onRefresh();
    } else {
      toast.error("Post could not be deleted.");
    }
  }

  return (
    <>
      <div className="mt-10 mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">
          Posts
        </h2>

        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => {
            onPageChange(1);
            onQueryChange(e.target.value);
          }}
          className="w-72 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {posts.map((post) => (
        <div
          key={post.id}
          className="mb-3 flex items-center justify-between rounded-xl bg-white p-4 shadow"
        >
          <div>
            <p className="font-bold">
              {post.title}
            </p>

            <p className="text-gray-500">
              {post.user.username}
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedPost(post);
              setConfirmOpen(true);
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-medium">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete Post"
        description={`Are you sure you want to delete "${
          selectedPost?.title ?? ""
        }"? This action cannot be undone.`}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedPost(null);
        }}
        onConfirm={deletePost}
      />
    </>
  );
}