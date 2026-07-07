import { getComments } from "@/lib/api";
import { serverFetch } from "@/lib/server-api";
import CommentForm from "@/components/CommentForm";
import LikeButton from "@/components/LikeButton";

export default async function PostDetailPage({ params }: any) {
  const { id } = await params;

  // Cookie ile birlikte backend'e istek atılır
  const post = await serverFetch(`/posts/${id}`);

  const comments = await getComments(id);

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-3">
        {post.title}
      </h1>

      {/* AUTHOR */}
      <p className="text-gray-500 mb-6">
        👤 {post.user?.username}
      </p>

      {/* CONTENT CARD */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-6">
        <p className="leading-8 text-lg text-gray-800">
          {post.content}
        </p>
      </div>

      {/* LIKE */}
      <div className="mb-10">
        <LikeButton
          postId={post.id}
          initialLikes={post.like_count}
          initiallyLiked={post.liked}
        />
      </div>

      {/* COMMENTS */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          💬 Yorumlar
        </h2>

        {comments.length === 0 ? (
          <p className="text-gray-500">Henüz yorum yok.</p>
        ) : (
          comments.map((comment: any) => (
            <div
              key={comment.id}
              className="bg-gray-100 rounded-lg p-4 mb-3"
            >
              <p className="text-sm font-semibold">
                👤 {comment.user.username}
              </p>
              <p>{comment.content}</p>
            </div>
          ))
        )}

        <CommentForm postId={Number(id)} />
      </div>
    </main>
  );
}