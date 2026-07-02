export default function RegisterPage() {
  return (
    <main className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Create Account
      </h1>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
        >
          Create Account
        </button>
      </form>
    </main>
  );
}