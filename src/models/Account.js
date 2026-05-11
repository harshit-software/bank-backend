const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "FROZEN", "CLOSED"],
      default: "ACTIVE",
    },
    currency: { type: String, required: true, default: "INR" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Account", accountSchema);
