import User from "../../../../../models/Users";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import CustomAPIError from "../../errors";

export async function GET(req) {
  try {
    validateJWT(req);
    await connect();

    // Find user by ID
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      throw new CustomAPIError.NotFoundError("User not found");
    }

    if (user.roles && user.roles.includes("admin")) {
      return NextResponse.json(
        { status: "success", isAdmin: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: "success", isAdmin: false },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: error.statusCode || 500 }
    );
  }
}
