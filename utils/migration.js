import mongoose from "mongoose";
import Review from "../models/Reviews";
import connect from "./db";

export const updateReviewSchema = async () => {
  try {
    await connect();

    // Fetch all reviews that are missing the new fields
    const reviewsToUpdate = await Review.find({
      $or: [
        { upvotedBy: { $exists: false } },
        { downvotedBy: { $exists: false } },
        { upvotesCount: { $exists: false } },
        { downvotesCount: { $exists: false } },
      ],
    });

    for (const review of reviewsToUpdate) {
      // Initialize missing fields
      review.upvotedBy = review.upvotedBy || [];
      review.downvotedBy = review.downvotedBy || [];
      review.upvotesCount = review.upvotesCount ?? review.upvotedBy.length;
      review.downvotesCount =
        review.downvotesCount ?? review.downvotedBy.length;

      // Save the updated review
      await review.save();
    }

    console.log(`Updated ${reviewsToUpdate.length} reviews.`);
  } catch (error) {
    console.error("Failed to update reviews:", error);
  } finally {
    // Close the Mongoose connection
    mongoose.connection.close();
  }
};
