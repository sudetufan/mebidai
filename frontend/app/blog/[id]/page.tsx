import { getComments } from "@/lib/api";
import { serverFetch } from "@/lib/server-api";
import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";
import LikeButton from "@/components/LikeButton";

export default async function PostDetailPage({ params }: any) {
  const { id } = await params;

  const post = await serverFetch(`/posts/${id}`);
  const comments = await getComments(id);

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-3">
        {post.title}
      </h1>


      <div className="flex gap-3 items-center mb-6">

        <p className="text-gray-500">
          Author: {post.user?.username}
        </p>


        {post.category && (
          <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
            {post.category.name}
          </span>
        )}

      </div>


      <div className="bg-white rounded-xl shadow-md p-8 mb-6">
        <p className="leading-8 text-lg text-gray-800">
          {post.content}
        </p>
      </div>


      <div className="mb-10">
        <LikeButton
          postId={post.id}
          initialLikes={post.like_count}
          initiallyLiked={post.liked}
        />
      </div>


      <div>
        <h2 className="text-2xl font-bold mb-4">
          Comments
        </h2>

        <CommentList comments={comments} />

        <CommentForm postId={Number(id)} />
      </div>

    </main>
  );
}