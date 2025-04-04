const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.get("/:id", PostsController.getPost);
router.post("/", PostsController.createPost);

module.exports = router;
