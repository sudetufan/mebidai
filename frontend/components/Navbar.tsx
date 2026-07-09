"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, FilePlus2, User, Shield, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  const linkClass = (path: string) =>
    `transition-colors hover:text-blue-400 ${
      pathname === path
        ? "text-blue-400 font-semibold"
        : "text-gray-200"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide transition hover:text-blue-400"
        >
          MEBIDAI
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          <Link href="/blog" className={linkClass("/blog")}>
            Blog
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-1 ${linkClass("/dashboard")}`}
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <Link
                href="/create-post"
                className={`flex items-center gap-1 ${linkClass("/create-post")}`}
              >
                <FilePlus2 size={17} />
                Create Post
              </Link>

              <Link
                href="/profile"
                className={`flex items-center gap-1 ${linkClass("/profile")}`}
              >
                <User size={17} />
                My Profile
              </Link>

              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1 ${linkClass("/admin")}`}
                >
                  <Shield size={17} />
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass("/login")}>
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}