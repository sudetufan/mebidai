export default function CreatePostPage() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-8">
        Create New Post
      </h1>

      <form className="space-y-4">
        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Post title"
        />

        <textarea
          className="w-full border p-3 rounded-lg h-64"
          placeholder="Write your article..."
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Publish
        </button>
      </form>
    </main>
  );
}