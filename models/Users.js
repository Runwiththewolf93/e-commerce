import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    roles: {
      type: [String],
      enum: ["admin", "customer"],
      default: ["customer"],
    },
    address: {
      name: { type: String },
      surname: { type: String },
      street: { type: String },
      streetNumber: { type: Number },
      city: { type: String },
      municipality: { type: String },
      zip: { type: String },
      phoneNumber: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
