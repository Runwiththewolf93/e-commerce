import User from "../../../../../models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import CustomAPIError from "../../errors";
import Joi from "joi";

/**
 * Updates the user's password.
 *
 * @param {Object} req - The request object.
 * @return {Promise<Object>} An object containing the response message.
 */
export async function POST(req) {
  try {
    validateJWT(req);
    await connect();
    console.log(req.user);

    const { email, currentPassword, newPassword } = await req.json();
    console.log(
      "🚀 ~ file: route.js:22 ~ POST ~ currentPassword:",
      currentPassword
    );
    console.log("🚀 ~ file: route.js:22 ~ POST ~ newPassword:", newPassword);

    // Joi validation
    const schema = Joi.object({
      email: Joi.string().email().required(),
      currentPassword: Joi.string().min(6).required(),
      newPassword: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({ email, currentPassword, newPassword });
    if (error) {
      throw new CustomAPIError.BadRequestError(error.details[0].message);
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new CustomAPIError.NotFoundError("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new CustomAPIError.BadRequestError("Incorrect current password");
    }

    // Check if the new password is the same as the old password
    const isNewPasswordSameAsOld = await bcrypt.compare(
      newPassword,
      user.password
    );
    if (isNewPasswordSameAsOld) {
      throw new CustomAPIError.BadRequestError(
        "New password must be different from the old password"
      );
    }

    // Hash new password and update user record
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json({
      status: "success",
      message: "Password successfully updated!",
    });
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
