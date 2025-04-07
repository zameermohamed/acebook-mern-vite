const express = require("express");
const tokenChecker = require("../middleware/tokenChecker");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.create);
// MICHAL & ALEC - add token checker to get user_id on request
router.get("/", tokenChecker, UsersController.getUser);
router.get("/:username", tokenChecker, UsersController.getOtherUser)

module.exports = router;
