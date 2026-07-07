import { serverFetch } from "@/lib/server-api";

export default async function ProfilePage() {
  const profile = await serverFetch("/users/profile");

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-8">
        👤 My Profile
      </h1>

      <div className="bg-white shadow-xl rounded-xl p-8 space-y-4">

        <div>
          <span className="font-semibold">Username:</span>{" "}
          {profile.username}
        </div>

        <div>
          <span className="font-semibold">Email:</span>{" "}
          {profile.email}
        </div>

        <div>
          <span className="font-semibold">Role:</span>{" "}
          {profile.role}
        </div>

        <hr />

        <div className="flex gap-10 text-lg">

          <div>
            📝
            <span className="font-bold ml-2">
              {profile.post_count}
            </span>
            <span className="ml-2">Posts</span>
          </div>

          <div>
            💬
            <span className="font-bold ml-2">
              {profile.comment_count}
            </span>
            <span className="ml-2">Comments</span>
          </div>

        </div>

      </div>
    </main>
  );
}