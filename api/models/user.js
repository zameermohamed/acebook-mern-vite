const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, "Email is required"],
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    unique: true,
    minlength: [8,"Password must be at least 8 characters"],
    validate: {
      validator: function (value) {
        // at least 8 chars, one uppercase, one lowercase, one number, one special char
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      },
      message:
        "Password must have at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  },
  username: { 
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [20, "Username cannot be more than 20 characters"],
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    unique: true,
  },
  fullName: { type: String, required: false },
  profilePicture: { type: String, required: false },
  bio: { type: String, required: false },
  dateCreated: { type: Date, default: Date.now },
});

// Hash password
UserSchema.pre("save", async function (next) {
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

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
