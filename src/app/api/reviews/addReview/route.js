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

    let existingReview = await Review.findOne({ userId, productId });
    let isUpdated = false;

    if (existingReview) {
      existingReview.review = review;
      existingReview.rating = rating;
      existingReview.updateAt = new Date();
      await existingReview.save();
      isUpdated = true;
    } else {
      const newReview = new Review({
        userId: new mongoose.Types.ObjectId(userId),
        productId: new mongoose.Types.ObjectId(productId),
        review,
        rating,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await newReview.save();
    }

    const message = isUpdated
      ? "Review updated successfully"
      : "Review created successfully";

    return NextResponse.json({ status: "success", message }, { status: 200 });
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
