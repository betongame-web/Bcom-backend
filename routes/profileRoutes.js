const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const allowedFields = [
  "email",
  "phone",
  "lastName",
  "firstName",
  "dateOfBirth",
  "placeOfBirth",
  "documentNumber",
  "documentIssueDate",
  "city",
  "address"
];

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
        profile: {
          email: user.profile?.email || "",
          phone: user.profile?.phone || "",
          lastName: user.profile?.lastName || "",
          firstName: user.profile?.firstName || "",
          dateOfBirth: user.profile?.dateOfBirth || "",
          placeOfBirth: user.profile?.placeOfBirth || "",
          documentType: user.profile?.documentType || "National ID card",
          documentNumber: user.profile?.documentNumber || "",
          documentIssueDate: user.profile?.documentIssueDate || "",
          country: user.profile?.country || "Pakistan",
          city: user.profile?.city || "",
          address: user.profile?.address || ""
        },
        fieldLocks: {
          email: Boolean(user.fieldLocks?.email),
          phone: Boolean(user.fieldLocks?.phone),
          lastName: Boolean(user.fieldLocks?.lastName),
          firstName: Boolean(user.fieldLocks?.firstName),
          dateOfBirth: Boolean(user.fieldLocks?.dateOfBirth),
          placeOfBirth: Boolean(user.fieldLocks?.placeOfBirth),
          documentNumber: Boolean(user.fieldLocks?.documentNumber),
          documentIssueDate: Boolean(user.fieldLocks?.documentIssueDate),
          city: Boolean(user.fieldLocks?.city),
          address: Boolean(user.fieldLocks?.address)
        }
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

router.post("/save-field", authMiddleware, async (req, res) => {
  try {
    const { field, value } = req.body;

    if (!field || !allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: "Invalid field"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.fieldLocks?.[field]) {
      return res.status(403).json({
        success: false,
        message: "This field is already locked"
      });
    }

    if (!user.profile) {
      user.profile = {};
    }

    if (!user.fieldLocks) {
      user.fieldLocks = {};
    }

    user.profile[field] = String(value || "").trim();

    if (!user.profile.country) {
      user.profile.country = "Pakistan";
    }

    if (!user.profile.documentType) {
      user.profile.documentType = "National ID card";
    }

    user.fieldLocks[field] = true;

    await user.save();

    return res.json({
      success: true,
      message: "Field saved successfully",
      user: {
        userId: user.userId,
        profile: user.profile,
        fieldLocks: user.fieldLocks
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