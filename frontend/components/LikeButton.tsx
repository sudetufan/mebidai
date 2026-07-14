"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

import {
  likePost,
  unlikePost,
  ApiError,
} from "@/lib/api";

type LikeButtonProps = {
  postId: number;
  initialLikes: number;
  initiallyLiked: boolean;
};

export default function LikeButton({
  postId,
  initialLikes,
  initiallyLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initiallyLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLike() {
    try {
      setLoading(true);

      if (liked) {
        await unlikePost(postId);

        setLiked(false);
        setLikes((prev) => prev - 1);
      } else {
        await likePost(postId);

        setLiked(true);
        setLikes((prev) => prev + 1);
      }

      router.refresh();
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        router.push("/login");
        return;
      }

      alert("Operation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLike();
      }}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg border px-4 py-2 transition hover:bg-gray-100 disabled:opacity-50"
    >
      <Heart
        size={20}
        className={
          liked
            ? "fill-red-500 text-red-500"
            : "text-gray-400"
        }
      />

      <span>{likes}</span>
    </button>
  );
}