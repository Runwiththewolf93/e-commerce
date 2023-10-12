import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
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
      "Groceries & Food",
      "Office Supplies & Stationery",
    ],
  },
  images: {
    type: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          required: true,
        },
      },
    ],
    validate: [arrayLimit, "Product must have 1 to 4 images"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

function arrayLimit(val) {
  return val.length >= 1 && val.length <= 4;
}

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
