const User = require("../models/user");
const { generateToken } = require("../lib/token");

async function createToken(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Auth Error: User not found");
      return res.status(401).json({ message: "User not found" });
    }

    // 2️⃣ Compare the plain-text password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Auth Error: Passwords do not match");
      return res.status(401).json({ message: "Password incorrect" });
    }

    // 3️⃣ Generate JWT token if password matches
    const token = generateToken(user.id);
    res.status(201).json({ token: token, message: "OK" });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const AuthenticationController = {
  createToken: createToken,
};

module.exports = AuthenticationController;
