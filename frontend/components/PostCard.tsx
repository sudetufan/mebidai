import Link from "next/link";

type PostCardProps = {
  id: number;
  title: string;
  author?: string;
  content: string;
};

export default function PostCard({
  id,
  title,
  author,
  content,
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
          <span className="text-blue-600 font-semibold">
            Devamını Oku →
          </span>
        </div>
      </div>
    </Link>
  );
}