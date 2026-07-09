type AdminStatsProps = {
  users: number;
  posts: number;
  comments: number;
  categories: number;
};

export default function AdminStats({
  users,
  posts,
  comments,
  categories,
}: AdminStatsProps) {
  const stats = [
    {
      title: "Users",
      value: users,
    },
    {
      title: "Posts",
      value: posts,
    },
    {
      title: "Comments",
      value: comments,
    },
    {
      title: "Categories",
      value: categories,
    },
  ];

  return (
    <div className="grid gap-6 mb-10 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <p className="text-gray-500 text-sm">
            {stat.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  );
}