import BlogList from "@/components/BlogList";
import { getPosts } from "@/lib/api";

export default async function CategoryPage({
  params,
}: any) {
  const id = Number(params.id);

  const data = await getPosts(
    1,
    10,
    id
  );

  return (
    <main className="max-w-6xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        Category Posts
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