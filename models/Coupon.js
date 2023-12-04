import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  usedBy: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      usedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
