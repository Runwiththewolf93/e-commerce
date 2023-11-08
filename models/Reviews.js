import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    review: {
      type: String,
      required: true,
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    upvotesCount: {
      type: Number,
      default: 0,
    },
    downvotesCount: {
      type: Number,
      default: 0,
    },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

reviewSchema.pre("save", function (next) {
  // Ensure a user's ID is not in both upvotedBy and downvotedBy
  const upvotedUserIds = new Set(this.upvotedBy.map(id => id.toString()));
  const downvotedUserIds = new Set(this.downvotedBy.map(id => id.toString()));

  // Check for intersection
  const intersection = new Set(
    [...upvotedUserIds].filter(id => downvotedUserIds.has(id))
  );

  // If there is an intersection, throw an error
  if (intersection.size > 0) {
    next(new Error("Cannot upvote and downvote the same review"));
  } else {
    // If all is well, proceed with saving
    next();
  }
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
