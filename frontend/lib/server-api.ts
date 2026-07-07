import { cookies } from "next/headers";

const API_URL = "http://localhost:8000/api/v1";

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export async function serverFetch(path: string) {
  const cookie = await getCookieHeader();

  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    headers: {
      Cookie: cookie,
    },
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}