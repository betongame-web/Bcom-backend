const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const createUser = async () => {
  try {
    await connectDB();

    const userId = "1598145559";
    const plainPassword = "123456";

    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      console.log("User already exists");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const user = new User({
      userId,
      passwordHash,
      profileLocked: false
    });

    await user.save();

    console.log("User created successfully");
    console.log("userId:", userId);
    console.log("password:", plainPassword);

    process.exit(0);
  } catch (error) {
    console.error("Create user failed:", error.message);
    process.exit(1);
  }
};

createUser();