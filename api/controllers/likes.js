const Like = require("../models/like");
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
  const { postId } = req.params;

  try {
    const posts = req.posts;

    const postIds = posts.map((post) => post._id);

    // Fetch all likes for these postIds
    const allLikes = await Like.find({ postId: { $in: postIds } });

    // Create maps for fast lookup
    const likesCountMap = {};
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

    // Add likes data to each post object
    const enrichedPosts = posts.map((post) => {
      const postIdStr = post._id.toString();

      return {
        ...post.toObject(),
        likesCount: likesCountMap[postIdStr] || 0,
        userHasLiked: userLikedSet.has(postIdStr),
      };
    });

    res.json({ posts: enrichedPosts, token: req.token });
  } catch (error) {
    console.error("Error getting likes:", error);
    res.status(400).json({ error: "Could not determine like status" });
  }
}

const LikesController = {
  likePost,
  unLikePost,
  getLikesFromPostID,
};

module.exports = LikesController;
