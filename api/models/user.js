const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  fullName: { type: String, required: false },
  profilePicture: { type: String, required: false },
  bio: { type: String, required: false },
  dateCreated: { type: Date, default: Date.now },
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10); 
    // Hash password
    this.password = await bcrypt.hash(this.password, salt); 
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
