"use client";

import { useState } from "react";
import {
  FileText,
  MessageSquare,
  Heart,
  Users,
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

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border p-5 text-center">
          <FileText className="mx-auto mb-3 text-blue-600" size={28} />

          <p className="text-3xl font-bold">{profile.post_count}</p>

          <p className="mt-2 text-sm text-gray-500">
            Posts
          </p>
        </div>

        <div className="rounded-2xl border p-5 text-center">
          <MessageSquare
            className="mx-auto mb-3 text-green-600"
            size={28}
          />

          <p className="text-3xl font-bold">{profile.comment_count}</p>

          <p className="mt-2 text-sm text-gray-500">
            Comments
          </p>
        </div>

        <div className="rounded-2xl border p-5 text-center">
          <Heart
            className="mx-auto mb-3 text-red-500"
            size={28}
          />

          <p className="text-3xl font-bold">{profile.like_count}</p>

          <p className="mt-2 text-sm text-gray-500">
            Likes
          </p>
        </div>

        <button
          onClick={() => {
            setTitle("Followers");
            setIsOpen(true);
          }}
          className="rounded-2xl border p-5 text-center transition hover:bg-gray-50"
        >
          <Users
            className="mx-auto mb-3 text-indigo-600"
            size={28}
          />

          <p className="text-3xl font-bold">
            {profile.followers_count}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Followers
          </p>
        </button>

        <button
          onClick={() => {
            setTitle("Following");
            setIsOpen(true);
          }}
          className="rounded-2xl border p-5 text-center transition hover:bg-gray-50"
        >
          <Users
            className="mx-auto mb-3 text-orange-600"
            size={28}
          />

          <p className="text-3xl font-bold">
            {profile.following_count}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Following
          </p>
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