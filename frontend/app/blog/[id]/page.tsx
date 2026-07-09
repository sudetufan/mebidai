import { getComments } from "@/lib/api";
import { serverFetch } from "@/lib/server-api";

import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";
import LikeButton from "@/components/LikeButton";

import {
  User,
  Heart,
} from "lucide-react";


export default async function PostDetailPage({ params }: any) {

  const { id } = await params;

  const post = await serverFetch(`/posts/${id}`);
  const comments = await getComments(id);


  return (

    <main className="mx-auto max-w-4xl px-6 py-12 space-y-8">


      <section className="rounded-3xl border bg-white p-8 shadow-sm">


        <div className="flex flex-wrap items-center gap-4">


          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">

            {post.user?.username
              ?.charAt(0)
              .toUpperCase()}

          </div>



          <div>

            <p className="font-semibold">

              {post.user?.username ?? "Anonymous"}

            </p>


            <p className="text-sm text-gray-500">

              Author

            </p>

          </div>




          {post.category && (

            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">

              {post.category.name}

            </span>

          )}


        </div>





        <h1 className="mt-8 text-4xl font-extrabold tracking-tight">

          {post.title}

        </h1>




      </section>





      <article className="rounded-3xl border bg-white p-8 shadow-sm">


        <p className="whitespace-pre-line text-lg leading-9 text-gray-700">

          {post.content}

        </p>


      </article>





      <section className="rounded-3xl border bg-white p-6 shadow-sm">


        <div className="flex items-center gap-2 mb-4">

          <Heart className="text-red-500"/>

          <h2 className="text-xl font-bold">

            Like this post

          </h2>

        </div>



        <LikeButton
          postId={post.id}
          initialLikes={post.like_count}
          initiallyLiked={post.liked}
        />


      </section>





      <section className="rounded-3xl border bg-white p-8 shadow-sm">


        <h2 className="mb-6 text-2xl font-bold">

          Comments

        </h2>



        <CommentList comments={comments}/>



        <div className="mt-8 border-t pt-6">

          <CommentForm postId={Number(id)} />

        </div>



      </section>



    </main>

  );
}