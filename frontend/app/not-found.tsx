import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-blue-600">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-slate-900">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}