import jwtToken from "../../../../models/jwt";
import User from "../../../../models/Users";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import connect from "../../../../utils/db";
import customAPIError from "../errors";
import Joi from "joi";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connect();

    const { userId } = await req.json();

    const schema = Joi.object({ userId: Joi.string().required() });
    const { error } = schema.validate({ userId });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new customAPIError.NotFoundError("User not found");
    }

    let customJwtToken;

    const existingToken = await jwtToken.findOne({ userId });

    if (existingToken) {
      try {
        // Validate existing token
        const decoded = jwt.verify(existingToken.jwt, process.env.JWT_SECRET);
        if (decoded.exp > Math.floor(Date.now() / 1000)) {
          customJwtToken = existingToken.jwt;
        }
      } catch (error) {
        await jwtToken.deleteOne({ userId });
        throw new customAPIError.UnauthorizedError(
          "Token is invalid or expired, please log in again"
        );
      }
    }

    if (!customJwtToken) {
      // Generate new token
      console.log("Generating new token");

      // Debug: Print environment variable and user object
      console.log("JWT Secret:", process.env.JWT_SECRET);
      console.log("User Object:", user);

      try {
        const issuedAt = Math.floor(Date.now() / 1000);
        const expiresAt = issuedAt + 259200;

        const payload = {
          name: user.username,
          email: user.email,
          id: user._id,
          iat: issuedAt,
          exp: expiresAt,
          jti: crypto.randomBytes(16).toString("hex"),
        };

        // Debug: Print payload
        console.log("Payload:", payload);

        customJwtToken = jwt.sign(payload, process.env.JWT_SECRET);

        console.log("Token generated successfully.");

        // Store token in db
        await jwtToken.updateOne(
          { userId },
          { jwt: customJwtToken },
          { upsert: true }
        );
      } catch (error) {
        throw new customAPIError.BadRequestError(
          "Error generating token:",
          error.message
        );
      }
    }

    return NextResponse.json(
      {
        customJwt: customJwtToken,
      },
      { status: 200 }
    );
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
