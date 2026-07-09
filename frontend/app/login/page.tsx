"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock} from "lucide-react";

import { loginUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";


const API_URL = "http://localhost:8000/api/v1";


export default function LoginPage() {

  const router = useRouter();
  const { setUser } = useAuth();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);



  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();


    if (!email || !password) {

      alert("Please fill all fields");
      return;

    }



    try {

      setLoading(true);


      await loginUser({
        email,
        password,
      });



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


      router.push("/blog");



    } catch(error) {

      console.error(error);

      alert(
        "Invalid email or password."
      );


    } finally {

      setLoading(false);

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


          <button

            className="w-full flex items-center justify-center gap-3 border rounded-xl py-3 font-semibold hover:bg-gray-50 transition"

          >

            <span className="font-bold text-xl text-blue-600">
              G
          </span>

           Continue with Google
           </button>



          <div className="flex items-center gap-4 my-6">

            <div className="h-px bg-gray-200 flex-1"/>

            <span className="text-sm text-gray-400">
              OR
            </span>

            <div className="h-px bg-gray-200 flex-1"/>

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

              disabled={loading}

              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"

            >

              {loading
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