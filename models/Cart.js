import mongoose from "mongoose";
import Product from "./Products";
import customAPIError from "../src/app/api/errors";

const cartItemSchema = new mongoose.Schema({
  // fetch name, price, stock, discount, images
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    validate: {
      validator: async function (quantity) {
        const product = await Product.findById(this.product);
        return quantity <= product.stock;
      },
      message: props =>
        `Quantity (${props.value}) exceeds the available stock.`,
    },
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    totalAmountDiscount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    totalWeight: { type: Number, default: 0 },
    appliedCoupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  },
  { timestamps: true }
);

cartSchema.pre("save", async function (next) {
  let totalWithDiscount = 0;
  let totalWithoutDiscount = 0;
  let totalWeight = 0;

  for (const item of this.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new customAPIError.BadRequestError("Product not found");
    }

    let priceWithDiscount = product.price;
    let priceWithoutDiscount = product.price;
    totalWeight += parseFloat(product.weight) * item.quantity;

    if (product.discount && product.discount.percentage > 0) {
      const now = new Date();
      if (
        (!product.discount.startDate || product.discount.startDate <= now) &&
        (!product.discount.endDate || product.discount.endDate >= now)
      ) {
        priceWithDiscount -=
          (priceWithDiscount * product.discount.percentage) / 100;
      }
    }

    totalWithDiscount += item.quantity * priceWithDiscount;
    totalWithoutDiscount += item.quantity * priceWithoutDiscount;
  }

  this.totalAmountDiscount = totalWithDiscount;
  this.totalAmount = totalWithoutDiscount;
  this.totalWeight = totalWeight;

  // Calculate shipping cost based on total weight
  if (totalWeight <= 1) {
    this.shippingCost = 10;
  } else if (totalWeight <= 5) {
    this.shippingCost = 20;
  } else if (totalWeight < 100) {
    this.shippingCost = 40;
  } else {
    this.shippingCost = 0;
  }

  next();
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
