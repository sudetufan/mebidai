export default function DashboardPage() {
  return (
    <main className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-2xl font-bold">Posts</h2>
          <p className="text-4xl mt-3">12</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-2xl font-bold">Comments</h2>
          <p className="text-4xl mt-3">45</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-2xl font-bold">Likes</h2>
          <p className="text-4xl mt-3">128</p>
        </div>
      </div>
    </main>
  );
}