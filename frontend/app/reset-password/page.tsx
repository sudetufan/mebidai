"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:8000/api/v1";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }

    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/users/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            new_password: password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Password reset failed.");
      }

      toast.success("Password reset successfully!");

      router.push("/login");

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center">
          Reset Password
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Enter your new password below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="text-sm font-semibold">
              New Password
            </label>

            <div className="relative mt-2">
              <Lock
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type="password"
                placeholder="New password"
                className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>
        </form>

      </div>
    </main>
  );
}