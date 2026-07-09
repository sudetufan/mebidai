import Link from "next/link";
import { serverFetch } from "@/lib/server-api";

import {
  Mail,
  Shield,
  FileText,
  MessageSquare,
  Heart,
  User,
} from "lucide-react";


export default async function ProfilePage() {
  const profile = await serverFetch("/users/profile");
  const posts = await serverFetch("/users/profile/posts");


  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">


      <section className="overflow-hidden rounded-3xl bg-white shadow-sm border">

        <div className="bg-slate-900 px-8 py-10 text-white">

          <div className="flex items-center gap-6">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold">
              {profile.username.charAt(0).toUpperCase()}
            </div>


            <div>

              <h1 className="text-4xl font-bold">
                {profile.username}
              </h1>


              <p className="mt-2 text-slate-300">
                Developer Community Member
              </p>


              <span className="mt-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm capitalize">
                {profile.role}
              </span>

            </div>

          </div>

        </div>



        <div className="grid gap-8 p-8 md:grid-cols-2">


          <div className="space-y-6">


            <div className="flex items-center gap-4">

              <Mail className="text-slate-500"/>

              <div>

                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-semibold">
                  {profile.email}
                </p>

              </div>

            </div>



            <div className="flex items-center gap-4">

              <Shield className="text-slate-500"/>

              <div>

                <p className="text-sm text-gray-500">
                  Account Type
                </p>

                <p className="font-semibold capitalize">
                  {profile.role}
                </p>

              </div>

            </div>


          </div>


          <div className="grid grid-cols-3 gap-4">


            <div className="rounded-2xl border p-5 text-center">

              <FileText className="mx-auto mb-3 text-blue-600"/>

              <p className="text-3xl font-bold">
                {profile.post_count}
              </p>

              <p className="text-sm text-gray-500">
                Posts
              </p>

            </div>



            <div className="rounded-2xl border p-5 text-center">

              <MessageSquare className="mx-auto mb-3 text-green-600"/>

              <p className="text-3xl font-bold">
                {profile.comment_count}
              </p>

              <p className="text-sm text-gray-500">
                Comments
              </p>

            </div>



            <div className="rounded-2xl border p-5 text-center">

              <Heart className="mx-auto mb-3 text-red-500"/>

              <p className="text-3xl font-bold">
                {profile.like_count}
              </p>

              <p className="text-sm text-gray-500">
                Likes
              </p>

            </div>


          </div>


        </div>

      </section>




      <section>


        <h2 className="mb-6 text-2xl font-bold">
          My Posts
        </h2>



        {posts.length === 0 ? (

          <div className="rounded-2xl border border-dashed bg-gray-50 p-10 text-center">

            <User className="mx-auto mb-4 text-gray-400"/>

            <h3 className="text-xl font-semibold">
              No posts yet
            </h3>


            <p className="mt-2 text-gray-500">
              Start sharing your knowledge with the community.
            </p>


          </div>


        ) : (


          <div className="space-y-5">


            {posts.map((post:any)=>(


              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >


                <h3 className="mb-2 text-xl font-bold">
                  {post.title}
                </h3>



                <p className="line-clamp-2 text-gray-600">
                  {post.content}
                </p>



                <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">

                  <Heart size={16}/>

                  {post.like_count} Likes

                </div>


              </Link>


            ))}


          </div>


        )}


      </section>


    </main>
  );
}