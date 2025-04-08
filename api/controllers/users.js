const User = require("../models/user");
const { generateToken } = require("../lib/token");

async function create(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const fullName = req.body.fullName;
    const profilePicture =
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
    const bio = req.body.bio;

    if (!email || !password || !username) {
      throw new Error("Email, password and username are required");
      // return res
      //     .status(400)
      //     .json({ message: "Email, password and username are required" });
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      throw new Error("Email is already in use");
      // return res.status(400).json({ message: "Email is already in use" });
    }

    const existingUserUserName = await User.findOne({ username });
    if (existingUserUserName) {
      throw new Error("Username is already in use");
      // return res
      //     .status(400)
      //     .json({ message: "Username is already in use" });
    }

    const user = new User({
      email,
      password,
      username,
      fullName,
      profilePicture,
      bio,
    });
    await user.save();

    res.status(201).json({ message: "OK" });
  } catch (err) {
    console.error("Error caught:", err);

    // other errors
    return res.status(400).json({ message: err.message });
  }
}

async function getUser(req, res) {
    try {
        const foundUser = await User.findOne({ _id: req.user_id });
        const token = generateToken(req.user_id);
        res.status(200).json({
            username: foundUser.username,
            email: foundUser.email,
            profilePicture: foundUser.profilePicture,
            dateCreated: foundUser.dateCreated,
            token: token,
        });
        console.log(foundUser);
    } catch (err) {
        return res.status(400).json({ message: "User not found" });
    }
}

async function getOtherUser(req, res) {
    const username = req.params.username;
    try {
        const foundUser = await User.findOne({ username: username });
        res.status(200).json({
            username: foundUser.username,
            profilePicture: foundUser.profilePicture,
            dateCreated: foundUser.dateCreated,
        });
        console.log("from users: ")
    } catch (err) {
        return res.status(400).json({ message: "Invalid username"})
    }
}

const UsersController = {
    create: create,
    getUser: getUser,
    getOtherUser: getOtherUser
};

module.exports = UsersController;
