import PostCard from "../../components/PostCard";

const posts = [
  {
    id: 1,
    title: "React Nedir?",
    author: "Sude",
    content: "React modern frontend kütüphanesidir...",
  },
  {
    id: 2,
    title: "Next.js App Router",
    author: "Ali",
    content: "App Router ile dosya tabanlı routing...",
  },
  {
    id: 3,
    title: "FastAPI Giriş",
    author: "Ayşe",
    content: "Python ile hızlı backend geliştirme...",
  },
];

export default function BlogPage() {
  return (
  <main className="max-w-4xl mx-auto py-10 px-6">
    <h1 className="text-4xl font-bold mb-8">
      Community Posts
    </h1>

    {posts.map((post) => (
      <PostCard
        key={post.id}
        title={post.title}
        author={post.author}
        content={post.content}
      />
    ))}
  </main>
);
}