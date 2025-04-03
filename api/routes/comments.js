const express = require("express");
const router = express.Router();

const CommentsController = require("../controllers/comments");

router.get("/:postId", CommentsController.getAllCommentsPerPost);
router.post("/:postId", CommentsController.createComment);

module.exports = router;
