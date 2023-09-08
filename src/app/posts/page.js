import { notFound } from "next/navigation";
import PostsRedux from "./posts";

async function getData() {
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });
  if (!res.ok) return notFound();
  return res.json();
}

export default async function Posts() {
  const data = await getData();

  return (
    <div>
      {data.map(post => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
        </div>
      ))}
      <PostsRedux />
    </div>
  );
}
