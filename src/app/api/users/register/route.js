import User from "../../../../../models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import CustomAPIError from "../../errors";
import Joi from "joi";

export async function POST(req) {
  await connect();

  try {
    const { name, email, password } = await req.json();

    // Joi validation
    const schema = Joi.object({
      name: Joi.string().min(6).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({ name, email, password });
    if (error) {
      throw new CustomAPIError.BadRequestError(error.details[0].message);
    }

    // Check for unique username and email
    const existingUserByUsername = await User.findOne({ username: name });
    const existingUserByEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUserByUsername) {
      throw new CustomAPIError.BadRequestError("Username already exists");
    }

    if (existingUserByEmail) {
      throw new CustomAPIError.BadRequestError("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return NextResponse.json({
      status: "success",
      user: {
        name: user.username,
        email: user.email,
      },
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
