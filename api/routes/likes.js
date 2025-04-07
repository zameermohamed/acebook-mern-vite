const express = require("express");
const router = express.Router();

const LikesController = require("../controllers/likes");

// Like a post
router.post("/:postId/like", LikesController.likePost);

// Unlike a post
router.post("/:postId/unlike", LikesController.unLikePost);

// Get all likes for a post - tbd
// router.get("/postId/likes", getAllLikes);

module.exports = router;
