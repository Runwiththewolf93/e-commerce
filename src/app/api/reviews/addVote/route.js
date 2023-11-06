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

    const { userId, reviewId, voteType } = await req.json();

    const schema = Joi.object({
      userId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      reviewId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      voteType: Joi.string().valid("upvote", "downvote").required(),
    });

    const { error } = schema.validate({ userId, reviewId, voteType });
    if (error) {
      throw new customAPIError.BadRequestError(error.details[0].message);
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new customAPIError.NotFoundError("Review not found");
    }

    let message = "Vote updated successfully";
    let userVoteType = null;
    if (voteType === "upvote") {
      if (review.downvotedBy.includes(userId)) {
        review.downvotedBy.pull(userId);
        review.downvotesCount -= 1;
        message = "Downvotes removed";
        userVoteType = review.upvotedBy.includes(userId) ? "upvote" : null;
      }
      if (!review.upvotedBy.includes(userId)) {
        review.upvotedBy.push(userId);
        review.upvotesCount += 1;
        message = "Upvote added";
      } else {
        // if the user upvoted, remove upvote
        review.upvotedBy.pull(userId);
        review.upvotesCount -= 1;
        message = "Upvote removed";
      }
    } else if (voteType === "downvote") {
      if (review.upvotedBy.includes(userId)) {
        userVoteType = review.downvotedBy.includes(userId) ? "downvote" : null;
        review.upvotedBy.pull(userId);
        review.upvotesCount -= 1;
        message = "Upvotes removed";
      }
      if (!review.downvotedBy.includes(userId)) {
        review.downvotedBy.push(userId);
        review.downvotesCount += 1;
        message = "Downvote added";
      } else {
        // if the user downvoted, remove downvote
        review.downvotedBy.pull(userId);
        review.downvotesCount -= 1;
        message = "Downvote removed";
      }
    }

    // let userVoteType = null;
    // if (voteType === "upvote") {
    //   userVoteType = review.upvotedBy.includes(userId) ? null : "upvote";
    // } else if (voteType === "downvote") {
    //   userVoteType = review.downvotedBy.includes(userId) ? null : "downvote";
    // }

    await review.save();

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
