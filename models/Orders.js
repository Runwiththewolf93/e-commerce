import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: String,
  price: Number,
  discount: {
    percentage: Number,
    startDate: Date,
    endDate: Date,
  },
  images: [
    {
      url: String,
      alt: String,
    },
  ],
  quantity: {
    type: Number,
    min: 1,
  },
});

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  street: { type: String, required: true },
  streetNumber: { type: Number, required: true },
  city: { type: String, required: true },
  municipality: { type: String, required: true },
  zip: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalAmountDiscount: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    appliedCoupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processed", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shippingAddress: shippingAddressSchema,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
