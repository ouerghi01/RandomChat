
'use client';
import React from "react";
import Image from "next/image";

export interface User_data {
  email: string;
  img_url: string;
  id: number;
}

export default function Create_post(user_data: User_data) {
  const [create_post, setCreate_post] = React.useState({
    title: "",
    content: "",
    isAnonymous: false,
    userId: user_data.id,
  });
  const [show, setShow] = React.useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setCreate_post({
      ...create_post,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3006/post/Create_post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(create_post),
      });
      if (response.ok) {
        alert("Post created successfully!");
        setCreate_post({ title: "", content: "", isAnonymous: false, userId: user_data.id });
        setShow(false);
      } else {
        alert("Failed to create post!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-96 h-96 p-4 bg-white rounded-lg shadow-md max-w-md mx-auto  border-4 border-indigo-500/100">
      <div className="flex items-center gap-4">
        <Image
          src={user_data.img_url}
          alt={user_data.email}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col">
          <p className="font-medium text-gray-800">{user_data.email}</p>
          <button
            className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={() => setShow(!show)}
          >
            Create Post
          </button>
        </div>
      </div>
      {show && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 -z-50">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={create_post.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-blue-500"
          />
          <textarea
            name="content"
            placeholder="What's on your mind?"
            value={create_post.content}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-blue-500 resize-none"
            rows={4}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={create_post.isAnonymous}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="isAnonymous" className="text-sm text-gray-600">
              Post anonymously
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}
