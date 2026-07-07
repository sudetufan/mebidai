"use client";

import { useState } from "react";
import { likePost, unlikePost } from "@/lib/api";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  async function handleLike() {
    try {
      if (liked) {
        await unlikePost(postId);
        setLiked(false);
        setLikes((prev) => prev - 1);
      } else {
        await likePost(postId);
        setLiked(true);
        setLikes((prev) => prev + 1);
      }

      // 🔥 önemli kısım: sayfayı backend ile senkronla
      router.refresh();

    } catch (err) {
      console.error(err);
      alert("İşlem başarısız.");
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLike();
      }}
      className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-100"
    >
      {liked ? "❤️" : "🤍"} {likes}
    </button>
  );
}