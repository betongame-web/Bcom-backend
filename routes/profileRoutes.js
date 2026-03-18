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
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: {
        userId: user.userId,
        profileLocked: Boolean(user.profileLocked),
        profile: user.profile || {
          email: "",
          phone: "",
          lastName: "",
          firstName: "",
          dateOfBirth: "",
          placeOfBirth: "",
          documentType: "National ID card",
          documentNumber: "",
          documentIssueDate: "",
          country: "Pakistan",
          city: "",
          address: "",
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.post("/save-once", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profileLocked) {
      return res.status(403).json({
        success: false,
        message: "Profile already submitted and locked",
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
      country = "Pakistan",
      city = "",
      address = "",
    } = req.body;

    user.profile = {
      email: String(email).trim(),
      phone: String(phone).trim(),
      lastName: String(lastName).trim(),
      firstName: String(firstName).trim(),
      dateOfBirth: String(dateOfBirth).trim(),
      placeOfBirth: String(placeOfBirth).trim(),
      documentType: String(documentType).trim() || "National ID card",
      documentNumber: String(documentNumber).trim(),
      documentIssueDate: String(documentIssueDate).trim(),
      country: String(country).trim() || "Pakistan",
      city: String(city).trim(),
      address: String(address).trim(),
    };

    user.profileLocked = true;

    await user.save();

    return res.json({
      success: true,
      message: "Profile saved successfully and locked forever",
      user: {
        userId: user.userId,
        profileLocked: true,
        profile: user.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;