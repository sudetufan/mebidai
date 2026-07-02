type PostCardProps = {
  title: string;
  author: string;
  content: string;
};

export default function PostCard({
  title,
  author,
  content,
}: PostCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-xl transition">
      <h2 className="text-2xl font-bold mb-2">
        {title}
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        👤 {author}
      </p>

      <p className="text-gray-700 mb-4">
        {content}
      </p>

      <div className="flex gap-6 text-gray-500 text-sm">
        <span>❤️ 12</span>
        <span>💬 5</span>
      </div>
    </div>
  );
}