const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const BlacklistToken = require("../models/BlacklistToken");
const { sendEmail } = require("../services/email");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id);
    sendEmail(
      email,
      "Welcome to Bank App",
      "Hello " +
        name +
        ",\n\nThank you for registering with our Bank App. We're excited to have you on board!",
    );
    res.cookie("token", token);
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Required" });
    }
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    const isPassword = await bcrypt.compare(password, isUser.password);
    if (!isPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    const token = generateToken(isUser._id);
    res.cookie("token", token);

    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      user: {
        _id: isUser._id,
        name: isUser.name,
        email: isUser.email,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    // Add the token to the blacklist
    await BlacklistToken.create({ token });

    // Clear the cookie
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
