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

  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);

  const [postPage, setPostPage] = useState(1);
  const [postTotalPages, setPostTotalPages] = useState(1);

  const [commentPage, setCommentPage] = useState(1);
  const [commentTotalPages, setCommentTotalPages] =
    useState(1);

  const [userQuery, setUserQuery] = useState("");
  const [postQuery, setPostQuery] = useState("");
  const [commentQuery, setCommentQuery] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    void loadData();
  }, [
    userPage,
    postPage,
    commentPage,
    userQuery,
    postQuery,
    commentQuery,
  ]);

  async function loadData() {
    setLoading(true);

    try {
      const [
        usersRes,
        postsRes,
        commentsRes,
        categoryData,
      ] = await Promise.all([
        fetch(
          `${API_URL}/admin/users?page=${userPage}&limit=10&query=${encodeURIComponent(
            userQuery
          )}`,
          {
            credentials: "include",
          }
        ),

        fetch(
          `${API_URL}/admin/posts?page=${postPage}&limit=10&query=${encodeURIComponent(
            postQuery
          )}`,
          {
            credentials: "include",
          }
        ),

        fetch(
          `${API_URL}/admin/comments?page=${commentPage}&limit=10&query=${encodeURIComponent(
            commentQuery
          )}`,
          {
            credentials: "include",
          }
        ),

        getCategories(),
      ]);

      const unauthorized =
        [usersRes, postsRes, commentsRes].some(
          (res) =>
            res.status === 401 ||
            res.status === 403
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
        throw new Error(
          "Admin data loading failed."
        );
      }

      const usersData =
        await usersRes.json();

      const postsData =
        await postsRes.json();

      const commentsData =
        await commentsRes.json();

      setUsers(usersData.items);
      setUserTotalPages(usersData.pages);

      setPosts(postsData.items);
      setPostTotalPages(postsData.pages);

      setComments(commentsData.items);
      setCommentTotalPages(
        commentsData.pages
      );

      setCategories(categoryData);

      setAuthorized(true);
    } catch (error: unknown) {
      console.error(
        "Admin loading error:",
        error
      );

      toast.error(
        "Failed to load admin panel."
      );

      router.replace("/");
    } finally {
      setLoading(false);
    }
  }

  if (loading || !authorized) {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
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
        page={userPage}
        totalPages={userTotalPages}
        onPageChange={setUserPage}
        query={userQuery}
        onQueryChange={setUserQuery}
      />

      <PostManager
        posts={posts}
        onRefresh={loadData}
        page={postPage}
        totalPages={postTotalPages}
        onPageChange={setPostPage}
        query={postQuery}
        onQueryChange={setPostQuery}
      />

      <CommentManager
        comments={comments}
        onRefresh={loadData}
        page={commentPage}
        totalPages={commentTotalPages}
        onPageChange={setCommentPage}
        query={commentQuery}
        onQueryChange={setCommentQuery}
      />
    </main>
  );
}