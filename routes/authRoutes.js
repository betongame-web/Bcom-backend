const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: "userId and password are required"
      });
    }

    const user = await User.findOne({ userId: userId.trim() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user ID or password"
      });
    }

    // Temporary plain test login
    if (user.userId !== "admin123" || password !== "123456") {
      return res.status(401).json({
        success: false,
        message: "Invalid user ID or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        userId: user.userId
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        profileLocked: user.profileLocked
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;