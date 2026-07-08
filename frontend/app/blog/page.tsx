export const dynamic = "force-dynamic";

import { serverFetch } from "@/lib/server-api";
import BlogList from "@/components/BlogList";

export default async function BlogPage() {
  const posts = await serverFetch("/posts/");

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Community Blog
      </h1>

      <BlogList initialPosts={posts} />
    </main>
  );
}