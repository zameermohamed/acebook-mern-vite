const Like = require("../models/like");
const Comment = require("../models/comment");
const Post = require("../models/post");

async function likePost(req, res) {
  const userId = req.user_id;
  const postId = req.params.id;

  try {
    // duplicate check for a like
    const existingLike = await Like.findOne({ userId, postId });

    if (existingLike) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    const like = await Like.create({ userId, postId });
    res.status(201).json({ message: "Post liked!", like });
  } catch (error) {
    console.error("likes controller error:", error);

    res
      .status(400)
      .json({ error: "Something went wrong whilst liking this post" });
  }
}

async function unLikePost(req, res) {
  const userId = req.user_id;
  const postId = req.params.id;

  try {
    const existingLike = await Like.findOne({ userId, postId });

    if (!existingLike) {
      return res
        .status(400)
        .json({ error: "Can't unlike - you have not liked this post yet" });
    }

    await Like.findOneAndDelete({ userId, postId });

    res.status(200).json({ message: "Post unliked!" });
  } catch (error) {
    console.error("likes controller error:", error);

    res
      .status(400)
      .json({ error: "Something went wrong whilst unliking this post" });
  }
}

async function getLikesFromPostID(req, res) {
  const userId = req.user_id;
  const posts = req.posts;

  try {
    const postIds = posts.map((post) => post._id);

    // Fetch all likes for these postIds
    const allLikes = await Like.find({ postId: { $in: postIds } });

    // Fetch all comments for these postIds
    const allComments = await Comment.find({ postId: { $in: postIds } });

    // Create maps for fast lookup
    const likesCountMap = {};
    const commentsCountMap = {};
    const userLikedSet = new Set();

    allLikes.forEach((like) => {
      const postIdStr = like.postId.toString();

      // Count total likes per post
      likesCountMap[postIdStr] = (likesCountMap[postIdStr] || 0) + 1;

      // Track posts the current user has liked
      if (like.userId.toString() === userId.toString()) {
        userLikedSet.add(postIdStr);
      }
    });

    // Count comments per post
    allComments.forEach((comment) => {
      const postIdStr = comment.postId.toString();
      commentsCountMap[postIdStr] = (commentsCountMap[postIdStr] || 0) + 1;
    });

    // Add likes and comments data to each post object
    const enrichedPosts = posts.map((post) => {
      const postIdStr = post._id.toString();

      return {
        ...post.toObject(),
        likesCount: likesCountMap[postIdStr] || 0,
        userHasLiked: userLikedSet.has(postIdStr),
        commentsCount: commentsCountMap[postIdStr] || 0,
      };
    });

    res.json({ posts: enrichedPosts, token: req.token });
  } catch (error) {
    console.error("Error getting likes and comments:", error);
    res
      .status(400)
      .json({ error: "Could not determine like and comment status" });
  }
}

const LikesController = {
  likePost,
  unLikePost,
  getLikesFromPostID,
};

module.exports = LikesController;
