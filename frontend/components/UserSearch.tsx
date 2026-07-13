"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";

const API_URL = "http://localhost:8000/api/v1";

type UserResult = {
  id: number;
  username: string;
};

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);


  async function handleSearch(value: string) {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }


    const response = await fetch(
      `${API_URL}/users/search?q=${value}`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    setResults(data);
  }


  return (
    <div className="relative w-64">

      <div className="flex items-center rounded-lg bg-slate-800 px-3 py-2">
        <Search size={17} className="text-gray-400"/>

        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="ml-2 w-full bg-transparent text-sm outline-none"
        />
      </div>


      {results.length > 0 && (
        <div className="absolute mt-2 w-full rounded-xl border bg-white shadow-lg overflow-hidden">
          {results.map((user) => (
            <Link
              key={user.id}
              href={`/users/${user.id}`}
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-100"
            >
              <User size={16}/>
              {user.username}
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}