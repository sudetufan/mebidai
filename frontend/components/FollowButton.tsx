"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  followUser,
  unfollowUser,
  ApiError,
} from "@/lib/api";

export default function FollowButton({
  userId,
  initialFollowing,
}: {
  userId: string;
  initialFollowing: boolean;
}) {
  const router = useRouter();

  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    try {
      setLoading(true);

      if (following) {
        await unfollowUser(userId);
        setFollowing(false);
      } else {
        await followUser(userId);
        setFollowing(true);
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push("/login");
        return;
      }

      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`rounded-xl px-6 py-3 font-semibold transition ${
        following
          ? "bg-white text-slate-900 hover:bg-slate-200"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {loading
        ? "Loading..."
        : following
        ? "Following"
        : "Follow"}
    </button>
  );
}