const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");
const CommentsController = require("../controllers/comments");

router.get("/", PostsController.getAllPosts);
router.get(
  "/:id",
  PostsController.getPost,
  CommentsController.getAllCommentsPerPost,
);
router.post("/", PostsController.createPost);
router.post("/:id", CommentsController.createComment); // Add this for comments

module.exports = router;
