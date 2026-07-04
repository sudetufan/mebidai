import PostCard from "../../components/PostCard";
import { getPosts } from "../../lib/api";

const categories = [
  "Frontend",
  "Backend",
  "AI",
  "Mobile",
  "DevOps",
];

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Community Blog
      </h1>

      <input
        type="text"
        placeholder="🔍 Search posts..."
        className="w-full border rounded-xl p-4 mb-6"
      />

      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-2 bg-slate-200 rounded-full hover:bg-blue-600 hover:text-white transition"
          >
            {category}
          </button>
        ))}
      </div>

      {posts.map((post: any) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          author="Anonymous"
          content={post.content}
        />
      ))}
    </main>
  );
}