import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import DeletePostButton from "@/components/DeletePostButton";

import {
  FileText,
  MessageCircle,
  Heart,
  Plus,
  Eye,
  Pencil,
} from "lucide-react";

export default async function DashboardPage() {
  const profile = await serverFetch("/users/profile");
  const posts = await serverFetch("/users/profile/posts");

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Welcome back 
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your posts and keep track of your activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <FileText className="mb-4 h-8 w-8 text-blue-600" />

          <p className="text-gray-500">
            Posts
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {profile.post_count}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <MessageCircle className="mb-4 h-8 w-8 text-emerald-600" />

          <p className="text-gray-500">
            Comments
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {profile.comment_count}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <Heart className="mb-4 h-8 w-8 text-rose-600" />

          <p className="text-gray-500">
            Likes
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {profile.like_count}
          </h2>
        </div>
      </div>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            My Posts
          </h2>

          <Link
            href="/create-post"
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-700"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />

            <h3 className="text-xl font-semibold">
              No posts yet
            </h3>

            <p className="mt-2 text-gray-500">
              You haven't created any posts yet. Start sharing your knowledge with the community.
            </p>

            <Link
              href="/create-post"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-700"
            >
              <Plus className="h-4 w-4" />
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post: any) => (
              <div
                key={post.id}
                className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="mb-2 text-xl font-bold">
                  {post.title}
                </h3>

                <p className="line-clamp-2 text-gray-600">
                  {post.content}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-6">
                  <Link
                    href={`/blog/${post.id}`}
                    className="flex items-center gap-1 text-blue-600 transition hover:text-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>

                  <Link
                    href={`/edit-post/${post.id}`}
                    className="flex items-center gap-1 text-green-600 transition hover:text-green-700"
                  >
                    <Pencil className="h-4 w-4" />
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