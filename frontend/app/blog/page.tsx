export const dynamic = "force-dynamic";

import { serverFetch } from "@/lib/server-api";
import BlogList from "@/components/BlogList";

type BlogPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function BlogPage({
  searchParams,
}: BlogPageProps) {
  const params = await searchParams;

  const page = Number(params.page ?? "1");

  const data = await serverFetch(
    `/posts/?page=${page}&limit=10`
  );

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Community Blog
      </h1>

      <BlogList
        initialPosts={data.posts}
        initialPage={data.page}
        total={data.total}
        limit={data.limit}
      />
    </main>
  );
}