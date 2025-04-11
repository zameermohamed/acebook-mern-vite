const mongoose = require("mongoose");
const User = require("./user");
const Post = require("./post");

const CommentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Comment field can not be empty"],
      maxlength: [240, "Comment must be less than 240 character"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "You must be logged in to comment"],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post isn't available"],
    },
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
