import User from "../../../../models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "../../../../utils/db";

export async function POST(req) {
  connect();

  try {
    const { name, email, password } = await req.json();
    console.log("🚀 ~ file: route.js:11 ~ POST ~ password:", password);
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(
      "🚀 ~ file: route.js:13 ~ POST ~ hashedPassword:",
      hashedPassword
    );

    const user = await User.create({
      username: name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return NextResponse.json({
      user: {
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    );
  }
}
