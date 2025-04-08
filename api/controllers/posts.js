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
    const foundPost = await Post.findOne({ _id: postId }).populate("userId");

    req.postData = foundPost;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid post ID format" });
  }
}

async function createPost(req, res) {
  req.body.userId = req.user_id;
  const post = new Post(req.body);
  await post.save();
  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "Post created", token: newToken });
}

const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user_id;
  try {
    const foundPost = await Post.findOne({ _id: postId });
    if (!foundPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    const userId_FromPost = foundPost.userId.toString();
    if (userId_FromPost != userId) {
      return res
        .status(403)
        .json({ message: "Unable to delete - User id not matching post" });
    }
    const deletedPost = await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error caught:", err);
    return res.status(400).json({ message: "Error deleting post" });
  }
};

const PostsController = {
  getAllPosts: getAllPosts,
  getPost: getPost,
  createPost: createPost,
  deletePost: deletePost,
  getPostsByUser: getPostsByUser,
};

module.exports = PostsController;
