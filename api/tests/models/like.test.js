require("../mongodb_helper");
const mongoose = require("mongoose");
const Post = require("../../models/post");
const User = require("../../models/user");
const Like = require("../../models/like");

describe("Like model", () => {
  let testUser, testPost, testLike;

  beforeEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    await Like.deleteMany({});

    testUser = await User.create({
      email: "someone@example.com",
      password: "Password123!",
      username: "someone",
    });

    testPost = await Post.create({
      message: "some message",
      userId: testUser._id,
    });

    testLike = await Like.create({
      userId: testUser._id,
      postId: testPost._id,
    });
  });

  it("should allow a user to like a post, with the userId and postId in the Like model matching", async () => {
    expect(testLike).toBeDefined();
    expect(testLike.userId).toEqual(testUser._id);
    expect(testLike.postId).toEqual(testPost._id);
  });

  it("should not allow a user to like the same post twice", async () => {
    // Trying to like same post again
    await expect(
      Like.create({ userId: testUser._id, postId: testPost._id })
    ).rejects.toThrow();
  });

  it("should allow a user to unlike a post", async () => {
    await Like.findOneAndDelete({ userId: testUser._id, postId: testPost._id });

    const checkLikeDeleted = await Like.findOne({
      userId: testUser._id,
      postId: testPost._id,
    });

    expect(checkLikeDeleted).toBeNull();
  });

  it("should handle unliking a post that wasn't liked", async () => {
    const checkDifferentUserIdInLikes = await Like.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(),
      postId: testPost._id,
    });

    expect(checkDifferentUserIdInLikes).toBeNull();
  });

  it("should retrieve all likes for a post", async () => {
    // Creating a second user to like the same post set above in beforeEach
    const testUserTwo = await User.create({
      email: "someotherone@example.com",
      password: "passWord123!",
      username: "someoneelse",
    });

    const testLikeTwo = await Like.create({
      userId: testUserTwo._id,
      postId: testPost._id,
    });

    const likes = await Like.find({ postId: testPost._id });

    expect(likes.length).toBe(2);
    expect(likes[0].userId).toEqual(testUser._id);
    expect(likes[1].userId).toEqual(testUserTwo._id);
  });
});
