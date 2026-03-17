const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    lastName: { type: String, default: "" },
    firstName: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    placeOfBirth: { type: String, default: "" },
    documentType: { type: String, default: "National ID card" },
    documentNumber: { type: String, default: "" },
    documentIssueDate: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    address: { type: String, default: "" }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    profileLocked: {
      type: Boolean,
      default: false
    },
    profile: {
      type: profileSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);