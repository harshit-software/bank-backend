const jwt = require("jsonwebtoken");
const User = require("../models/User");

const initiateFunds = async (req, res, next) => {
  const token = req.headers.cookies || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access, Missing token",
    });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("+systemUser");
    if (!user || !user.systemUser) {
      return res.status(403).json({
        success: false,
        message: "Forbidden Access, Not a system user",
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
