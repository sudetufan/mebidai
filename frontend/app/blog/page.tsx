import PostCard from "../../components/PostCard";

const posts = [
  {
    id: 1,
    title: "React Nedir?",
    author: "Sude",
    content:
      "React modern frontend geliştirmek için kullanılan popüler bir JavaScript kütüphanesidir.",
  },
  {
    id: 2,
    title: "Next.js App Router",
    author: "Ali",
    content:
      "App Router sayesinde dosya tabanlı routing çok daha güçlü ve kullanışlı hale geliyor.",
  },
  {
    id: 3,
    title: "FastAPI Giriş",
    author: "Ayşe",
    content:
      "FastAPI, Python ile yüksek performanslı REST API geliştirmek için kullanılan modern bir framework'tür.",
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
          id={post.id}
          title={post.title}
          author={post.author}
          content={post.content}
        />
      ))}
    </main>
  );
}