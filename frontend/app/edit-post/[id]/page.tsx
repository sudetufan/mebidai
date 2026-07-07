"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updatePost, getPost } from "@/lib/api";


export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);


  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");


  useEffect(() => {
    async function loadPost() {
      try {
        const post = await getPost(String(id));

        setTitle(post.title);
        setContent(post.content);

      } catch (error) {
        console.error(error);
        alert("Post could not be loaded.");
      }
    }

    loadPost();

  }, [id]);



  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {

      await updatePost(id, {
        title,
        content,
      });


      alert("Post updated successfully!");

      router.push("/dashboard");


    } catch (error) {

      console.error(error);
      alert("Failed to update post.");

    }
  }



  return (
    <main className="max-w-3xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        Edit Post
      </h1>


      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          className="w-full border p-3 rounded-lg"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />


        <textarea
          className="w-full border p-3 rounded-lg h-64"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />


        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Update
        </button>


      </form>

    </main>
  );
}