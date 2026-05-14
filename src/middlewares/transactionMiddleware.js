const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistToken = require("../models/BlacklistToken");

const initiateFunds = async (req, res, next) => {
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
    const user = await User.findById(decoded.id).select("+systemUser");
    if (!user || !user.systemUser) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access, Not a system user",
      });
    }
    req.systemUser = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access, Invalid token",
    });
  }
};

module.exports = {
  initiateFunds,
};
