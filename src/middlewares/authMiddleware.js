const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const BlacklistToken = require("../models/BlacklistToken");

const protect = async (req, res, next) => {
  const token = req.headers.cookies || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access, Missing token",
    });
  }
  const isBlacklisted = await BlacklistToken.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access, Token is blacklisted",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access, Invalid token format",
      });
    }
    req.user = await User.findById(decoded.id).select("-password -systemUser");
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access, Invalid token",
    });
  }
};

module.exports = { protect };
