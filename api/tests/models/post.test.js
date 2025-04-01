require("../mongodb_helper");
const mongoose = require("mongoose");
const Post = require("../../models/post");
const User = require("../../models/user");

const imageURL = "exampleImageURLHere";

describe("Post model", () => {
  let user;
  let post;

  beforeEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});

    user = await User.create({
      email: "someone@example.com",
      password: "password",
      username: "someone",
    });

    const users = await User.find();
    const userId = users[0]._id;

    post = await Post.create({
      message: "some message",
      image: imageURL,
      userId: userId,
    });
  });

  it("when saved, a post has a message", async () => {
    expect(post.message).toEqual("some message");
  });

  // image
  it("has an image", async () => {
    expect(post.image).toEqual("exampleImageURLHere");
  });

  // dateTime - verified with mongoose timestamps
  it("has a created date", async () => {
    expect(post.createdAt).toBeInstanceOf(Date);
    expect(post.updatedAt).toBeInstanceOf(Date);
  });

  // userId attached to post object
  it("has a userId attached to post", async () => {
    expect(mongoose.Types.ObjectId.isValid(post.userId)).toBe(true);
  });

  it("can list all posts", async () => {
    await Post.deleteMany({});
    const posts = await Post.find();
    expect(posts).toEqual([]);
  });
});
