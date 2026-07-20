"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:8000/api/v1";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();


    if (!email) {
      toast.error(
        "Please enter your email."
      );
      return;
    }


    try {
      setLoading(true);


      const res = await fetch(
        `${API_URL}/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );


      const data = await res.json();


      if (!res.ok) {
        throw new Error(
          data.detail ||
          "Password reset request failed."
        );
      }


      toast.success(
        "Password reset email sent!"
      );

      setEmail("");


    } catch (error) {

      if (error instanceof Error) {
        toast.error(
          error.message
        );
      } else {
        toast.error(
          "Something went wrong."
        );
      }

    } finally {
      setLoading(false);
    }
  }



  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">


        <h1 className="text-3xl font-bold text-center">
          Forgot Password
        </h1>


        <p className="mt-3 mb-8 text-center text-gray-500">
          Enter your email and we will send you a reset link.
        </p>



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
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>



          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
          >

            {
              loading
              ? "Sending..."
              : "Send Reset Link"
            }

          </button>


        </form>



        <div className="mt-6 text-center">

          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Back to login
          </a>

        </div>


      </div>

    </main>
  );
}