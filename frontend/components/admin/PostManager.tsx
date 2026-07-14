"use client";

import { useState } from "react";

import ConfirmModal from "@/components/ConfirmModal";

import { AdminPost } from "@/types";


const API_URL = "http://localhost:8000/api/v1";


type Props = {
  posts: AdminPost[];
  onRefresh: () => void;
};



export default function PostManager({
  posts,
  onRefresh,
}: Props){


  const [confirmOpen,setConfirmOpen]=useState(false);

  const [selectedPost,setSelectedPost]=
    useState<AdminPost|null>(null);



  async function deletePost(){

    if(!selectedPost) return;


    const response = await fetch(
      `${API_URL}/admin/posts/${selectedPost.id}`,
      {
        method:"DELETE",
        credentials:"include",
      }
    );


    if(response.ok){

      setConfirmOpen(false);

      setSelectedPost(null);

      onRefresh();

    }else{

      alert(
        "Post could not be deleted."
      );

    }

  }



  return (

    <>

      <h2 className="mt-10 mb-4 text-2xl font-bold">
        Posts
      </h2>



      {posts.map((post)=>(

        <div
          key={post.id}
          className="mb-3 flex items-center justify-between rounded-xl bg-white p-4 shadow"
        >

          <div>

            <p className="font-bold">
              {post.title}
            </p>


            <p className="text-gray-500">
              {post.user.username}
            </p>

          </div>



          <button

            onClick={()=>{

              setSelectedPost(post);

              setConfirmOpen(true);

            }}

            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >

            Delete

          </button>


        </div>

      ))}



      <ConfirmModal

        open={confirmOpen}

        title="Delete Post"

        description={`Are you sure you want to delete "${selectedPost?.title ?? ""}"? This action cannot be undone.`}

        onCancel={()=>{

          setConfirmOpen(false);

          setSelectedPost(null);

        }}

        onConfirm={deletePost}

      />


    </>

  );

}