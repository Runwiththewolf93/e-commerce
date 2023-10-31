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
  discount: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function () {
          // Ensure that endDate is after startDate
          return (
            !this.discount ||
            !this.discount.startDate ||
            !this.discount.endDate ||
            this.discount.endDate > this.discount.startDate
          );
        },
        message: "Discount end date must be after start date",
      },
    },
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
    validate: [arrayLimit, "Product must have 3 to 4 images"],
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
  return val.length >= 3 && val.length <= 4;
}

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
