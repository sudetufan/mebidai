"use client";

import { useState } from "react";
import { likePost, unlikePost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

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


      // Sync page with backend response
      router.refresh();


    } catch (err) {
      console.error(err);
      alert("Operation failed.");
    }
  }


  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLike();
      }}
      className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100 transition"
    >

      <Heart
        size={20}
        className={
          liked
            ? "fill-red-500 text-red-500"
            : "text-gray-400"
        }
      />

      <span>
        {likes}
      </span>

    </button>
  );
}