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

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
  totalAmountDiscount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

cartSchema.pre("save", async function (next) {
  let totalWithDiscount = 0;
  let totalWithoutDiscount = 0;

  for (const item of this.items) {
    const product = await Product.findById(item.product).exec();
    if (!product) {
      throw new customAPIError.BadRequestError("Product not found");
    }

    let priceWithDiscount = product.price;
    let priceWithoutDiscount = product.price;

    if (product.discount && product.discount.percentage > 0) {
      const now = new Date();
      if (
        product.discount.startDate <= now &&
        product.discount.endDate >= now
      ) {
        price -= (priceWithDiscount * product.discount.percentage) / 100;
      }
    }

    totalWithDiscount += item.quantity * priceWithDiscount;
    totalWithoutDiscount += item.quantity * priceWithoutDiscount;
  }

  this.totalAmountDiscount = totalWithDiscount;
  this.totalAmount = totalWithoutDiscount;
  next();
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
