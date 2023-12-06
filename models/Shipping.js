import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  trackingNumber: {
    type: String,
    required: true,
  },
  carrier: {
    type: String,
    required: true,
  },
  estimatedDelivery: {
    type: Date,
    required: true,
  },
  shippingStatus: {
    type: String,
    enum: ["Pending", "In Transit", "Delivered", "Cancelled"],
    default: "Pending",
  },
  shippingAddress: {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    street: { type: String, required: true },
    streetNumber: { type: Number, required: true },
    city: { type: String, required: true },
    municipality: { type: String, required: true },
    zip: { type: String, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export default mongoose.models.Shipping ||
  mongoose.model("Shipping", shippingSchema);
