"use client";

import { useSelector, useDispatch } from "react-redux";
import { addPost, deletePost } from "../../redux/slices/postsSlice";
import { useState } from "react";

const Posts = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts);

  const handleAddPost = e => {
    e.preventDefault();

    if (!title || !description) return;

    const newPost = {
      id: Date.now(),
      title,
      description,
    };

    dispatch(addPost(newPost));
  };

  const handleRemovePost = postId => {
    dispatch(deletePost({ id: postId }));
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center rounded-lg bg-gray-700 max-w-sm mx-auto mt-5">
      <form
        onSubmit={handleAddPost}
        className="w-full flex flex-col items-center space-y-3 p-3"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 h-20 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        ></textarea>
        <button
          onClick={handleAddPost}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Post
        </button>
      </form>
      <h1 className="text-4xl font-bold mt-3 -mb-1">Posts</h1>
      {posts.map(post => (
        <div
          key={post.id}
          className="p-4 my-4 rounded-lg shadow-lg w-full flex flex-col items-center space-y-3 bg-slate-500"
        >
          <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
          <p className="text-lg mb-2">{post.description}</p>
          <button
            onClick={() => handleRemovePost(post.id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Posts;
