"use client";

import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8000/api/v1";

export default function DeletePostButton({
  postId,
}: {
  postId: number;
}) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm(
      "Bu postu silmek istediğinize emin misiniz?"
    );

    if (!confirmed) return;


    const response = await fetch(
      `${API_URL}/posts/${postId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );


    if (response.ok) {
      router.refresh();
    } else {
      alert("Post silinemedi.");
    }
  }


  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800"
    >
      Delete
    </button>
  );
}