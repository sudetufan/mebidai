import Link from "next/link";
import LikeButton from "./LikeButton";

type PostCardProps = {
  id: number;
  title: string;
  author?: string;
  content: string;
  likeCount: number;
  liked: boolean;
};

export default function PostCard({
  id,
  title,
  author,
  content,
  likeCount,
  liked
}: PostCardProps) {
  return (
    <Link href={`/blog/${id}`}>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border">

        <h2 className="text-2xl font-bold mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          👤 {author ?? "Anonymous"}
        </p>

        <p className="text-gray-700 mb-6 line-clamp-3">
          {content}
        </p>

        <div className="flex justify-between items-center">
          <LikeButton
            postId={id}
            initialLikes={likeCount}
            initiallyLiked={liked}
          />

          <span className="text-blue-600 font-semibold">
              Devamını Oku →
          </span>
        </div>
      </div>
    </Link>
  );
}