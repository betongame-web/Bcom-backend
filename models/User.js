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
    country: { type: String, default: "Pakistan" },
    city: { type: String, default: "" },
    address: { type: String, default: "" }
  },
  { _id: false }
);

const fieldLocksSchema = new mongoose.Schema(
  {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    lastName: { type: Boolean, default: false },
    firstName: { type: Boolean, default: false },
    dateOfBirth: { type: Boolean, default: false },
    placeOfBirth: { type: Boolean, default: false },
    documentNumber: { type: Boolean, default: false },
    documentIssueDate: { type: Boolean, default: false },
    city: { type: Boolean, default: false },
    address: { type: Boolean, default: false }
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
      default: ""
    },
    profile: {
      type: profileSchema,
      default: () => ({})
    },
    fieldLocks: {
      type: fieldLocksSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);