import PostCard from "../../components/PostCard";
import { getPosts } from "../../lib/api";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Community Blog
      </h1>

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