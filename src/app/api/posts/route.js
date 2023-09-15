import { NextResponse } from "next/server";
import connect from "../../../../utils/db";
import Post from "../../../../models/Post";

export const GET = async request => {
  try {
    await connect();
    const posts = await Post.find();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error in fetching posts ${error.message}`,
      },
      { status: 500 }
    );
  }
};
