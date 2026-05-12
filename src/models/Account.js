const Ledger = require("./Ledger");
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

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
  const balanceData = await Ledger.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: { $cond: [{ $eq: ["$status", "DEBIT"] }, "$amount", 0] },
        },
        totalCredit: {
          $sum: { $cond: [{ $eq: ["$status", "CREDIT"] }, "$amount", 0] },
        },
      },
    },
  ]);
  const balance =
    balanceData.length === 0
      ? 0
      : balanceData[0].totalCredit - balanceData[0].totalDebit;
  return balance;
};

module.exports = mongoose.model("Account", accountSchema);
