const express = require("express");
const router = express.Router();

const LikesController = require("../controllers/likes");

// Like a post
router.post("/:id/like", LikesController.likePost);

// Unlike a post
router.post("/:id/unlike", LikesController.unLikePost);

// Check if user has liked a post
router.get("/", LikesController.getLikesFromPostID);

// Get all likes for a post - tbd
// router.get("/postId/likes", getAllLikes);

module.exports = router;
