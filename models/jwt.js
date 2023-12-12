const mongoose = require("mongoose");

const jwtTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    jwt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.JwtToken ||
  mongoose.model("JwtToken", jwtTokenSchema);
