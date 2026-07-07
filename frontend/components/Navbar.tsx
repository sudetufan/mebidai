"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-2xl font-bold"
        >
          MEBIDAI
        </Link>

        <div className="flex gap-6 items-center">

          <Link href="/">Home</Link>

          <Link href="/blog">Blog</Link>

          {user ? (
            <>
              <Link href="/create-post">
                Create Post
              </Link>

              <Link href="/profile">
                My Profile
              </Link>

              {user.role === "admin" && (
                <Link href="/admin">
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                Login
              </Link>

              <Link href="/register">
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}