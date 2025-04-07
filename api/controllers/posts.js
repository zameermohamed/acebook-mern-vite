const Post = require("../models/post");
const { generateToken } = require("../lib/token");

async function getAllPosts(req, res) {
    const posts = await Post.find().populate("userId");

    const token = generateToken(req.user_id);
    res.status(200).json({ posts: posts, token: token });
}

async function getPost(req, res, next) {
    const postId = req.params.id;
    try {
        const foundPost = await Post.findOne({ _id: postId });
        req.postData = foundPost;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid post ID format" });
    }
}

async function createPost(req, res) {
    const post = new Post(req.body);
    post.save();
    const newToken = generateToken(req.user_id);
    res.status(201).json({ message: "Post created", token: newToken });
}

const PostsController = {
    getAllPosts: getAllPosts,
    getPost: getPost,
    createPost: createPost,
};

module.exports = PostsController;
