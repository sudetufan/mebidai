"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api/v1";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [usersRes, postsRes, commentsRes] = await Promise.all([
        fetch(`${API_URL}/admin/users`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/admin/posts`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/admin/comments`, {
          credentials: "include",
        }),
      ]);

      if (
        usersRes.status === 401 ||
        usersRes.status === 403
      ) {
        alert("Bu sayfaya erişim yetkiniz yok.");
        window.location.href = "/login";
        return;
      }

      setUsers(await usersRes.json());
      setPosts(await postsRes.json());
      setComments(await commentsRes.json());

    } catch (error) {
      console.error("Admin data loading error:", error);
    } finally {
      setLoading(false);
    }
  }


  async function deleteUser(id: number) {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      return;
    }

    const response = await fetch(
      `${API_URL}/admin/users/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      loadData();
    } else {
      alert("Kullanıcı silinemedi.");
    }
  }


  async function deletePost(id: number) {
    if (!confirm("Bu postu silmek istediğinize emin misiniz?")) {
      return;
    }

    const response = await fetch(
      `${API_URL}/admin/posts/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      loadData();
    } else {
      alert("Post silinemedi.");
    }
  }


  async function deleteComment(id: number) {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
      return;
    }

    const response = await fetch(
      `${API_URL}/admin/comments/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      loadData();
    } else {
      alert("Yorum silinemedi.");
    }
  }


  if (loading) {
    return (
      <main className="max-w-6xl mx-auto py-10 px-6">
        <p className="text-center text-gray-500">
          Loading admin panel...
        </p>
      </main>
    );
  }


  return (
    <main className="max-w-6xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        Admin Panel
      </h1>


      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-bold text-xl">
            Users
          </h2>

          <p className="text-4xl mt-4">
            {users.length}
          </p>
        </div>


        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-bold text-xl">
            Posts
          </h2>

          <p className="text-4xl mt-4">
            {posts.length}
          </p>
        </div>


        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-bold text-xl">
            Comments
          </h2>

          <p className="text-4xl mt-4">
            {comments.length}
          </p>
        </div>

      </div>


      <h2 className="text-2xl font-bold mb-4">
        Users
      </h2>

      {users.map((user: any) => (
        <div
          key={user.id}
          className="bg-white shadow rounded-lg p-4 mb-3 flex justify-between items-center"
        >

          <div>
            <p className="font-bold">
              {user.username}
            </p>

            <p className="text-gray-500">
              {user.email}
            </p>

            <span
              className={
                user.role === "admin"
                  ? "text-red-600 font-semibold"
                  : "text-gray-600"
              }
            >
              {user.role}
            </span>
          </div>


          {user.role !== "admin" && (
            <button
              onClick={() => deleteUser(user.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          )}

        </div>
      ))}



      <h2 className="text-2xl font-bold mt-10 mb-4">
        Posts
      </h2>


      {posts.map((post: any) => (
        <div
          key={post.id}
          className="bg-white shadow rounded-lg p-4 mb-3 flex justify-between items-center"
        >

          <div>
            <p className="font-bold">
              {post.title}
            </p>

            <p className="text-gray-500">
              {post.user.username}
            </p>
          </div>


          <button
            onClick={() => deletePost(post.id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>

        </div>
      ))}



      <h2 className="text-2xl font-bold mt-10 mb-4">
        Comments
      </h2>


      {comments.map((comment: any) => (
        <div
          key={comment.id}
          className="bg-white shadow rounded-lg p-4 mb-3 flex justify-between items-center"
        >

          <div>
            <p>
              {comment.content}
            </p>

            <p className="text-gray-500">
              {comment.user.username}
            </p>
          </div>


          <button
            onClick={() => deleteComment(comment.id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>

        </div>
      ))}

    </main>
  );
}