const Like = require("../models/like");
const Post = require("../models/post");

// can access userId from req.user_id as seen in middleware

async function likePost(req, res) {
  const userId = req.user_id;
  const { postId } = req.params;

  try {
    // duplicate check for a like
    const existingLike = await Like.findOne({ userId, postId });

    if (existingLike) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    // If no duplicate, creates a new like, incrementing the count by 1
    // $inc is MongoDD incrementor, used to increment or decrement a number with + or -
    const like = await Like.create({ userId, postId });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

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
  const { postId } = req.params;

  try {
    const existingLike = await Like.findOne({ userId, postId });

    if (!existingLike) {
      return res
        .status(400)
        .json({ error: "Can't unlike - you have not liked this post yet" });
    }

    await Like.findOneAndDelete({ userId, postId });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

    res.status(200).json({ message: "Post unliked!" });
  } catch (error) {
    console.error("likes controller error:", error);

    res
      .status(400)
      .json({ error: "Something went wrong whilst unliking this post" });
  }
}

// Left comment in for now in case we want this functionality
// async function getAllLikes(req, res) {}

const LikesController = {
  likePost,
  unLikePost,
  // getAllLikes,
};

module.exports = LikesController;
