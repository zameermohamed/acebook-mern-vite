const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "photoPosts/"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

const PostsController = require("../controllers/posts");

router.get("/", PostsController.getAllPosts);
router.get("/:id", PostsController.getPost);
router.post("/", upload.single("picture"), PostsController.createPost);

module.exports = router;
