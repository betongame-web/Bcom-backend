const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      user: {
        userId: user.userId,
        profileLocked: user.profileLocked,
        profile: user.profile
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

router.post("/save-once", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.profileLocked) {
      return res.status(403).json({
        success: false,
        message: "Profile already submitted and locked"
      });
    }

    const {
      email = "",
      phone = "",
      lastName = "",
      firstName = "",
      dateOfBirth = "",
      placeOfBirth = "",
      documentType = "National ID card",
      documentNumber = "",
      documentIssueDate = "",
      country = "",
      city = "",
      address = ""
    } = req.body;

    user.profile = {
      email,
      phone,
      lastName,
      firstName,
      dateOfBirth,
      placeOfBirth,
      documentType,
      documentNumber,
      documentIssueDate,
      country,
      city,
      address
    };

    user.profileLocked = true;

    await user.save();

    return res.json({
      success: true,
      message: "Profile saved successfully and locked forever",
      user: {
        userId: user.userId,
        profileLocked: user.profileLocked,
        profile: user.profile
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