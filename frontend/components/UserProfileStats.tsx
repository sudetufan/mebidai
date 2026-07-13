"use client";

import { useState } from "react";
import {
  FileText,
  MessageSquare,
  Heart,
  User,
} from "lucide-react";

import FollowListModal from "./FollowListModal";

type Props = {
  profile: {
    id: number;
    post_count: number;
    comment_count: number;
    like_count: number;
    followers_count: number;
    following_count: number;
  };
};

export default function UserProfileStats({ profile }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<"Followers" | "Following">("Followers");

  const openFollowers = () => {
    setTitle("Followers");
    setIsOpen(true);
  };

  const openFollowing = () => {
    setTitle("Following");
    setIsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-2xl border p-5 text-center">
          <FileText className="mx-auto mb-3 text-blue-600" />
          <p className="text-3xl font-bold">{profile.post_count}</p>
          <p className="text-sm text-gray-500">Posts</p>
        </div>

        <div className="rounded-2xl border p-5 text-center">
          <MessageSquare className="mx-auto mb-3 text-green-600" />
          <p className="text-3xl font-bold">{profile.comment_count}</p>
          <p className="text-sm text-gray-500">Comments</p>
        </div>

        <div className="rounded-2xl border p-5 text-center">
          <Heart className="mx-auto mb-3 text-red-500" />
          <p className="text-3xl font-bold">{profile.like_count}</p>
          <p className="text-sm text-gray-500">Likes</p>
        </div>

        <button
          onClick={openFollowers}
          className="rounded-2xl border p-5 text-center hover:bg-gray-50 transition"
        >
          <User className="mx-auto mb-3 text-indigo-600" />
          <p className="text-3xl font-bold">{profile.followers_count}</p>
          <p className="text-sm text-gray-500">Followers</p>
        </button>

        <button
          onClick={openFollowing}
          className="rounded-2xl border p-5 text-center hover:bg-gray-50 transition"
        >
          <User className="mx-auto mb-3 text-orange-600" />
          <p className="text-3xl font-bold">{profile.following_count}</p>
          <p className="text-sm text-gray-500">Following</p>
        </button>
      </div>

      <FollowListModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        userId={String(profile.id)}
      />
    </>
  );
}