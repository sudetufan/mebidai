import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import DeletePostButton from "@/components/DeletePostButton";

export default async function DashboardPage() {
  const profile = await serverFetch("/users/profile");
  const posts = await serverFetch("/users/profile/posts");

  return (
    <main className="max-w-6xl mx-auto py-10 px-6 space-y-10">

      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>


      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold">
            Posts
          </h2>

          <p className="text-4xl mt-3">
            {profile.post_count}
          </p>
        </div>


        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold">
            Comments
          </h2>

          <p className="text-4xl mt-3">
            {profile.comment_count}
          </p>
        </div>


        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold">
            Likes
          </h2>

          <p className="text-4xl mt-3">
            {profile.like_count}
          </p>
        </div>

      </div>


      <section>

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            My Posts
          </h2>


          <Link
            href="/create-post"
            className="bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-slate-700"
          >
            Create Post
          </Link>

        </div>


        {posts.length === 0 ? (

          <div className="bg-white shadow rounded-xl p-8 text-center text-gray-500">
            You haven't created any posts yet.
          </div>

        ) : (

          <div className="space-y-5">

            {posts.map((post: any) => (

              <div
                key={post.id}
                className="bg-white shadow rounded-xl p-6"
              >

                <h3 className="text-xl font-bold mb-2">
                  {post.title}
                </h3>


                <p className="text-gray-600 line-clamp-2">
                  {post.content}
                </p>


                <div className="mt-4 flex gap-5 items-center">

                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>


                  <Link
                    href={`/edit-post/${post.id}`}
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </Link>


                  <DeletePostButton
                    postId={post.id}
                  />

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}