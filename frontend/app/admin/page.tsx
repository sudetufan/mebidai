"use client";

import { useEffect, useState } from "react";

import { getCategories } from "@/lib/api";

import AdminStats from "@/components/admin/AdminStats";
import CategoryManager from "@/components/admin/CategoryManager";
import UserManager from "@/components/admin/UserManager";
import PostManager from "@/components/admin/PostManager";
import CommentManager from "@/components/admin/CommentManager";

const API_URL = "http://localhost:8000/api/v1";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [
        usersRes,
        postsRes,
        commentsRes,
      ] = await Promise.all([
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

      const categoryData = await getCategories();
      setCategories(categoryData);
    } catch (error) {
      console.error("Admin data loading error:", error);
    } finally {
      setLoading(false);
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
      <h1 className="mb-8 text-4xl font-bold">
        Admin Panel
      </h1>

      <AdminStats
        users={users.length}
        posts={posts.length}
        comments={comments.length}
        categories={categories.length}
      />

      <CategoryManager
        categories={categories}
        onRefresh={loadData}
      />

      <UserManager
        users={users}
        onRefresh={loadData}
      />

      <PostManager
        posts={posts}
        onRefresh={loadData}
      />

      <CommentManager
        comments={comments}
        onRefresh={loadData}
      />
    </main>
  );
}