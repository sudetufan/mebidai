"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { searchUsers } from "@/lib/api";

type Props = {
  text: string;
};

type User = {
  id: number;
  username: string;
};

export default function MentionText({ text }: Props) {
  const [users, setUsers] = useState<Record<string, User>>({});

  const usernames = useMemo(() => {
    return [...new Set(
      Array.from(text.matchAll(/@([a-zA-Z0-9_]+)/g))
        .map((match) => match[1])
    )];
  }, [text]);

  useEffect(() => {
    async function loadUsers() {
      const map: Record<string, User> = {};

      await Promise.all(
        usernames.map(async (username) => {
          try {
            const result = await searchUsers(username);

            const user = result.find(
              (u: User) =>
                u.username.toLowerCase() === username.toLowerCase()
            );

            if (user) {
              map[user.username] = user;
            }
          } catch {
            // kullanıcı bulunamazsa normal metin olarak kalacak
          }
        })
      );

      setUsers(map);
    }

    if (usernames.length > 0) {
      loadUsers();
    }
  }, [usernames]);

  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (!part.startsWith("@")) {
          return <span key={index}>{part}</span>;
        }

        const username = part.slice(1);
        const user = users[username];

        if (!user) {
          return <span key={index}>{part}</span>;
        }

        return (
          <Link
            key={index}
            href={`/profile/${user.id}`}
            className="text-blue-600 font-medium hover:underline"
          >
            {part}
          </Link>
        );
      })}
    </p>
  );
}