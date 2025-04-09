const Comment = require("../models/comment");

async function getAllCommentsPerPost(req, res) {
  const commentsFromPost = await Comment.find({
    postId: req.params.id,
  }).populate("userId");

  res.status(200).json({
    postData: req.postData,
    comments: commentsFromPost,
  });
}

async function createComment(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user_id;
    const message = req.body.message;

    const comment = new Comment({ postId, userId, message });
    await comment.save();

    res.status(201).json({ message: "Comment created" });
  } catch (err) {
    console.error("Error caught:", err);
    //validation errors from comment model
    if (err.name == "ValidationError") {
      const errorMessages = Object.values(err.errors).map((val) => val.message);
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
