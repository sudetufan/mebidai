export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 h-10 w-72 animate-pulse rounded bg-gray-200" />

      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="mb-6 animate-pulse rounded-2xl border bg-white p-6 shadow-sm"
        >
          <div className="mb-4 h-6 w-28 rounded bg-gray-200" />
          <div className="mb-4 h-8 w-2/3 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-full rounded bg-gray-200" />
          <div className="mb-2 h-4 w-5/6 rounded bg-gray-200" />
          <div className="mt-6 flex justify-between">
            <div className="h-5 w-20 rounded bg-gray-200" />
            <div className="h-5 w-24 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </main>
  );
}