const express = require("express");
const tokenChecker = require("../middleware/tokenChecker");

const UsersController = require("../controllers/users");
const PostsController = require("../controllers/posts");

const router = express.Router();

router.post("/", UsersController.create);
// MICHAL & ALEC - add token checker to get user_id on request
router.get("/", tokenChecker, UsersController.getUser);
// AYSIN - add token checker to update the user
router.put("/", tokenChecker, UsersController.updateUser);
// AYSIN - add token checker to delete the user
router.delete("/", tokenChecker, UsersController.deleteUser);

module.exports = router;
