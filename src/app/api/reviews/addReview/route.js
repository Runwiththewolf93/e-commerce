import User from "../../../../../models/Users";
import Product from "../../../../../models/Products";
import Review from "../../../../../models/Reviews";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import customAPIError from "../../errors";
import Joi from "joi";

export async function POST(req) {
  try {
    validateJWT(req);
    await connect();

    const { userId, productId, review, rating } = await req.json();

    const schema = Joi.object({
      userId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      productId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      review: Joi.string().max(1000).required(),
      rating: Joi.number().min(1).max(5).required(),
    });

    const { error } = schema.validate({ userId, productId, review, rating });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      throw new customAPIError.NotFoundError("User or Product not found");
    }

    let isUpdated = false;
    let updatedReview;

    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      existingReview.review = review;
      existingReview.rating = rating;
      await existingReview.save();
      updatedReview = existingReview;
      isUpdated = true;
    } else {
      updatedReview = new Review({
        userId: new mongoose.Types.ObjectId(userId),
        productId: new mongoose.Types.ObjectId(productId),
        review,
        rating,
      });
      await updatedReview.save();
    }

    const message = isUpdated
      ? "Review updated successfully"
      : "Review created successfully";

    return NextResponse.json(
      { status: "success", message, review: updatedReview },
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
