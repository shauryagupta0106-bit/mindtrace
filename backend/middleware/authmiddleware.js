const User = require("../models/User");

// 🔐 Protect routes middleware
const protect = async (req, res, next) => {
  try {
    // Check if session exists
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authorized, please login" });
    }

    // Find user from DB
    const user = await User.findById(req.session.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(500).json({ message: "Server error in auth middleware" });
  }
};

module.exports = { protect };