const mongoose = require("mongoose");
const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

blacklistTokenSchema.index(
  { blacklistedAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 },
);
module.exports = mongoose.model("BlacklistToken", blacklistTokenSchema);
