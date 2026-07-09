import Link from "next/link";
import LikeButton from "./LikeButton";
import { User } from "lucide-react";

type PostCardProps = {
  id: number;
  title: string;
  author?: string;
  content: string;
  likeCount: number;
  liked: boolean;
  category?: {
    id: number;
    name: string;
  };
};

export default function PostCard({
  id,
  title,
  author,
  content,
  likeCount,
  liked,
  category,
}: PostCardProps) {
  return (
    <Link href={`/blog/${id}`}>
      <article className="group bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 cursor-pointer">

        {category && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100 mb-4">
            {category.name}
          </span>
        )}

        <h2 className="mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
          {title}
        </h2>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <User size={16} />
          <span>{author ?? "Anonymous"}</span>
        </div>

        <p className="mb-6 line-clamp-3 leading-7 text-gray-600">
          {content}
        </p>

        <div className="flex items-center justify-between border-t pt-4">
          <LikeButton
            postId={id}
            initialLikes={likeCount}
            initiallyLiked={liked}
          />

          <span className="font-semibold text-blue-600 transition-transform duration-200 group-hover:translate-x-1">
            Read More →
          </span>
        </div>

      </article>
    </Link>
  );
}