"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import {
  loginUser,
  googleLogin,
  ApiError,
} from "@/lib/api";

import { useAuth } from "@/context/AuthContext";

const API_URL = "http://localhost:8000/api/v1";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  async function fetchUser() {
    const res = await fetch(
      `${API_URL}/users/me`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch user"
      );
    }

    const user = await res.json();

    setUser(user);
  }


  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!email || !password) {
      toast.error(
        "Please fill all fields"
      );
      return;
    }

    try {
      setLoading(true);

      await loginUser({
        email,
        password,
      });

      await fetchUser();

      toast.success(
        "Login successful!"
      );

      router.push("/blog");

    } catch (error) {
      console.error(error);

      if (error instanceof ApiError) {
        toast.error(
          error.message
        );
      } else {
        toast.error(
          "Something went wrong. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  }


  async function handleGoogleLogin(
    credential: string
  ) {
    try {
      await googleLogin(
        credential
      );

      await fetchUser();

      toast.success(
        "Login successful!"
      );

      router.push("/blog");

    } catch (error) {
      console.error(error);

      toast.error(
        "Google login failed."
      );
    }
  }


  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-extrabold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-3 text-gray-500">
            Login to continue your MEBIDAI journey.
          </p>

        </div>


        <div className="bg-white rounded-3xl shadow-lg p-8">


          <GoogleLogin
            onSuccess={(response) => {

              if (!response.credential) {
                toast.error(
                  "Google login failed."
                );
                return;
              }

              handleGoogleLogin(
                response.credential
              );

            }}

            onError={() => {
              toast.error(
                "Google login cancelled."
              );
            }}
          />


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
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>



            <div>

              <div className="flex justify-between items-center">

                <label className="text-sm font-semibold">
                  Password
                </label>


                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>

              </div>



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
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>



            <button
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
            >

              {
                loading
                ? "Logging in..."
                : "Login"
              }

            </button>


          </form>



          <p className="text-center text-sm text-gray-500 mt-6">

            Don't have an account?{" "}

            <a
              href="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </a>

          </p>


        </div>

      </div>

    </main>
  );
}