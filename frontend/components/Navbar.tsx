"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    function checkLogin() {
      const token = localStorage.getItem("token");
      setLoggedIn(!!token);
    }

    checkLogin();

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
          MEBIDAI
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>

          {loggedIn ? (
            <>
              <Link href="/create-post">Create Post</Link>

              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}