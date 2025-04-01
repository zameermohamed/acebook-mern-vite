const User = require("../models/user");

async function create(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const fullName = req.body.fullName;
    const profilePicture = req.body.profilePicture;
    const bio = req.body.bio;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    
    const existingUserUserName = await User.findOne({ username });
      if (existingUserUserName) {
        return res.status(400).json({ message: "Username is already in use" });
      }
    
    const user = new User({ email, password, username, fullName, profilePicture, bio });
    await user.save();
      
    res.status(201).json({ message:  "OK"  });

  } catch (err) {
    // console.error("Error caught:", err);
    //validation errors from user model
    if (err.name == 'ValidationError')
    {
      const errorMessages = Object.values(err.errors).map(val => val.message);
      console.log("Validation Error Messages:", errorMessages);
      return res.status(400).json({ message: errorMessages.join(", ") });
    }
    // other errors
    return res.status(400).json({ message: "Something went wrong" });
    }
}

const UsersController = {
  create: create,
};

module.exports = UsersController;
