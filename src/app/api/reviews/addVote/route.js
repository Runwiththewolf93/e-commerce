import Review from "../../../../../models/Reviews";
import { NextResponse } from "next/server";
import connect from "../../../../../utils/db";
import validateJWT from "../../../../../utils/protect";
import customAPIError from "../../errors";
import Joi from "joi";

export async function PATCH(req) {
  try {
    validateJWT(req);
    await connect();

    const { reviewId, voteType } = await req.json();

    const schema = Joi.object({
      reviewId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      voteType: Joi.string().valid("upvote", "downvote").required(),
    });

    const { error } = schema.validate({ reviewId, voteType });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    let update = {};
    let message = "Vote updated successfully";
    let userVoteType = null;

    const userId = req.user.id;

    if (voteType === "upvote") {
      // Check if the user has already downvoted
      const hasDownvoted = await Review.findOne({
        _id: reviewId,
        downvotedBy: userId,
      });
      if (hasDownvoted) {
        // Remove downvote and decrement downvotesCount
        update.$pull = { downvotedBy: userId };
        update.$inc = { downvotesCount: -1 };
        message = "Downvote removed and upvote added";
        userVoteType = "upvote";
      }
      // Check if the user has already upvoted
      const hasUpvoted = await Review.findOne({
        _id: reviewId,
        upvotedBy: userId,
      });
      if (hasUpvoted) {
        // Remove upvote and decrement upvotesCount
        update.$pull = { upvotedBy: userId };
        update.$inc = { ...update.$inc, upvotesCount: -1 };
        message = "Upvote removed";
        userVoteType = null;
      } else {
        // Add upvote and increment upvotesCount
        update.$addToSet = { upvotedBy: userId };
        update.$inc = { ...update.$inc, upvotesCount: 1 };
        message = "Upvote added";
        userVoteType = "upvote";
      }
    } else if (voteType === "downvote") {
      // Check if the user has already upvoted
      const hasUpvoted = await Review.findOne({
        _id: reviewId,
        upvotedBy: userId,
      });
      if (hasUpvoted) {
        // Remove upvote and decrement upvotesCount
        update.$pull = { upvotedBy: userId };
        update.$inc = { upvotesCount: -1 };
        message = "Upvote removed and downvote added";
        userVoteType = "downvote";
      }
      // Check if the user has already downvoted
      const hasDownvoted = await Review.findOne({
        _id: reviewId,
        downvotedBy: userId,
      });
      if (hasDownvoted) {
        // Remove downvote and decrement downvotesCount
        update.$pull = { downvotedBy: userId };
        update.$inc = { ...update.$inc, downvotesCount: -1 };
        message = "Downvote removed";
        userVoteType = null;
      } else {
        // Add downvote and increment downvotesCount
        update.$addToSet = { downvotedBy: userId };
        update.$inc = { ...update.$inc, downvotesCount: 1 };
        message = "Downvote added";
        userVoteType = "downvote";
      }
    }

    // Perform the atomic update
    const review = await Review.findByIdAndUpdate(reviewId, update, {
      new: true,
    });
    console.log("🚀 ~ file: route.js:101 ~ PATCH ~ review:", review);

    if (!review) {
      throw new customAPIError.NotFoundError("Review not found");
    }

    return NextResponse.json(
      {
        status: "success",
        message,
        userVoteType,
        reviewId: review._id,
        upvotesCount: review.upvotesCount,
        downvotesCount: review.downvotesCount,
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
