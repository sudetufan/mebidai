import Link from "next/link";

import {
  FileText,
  MessageCircle,
  Users,
  ArrowRight,
} from "lucide-react";


export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">


      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100" />


        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28 text-center">


          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Build.
            <span className="text-blue-600">
              {" "}Share.
            </span>
            {" "}Learn.

          </h1>


          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-xl text-slate-600">
            MEBIDAI Community is a place where developers
            share knowledge, publish articles and grow together.

          </p>



          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">


            <Link
              href="/blog"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
            >

              Explore Blog

              <ArrowRight size={18}/>

            </Link>



            <Link
              href="/register"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-semibold transition hover:bg-slate-100"
            >

              Get Started

            </Link>


          </div>


        </div>

      </section>





      <section className="mx-auto max-w-6xl px-6 py-20">


        <div className="mb-10 text-center">

          <h2 className="text-2xl sm:text-3xl font-bold">
            Why MEBIDAI?
          </h2>


          <p className="mt-3 text-gray-500">
            Everything you need to share and learn from the community.
          </p>

        </div>





        <div className="grid gap-8 md:grid-cols-3">


          <div className="rounded-2xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">


            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

              <FileText/>

            </div>


            <h3 className="mt-5 text-2xl font-bold">
              Publish Articles
            </h3>


            <p className="mt-3 text-slate-600">

              Share tutorials, experiences and technical knowledge.

            </p>


          </div>





          <div className="rounded-2xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">


            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">

              <MessageCircle/>

            </div>


            <h3 className="mt-5 text-2xl font-bold">
              Discuss Ideas
            </h3>
            <p className="mt-3 text-slate-600">
              Comment on posts and connect with other developers.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Users/>
            </div>
            <h3 className="mt-5 text-2xl font-bold">
              Grow Together
            </h3>
            <p className="mt-3 text-slate-600">
              Build your portfolio and improve your skills with the community.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Ready to join the community?
        </h2>
        <p className="mt-3 text-slate-300">
          Start sharing your knowledge today.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-semibold text-slate-900 transition hover:bg-slate-200"
        >
          Create Account
        </Link>
      </section>
    </main>
  );
}