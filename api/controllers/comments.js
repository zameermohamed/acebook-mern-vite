const Comment = require("../models/comment");
const { decodeToken } = require("../lib/token");

async function getAllCommentsPerPost(req, res) {
  try {
    const commentsFromPost = await Comment.find({ postId: req.params.postId });
    res.status(200).json({ comments: commentsFromPost });
  } catch (err) {
    console.error("Error retrieving comments:", err);

    // Handle different error types
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid post ID format" });
    }
  }
}

async function createComment(req, res) {
  try {
    const postId = req.params.postId;
    const payload = decodeToken(req.headers.authorization);
    const userId = payload.user_id;
    const message = req.body.message;

    const comment = new Comment({ postId, userId, message });
    await comment.save();

    res.status(201).json({ message: "Comment created" });
  } catch (err) {
    console.error("Error caught:", err);
    //validation errors from comment model
    if (err.name == "ValidationError") {
      const errorMessages = Object.values(err.errors).map((val) => val.message);
      console.log("Validation Error Messages:", errorMessages);
      return res.status(400).json({ message: errorMessages.join(", ") });
    }
    // other errors
    return res.status(400).json({ message: "Something went wrong" });
  }
}

const CommentsController = {
  getAllCommentsPerPost: getAllCommentsPerPost,
  createComment: createComment,
};

module.exports = CommentsController;
