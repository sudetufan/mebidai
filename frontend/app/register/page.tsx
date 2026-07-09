"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  Lock,
} from "lucide-react";

import { registerUser } from "@/lib/api";

export default function RegisterPage() {

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();
    try {
      await registerUser({
        username,
        email,
        password,
      });
      alert(
        "Account created successfully!"
      );
      router.push("/login");
    } catch(error) {
      console.error(error);
      alert(
        "Registration failed."
      );
    }
  }
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Create Account
          </h1>
          <p className="mt-3 text-gray-500">
            Join MEBIDAI and start sharing knowledge.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border rounded-xl py-3 font-semibold hover:bg-gray-50 transition"
          >
            <span className="font-bold text-xl text-blue-600">
              G
            </span>
            Continue with Google
          </button>
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-sm text-gray-400">
              OR
            </span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="text-sm font-semibold">
                Username
              </label>
              <div className="relative mt-2">
                <User
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={username}
                  onChange={(e)=>
                    setUsername(e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">
                Email
              </label>

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={email}
                  onChange={(e)=>
                    setEmail(e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">
                Password
              </label>
              <div className="relative mt-2">
                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={password}
                  onChange={(e)=>
                    setPassword(e.target.value)
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 transition"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );

}