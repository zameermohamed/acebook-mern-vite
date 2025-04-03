const express = require("express");
const router = express.Router();

const CommentsController = require("../controllers/comments");

router.get("/", CommentsController.getAllCommentsPerPost);
router.post("/", CommentsController.createComment);

module.exports = router;