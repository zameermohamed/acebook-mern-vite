const Post = require("../models/post");
const User = require("../models/user");

const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
    const posts = await Post.find().populate("userId");
    const token = generateToken(req.user_id);
    res.status(200).json({ posts: posts, token: token });
}

async function getPostsByUser(req, res) {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const foundPosts = await Post.find({ userId: user._id });
        res.status(200).json({ posts: foundPosts, foundUser: user });
    } catch (err) {
        console.error(err);
    }
}

async function getPost(req, res, next) {
    const postId = req.params.id;
    try {
        const foundPost = await Post.findOne({ _id: postId }).populate(
            "userId"
        );

        req.postData = foundPost;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid post ID format" });
    }
}

async function createPost(req, res) {
    const post = new Post({
        ...req.body,
        image: req.file.path,
    });
    post.save();
    const newToken = generateToken(req.user_id);
    res.status(201).json({ message: "Post created", token: newToken });
}

const PostsController = {
    getAllPosts: getAllPosts,
    getPost: getPost,
    createPost: createPost,
    getPostsByUser: getPostsByUser,
};

module.exports = PostsController;
