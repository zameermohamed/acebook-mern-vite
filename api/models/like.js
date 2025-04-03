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

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = mongoose.model("Like", LikeSchema);

module.exports = Like;
