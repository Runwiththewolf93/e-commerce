import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
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
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
