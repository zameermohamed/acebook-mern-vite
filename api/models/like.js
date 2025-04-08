const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose compound index
// Confirms that every combination of userId and postId is unique ->
// A post can have likes by many users ->
// But a single user can only like a specific post once
LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = mongoose.model("Like", LikeSchema);

module.exports = Like;
