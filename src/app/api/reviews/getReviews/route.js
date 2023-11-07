import Product from "../../../../../models/Products";
import Reviews from "../../../../../models/Reviews";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "../../../../../utils/db";
import customAPIError from "../../errors";
import Joi from "joi";

const validationSchema = Joi.object({
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  productId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  rating: Joi.number().min(1).max(5),
  reviewType: Joi.string().valid("positive", "critical"),
  sort: Joi.string().valid(
    "createdAt_desc",
    "createdAt_asc",
    "updatedAt_desc",
    "updatedAt_asc"
  ),
  aggregateRating: Joi.string().valid("true"),
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).required(),
});

export async function GET(req) {
  try {
    await connect();

    const searchParams = req.nextUrl.searchParams;
    const params = {
      productId: searchParams.get("productId"),
      page: parseInt(searchParams.get("page"), 10) || 1,
      limit: parseInt(searchParams.get("limit"), 10) || 1,
    };

    const optionalParams = {
      rating: searchParams.get("rating"),
      reviewType: searchParams.get("reviewType"),
      sort: searchParams.get("sort"),
      aggregateRating: searchParams.get("aggregateRating"),
      userId: searchParams.get("userId"),
    };

    Object.keys(optionalParams).forEach(key => {
      const value = optionalParams[key];
      if (value && value !== "undefined") {
        params[key] = key === "rating" ? parseInt(value, 10) : value;
      }
    });

    const { error, value } = validationSchema.validate(params);
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const {
      userId,
      productId,
      rating,
      reviewType,
      sort,
      aggregateRating,
      page,
      limit,
    } = value;

    const product = await Product.findById(productId);
    if (!product) {
      throw new customAPIError.NotFoundError("Product not found");
    }

    if (aggregateRating) {
      const aggregateData = await Reviews.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId) } },
        {
          $group: {
            _id: "$productId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      return NextResponse.json(
        { status: "success", aggregateData },
        { status: 200 }
      );
    } else {
      let filterConditions = { productId };
      if (typeof rating === "number") {
        filterConditions.rating = rating;
      }
      if (reviewType === "positive") {
        filterConditions.$expr = { $gt: ["$upvotes", "$downvotes"] };
      }
      if (reviewType === "critical") {
        filterConditions.$expr = { $gt: ["$downvotes", "$upvotes"] };
      }

      let sortConditions = {};
      if (sort) {
        const [field, order] = sort.split("_");
        sortConditions[field] = order === "desc" ? -1 : 1;
      }

      console.log(
        "🚀 ~ file: route.js:99 ~ GET ~ filterConditions:",
        filterConditions
      );
      console.log(
        "🚀 ~ file: route.js:107 ~ GET ~ sortConditions:",
        sortConditions
      );

      const skip = (page - 1) * limit;
      console.log("🚀 ~ file: route.js:122 ~ GET ~ skip:", skip);
      console.log("🚀 ~ file: route.js:122 ~ GET ~ limit:", limit);

      const reviews = await Reviews.find(filterConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .lean();
      console.log("🚀 ~ file: route.js:130 ~ GET ~ reviews:", reviews);

      if (userId) {
        reviews.forEach(review => {
          if (review.upvotedBy.includes(userId)) {
            review.userVoteType = "upvote";
          } else if (review.downvotedBy.includes(userId)) {
            review.userVoteType = "downvote";
          } else {
            review.userVoteType = null;
          }
        });
      }

      const totalReviews = await Reviews.countDocuments(filterConditions);

      if (reviews.length === 0) {
        return NextResponse.json(
          {
            status: "success",
            message: "No reviews found",
            reviews: [],
            pagination: {
              total: totalReviews,
              page,
              pages: Math.ceil(totalReviews / limit),
              limit,
            },
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          status: "success",
          reviews,
          pagination: {
            total: totalReviews,
            page,
            pages: Math.ceil(totalReviews / limit),
            limit,
          },
        },
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
