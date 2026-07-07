import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import {
  User,
  Mail,
  Shield,
  FileText,
  MessageSquare,
} from "lucide-react";

export default async function ProfilePage() {
  const profile = await serverFetch("/users/profile");
  const posts = await serverFetch("/users/profile/posts");

  return (
    <main className="max-w-5xl mx-auto py-12 px-6 space-y-10">

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-slate-900 text-white px-8 py-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <User size={40} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {profile.username}
              </h1>

              <p className="text-slate-300">
                {profile.email}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">

            <div className="flex gap-3 items-center">
              <Mail size={20} className="text-slate-500" />

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-semibold">
                  {profile.email}
                </p>
              </div>
            </div>


            <div className="flex gap-3 items-center">
              <Shield size={20} className="text-slate-500" />

              <div>
                <p className="text-sm text-gray-500">
                  Role
                </p>

                <p className="font-semibold capitalize">
                  {profile.role}
                </p>
              </div>
            </div>

          </div>


          <div className="grid grid-cols-2 gap-5">

            <div className="border rounded-xl p-6 text-center">
              <FileText
                size={28}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-3xl font-bold">
                {profile.post_count}
              </p>

              <p className="text-gray-500">
                Posts
              </p>
            </div>


            <div className="border rounded-xl p-6 text-center">
              <MessageSquare
                size={28}
                className="mx-auto mb-3 text-slate-700"
              />

              <p className="text-3xl font-bold">
                {profile.comment_count}
              </p>

              <p className="text-gray-500">
                Comments
              </p>
            </div>

          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6">
          My Posts
        </h2>


        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            You haven't shared any posts yet.
          </div>
        ) : (

          <div className="space-y-5">

            {posts.map((post: any) => (

              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block bg-white rounded-xl shadow hover:shadow-lg transition p-6"
              >

                <h3 className="text-xl font-semibold mb-2">
                  {post.title}
                </h3>


                <p className="text-gray-600 line-clamp-2">
                  {post.content}
                </p>


                <div className="mt-4 text-sm text-gray-500 flex gap-6">
                  <span>
                    {post.like_count} Likes
                  </span>
                </div>

              </Link>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}