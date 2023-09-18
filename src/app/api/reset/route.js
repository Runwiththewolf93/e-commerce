import User from "../../../../models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "../../../../utils/db";
import checkAuthCookie from "../../../../utils/protect";

/**
 * Updates the user's password.
 *
 * @param {Object} req - The request object.
 * @return {Promise<Object>} An object containing the response message.
 */
export async function POST(req) {
  checkAuthCookie();
  connect();

  try {
    const { email, currentPassword, newPassword } = await req.json();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return (
        NextResponse.json({ status: "error", message: "User not found" }),
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return (
        NextResponse.json({
          status: "error",
          message: "Incorrect current password",
        }),
        { status: 401 }
      );
    }

    // Hash new password and update user record
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json({ message: "Password successfully updated!" });
  } catch (error) {
    return new NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
