const User = require("../models/user");
const { generateToken } = require("../lib/token");
const bcrypt = require("bcryptjs");

async function create(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const fullName = req.body.fullName;
        const profilePicture = req.body.profilePicture;
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
            profilePicture: foundUser.profilePicture,
            token: token,
        });
        console.log(foundUser);
    } catch (err) {
        return res.status(400).json({ message: "User not found" });
    }
}

async function updateUser(req, res) {
    try{
        const userId = req.user_id;
        const {
            username, 
            email, 
            password, 
            fullName, 
            profilePicture, 
            bio
        } = req.body;

        const update = {};
        if (username) {
            const existingUserName = await User.findOne({ username });
            if (existingUserName && existingUserName._id !== userId) {
                return res.status(400).json({ message: "Username is already in use" });
            }
            update.username = username;
        }
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id !== userId) {
                return res.status(400).json({ message: "Email is already in use" });
            }
            update.email = email;
        }
        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            update.password = hashedpassword;
        }
        if (fullName) {
            update.fullName = fullName;
        }
        if (profilePicture) {
            update.profilePicture = profilePicture;
        }
        if (bio) {
            update.bio = bio;
        }
        const updatedUser = await User.findByIdAndUpdate(userId, update, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (err){
        console.error("Error caught:", err);
        return res.status(400).json({ message: "Error updating user" });
    }
}
const deleteUser = async (req, res) =>
{
    try {
        const userId = req.user_id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error caught:", err);
        return res.status(400).json({ message: "Error deleting user" });
    }
}


const UsersController = {
    create: create,
    getUser: getUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
};

module.exports = UsersController;
