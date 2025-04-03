require("../mongodb_helper");
const mongoose = require("mongoose");
const Post = require("../../models/post");
const User = require("../../models/user");
const Comment = require("../../models/comment");
const imageURL = "exampleImageURLHere";

describe("Comment model", () => {
    let user;
    let post;
    let comment;

  beforeEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});

    user1 = await User.create({
        email: "someone@example.com",
        password: "Password123!",
        username: "someone",
    });
    user2 = await User.create({ 
        email: "someone1@example.com",
        password: "Password123!",
        username: "some_one",
    });

    const users = await User.find();
    const user1Id= users[0]._id;
    const user2Id = users[1]._id;
    
    postUser1 = await Post.create({
        message: "some message",
        userId: user1Id,
    });
    postUser2 = await Post.create({
        message: "some message",
        userId: user2Id,
    });
    const posts = await Post.find();
    const post1Id = posts[0]._id;
    const post2Id = posts[1]._id;


    comment = await Comment.create({
        message: "User1 commenting on User2's post",
        userId: user1Id,
        postId: post2Id
    });
  });

  it("when saved, a comment has a message", async () => {
    expect(comment.message).toEqual("User1 commenting on User2's post");
  });

  // image
  it("has an associated post", async () => {
    expect(comment.postId).toEqual(post2Id);
  });

  it("has an associated user", async () => {
    expect(comment.userId).toEqual(user1Id);
  });

  // dateTime - verified with mongoose timestamps
  it("has a created date", async () => {
    expect(comment.createdAt).toBeInstanceOf(Date);
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
