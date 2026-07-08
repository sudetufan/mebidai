import Link from "next/link";
import LikeButton from "./LikeButton";

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
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border">

        {category && (
          <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-4">
            {category.name}
          </span>
        )}

        <h2 className="text-2xl font-bold mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          {author ?? "Anonymous"}
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
            Read More →
          </span>

        </div>

      </div>
    </Link>
  );
}