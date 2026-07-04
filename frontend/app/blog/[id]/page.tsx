import { getPost } from "@/lib/api"
import { getComments } from "@/lib/api";
import CommentForm from "@/components/CommentForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;

  const post = await getPost(id);
  const comments = await getComments(id);

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-3">
        {post.title}
      </h1>

      <p className="text-gray-500 mb-8">
  👤 Anonymous • Post #{id}
</p>
      <div className="bg-white rounded-xl shadow-md p-8">
        <p className="leading-8 text-lg">
          {post.content}
        </p>
      </div>


   <div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">
    💬 Yorumlar
  </h2>

  {comments.length === 0 ? (
    <p className="text-gray-500">Henüz yorum yok.</p>
  ) : (
    comments.map((comment: any) => (
      <div
        key={comment.id}
        className="bg-gray-100 rounded-lg p-4 mb-4"
      >
        <p>{comment.content}</p>
      </div>
    ))
  )}
  <CommentForm postId={Number(id)} />
</div>
    </main>
  );
}