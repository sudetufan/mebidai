"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getCategories } from "@/lib/api";

import AdminStats from "@/components/admin/AdminStats";
import CategoryManager from "@/components/admin/CategoryManager";
import UserManager from "@/components/admin/UserManager";
import PostManager from "@/components/admin/PostManager";
import CommentManager from "@/components/admin/CommentManager";

import {
  User,
  Category,
  AdminPost,
  Comment,
} from "@/types";

const API_URL = "http://localhost:8000/api/v1";

export default function AdminPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [
        usersRes,
        postsRes,
        commentsRes,
        categoryData,
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

        getCategories(),
      ]);

      const unauthorized =
        [usersRes, postsRes, commentsRes].some(
          (res) => res.status === 401 || res.status === 403
        );

      if (unauthorized) {
        toast.error(
          "You are not authorized to access this page."
        );

        router.replace("/");

        return;
      }

      if (
        !usersRes.ok ||
        !postsRes.ok ||
        !commentsRes.ok
      ) {
        throw new Error("Admin data loading failed");
      }

      const usersData = await usersRes.json();
      const postsData = await postsRes.json();
      const commentsData = await commentsRes.json();

      setUsers(usersData);
      setPosts(postsData);
      setComments(commentsData);
      setCategories(categoryData);

      setAuthorized(true);
    } catch (error) {
      console.error("Admin loading error:", error);

      toast.error("Failed to load admin panel.");

      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  if (loading || !authorized) {
    return null;
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