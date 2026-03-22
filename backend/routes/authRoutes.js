const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");


// 🟢 Signup
router.post("/signup", signup);

// 🔵 Login
router.post("/login", login);

// 🔴 Logout
router.get("/logout", logout);

// 🟡 Get current user (protected)
router.get("/me", protect, getMe);


module.exports = router;