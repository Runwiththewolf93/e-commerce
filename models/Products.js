import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Electronics",
      "Clothing",
      "Home & Garden",
      "Books",
      "Health & Beauty",
      "Sports",
      "Toys",
      "Cars & Motorcycles",
    ],
  },
  images: [
    {
      url: String,
      alt: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
