import PostCard from "../../components/PostCard";

const posts = [
  {
    id: 1,
    title: "React Nedir?",
    author: "Sude",
    content:
      "React modern frontend geliştirmek için kullanılan popüler JavaScript kütüphanesidir.",
  },
  {
    id: 2,
    title: "FastAPI Authentication",
    author: "Ali",
    content:
      "JWT Authentication nasıl yapılır? Bu yazıda adım adım anlatıyoruz.",
  },
  {
    id: 3,
    title: "Docker Compose",
    author: "Ayşe",
    content:
      "Backend ve PostgreSQL'i tek komutla ayağa kaldırmayı öğrenelim.",
  },
];

const categories = [
  "Frontend",
  "Backend",
  "AI",
  "Mobile",
  "DevOps",
];

export default function BlogPage() {
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

      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          author={post.author}
          content={post.content}
        />
      ))}
    </main>
  );
}