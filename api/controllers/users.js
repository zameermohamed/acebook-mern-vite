const User = require("../models/user");

async function create(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const fullName = req.body.fullName;
    const profilePicture = req.body.profilePicture;
    const bio = req.body.bio;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    
    const user = new User({ email, password, username, fullName, profilePicture, bio });
    await user.save();
      
    console.log("User created, id:", user._id.toString());
    res.status(201).json({ message:  "OK"  });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Something went wrong" });
  }
};

const UsersController = {
  create: create,
};

module.exports = UsersController;
