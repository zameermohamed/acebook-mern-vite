const mongoose = require("mongoose");
const User = require("./user");

const PostSchema = new mongoose.Schema(
  {
    message: { type: String, required: false },
    image: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
