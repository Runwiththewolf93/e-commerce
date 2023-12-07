import User from "../../../../../models/Users";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import CustomAPIError from "../../errors";

/**
 * GET function to get user instance.
 *
 * @param {Object} req - the request object
 * @return {Object} the response object
 */
export async function GET(req) {
  try {
    validateJWT(req);
    await connect();

    // Find user by ID
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      throw new CustomAPIError.NotFoundError("User not found");
    }

    return NextResponse.json({ user });
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
