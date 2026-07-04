import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-slate-50 min-h-screen">

      {/* Hero */}

      <section className="max-w-6xl mx-auto py-24 px-6 text-center">

        <h1 className="text-6xl font-extrabold text-slate-900">
          MEBIDAI Community
        </h1>

        <p className="text-xl text-slate-600 mt-6 max-w-2xl mx-auto">
          Share knowledge, publish articles, ask questions and build your
          developer network.
        </p>

        <div className="mt-10 flex justify-center gap-5">

          <Link
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-4 rounded-xl font-semibold"
          >
            Explore Blog
          </Link>

          <Link
            href="/register"
            className="border border-slate-400 px-8 py-4 rounded-xl hover:bg-slate-100 transition"
          >
            Get Started
          </Link>

        </div>

      </section>

      {/* Features */}

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <h2 className="text-3xl font-bold mb-10">
          Why MEBIDAI?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-xl shadow-md p-8">

            <div className="text-5xl">📝</div>

            <h3 className="font-bold text-2xl mt-4">
              Publish Articles
            </h3>

            <p className="text-slate-600 mt-3">
              Share tutorials, experiences and technical knowledge.
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-md p-8">

            <div className="text-5xl">💬</div>

            <h3 className="font-bold text-2xl mt-4">
              Discuss
            </h3>

            <p className="text-slate-600 mt-3">
              Comment on posts and interact with developers.
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-md p-8">

            <div className="text-5xl">🚀</div>

            <h3 className="font-bold text-2xl mt-4">
              Grow Together
            </h3>

            <p className="text-slate-600 mt-3">
              Build your portfolio and improve your software skills.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}