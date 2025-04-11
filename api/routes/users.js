const express = require("express");
const tokenChecker = require("../middleware/tokenChecker");

const UsersController = require("../controllers/users");
const PostsController = require("../controllers/posts");

const router = express.Router();

router.post("/", UsersController.create);

router.get("/", tokenChecker, UsersController.getUser);

router.put("/", tokenChecker, UsersController.updateUser);

router.delete("/", tokenChecker, UsersController.deleteUser);
router.get("/:username", tokenChecker, PostsController.getPostsByUser);

module.exports = router;
