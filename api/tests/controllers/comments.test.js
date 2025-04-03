const request = require("supertest");
const JWT = require("jsonwebtoken");
const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");
const Comment = require("../../models/comment");
const { decodeToken } = require("../../lib/token");
const { describe, beforeEach } = require("node:test");
const secret = process.env.JWT_SECRET;
require("../mongodb_helper");

function createToken(userId) {
  return JWT.sign(
    {
      user_id: userId,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret,
  );
}

let token;
describe("GET with a valid postId", () => {
  let post;
  beforeAll(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});
    user = new User({
      email: "post-test@test.com",
      password: "Post1234!",
      username: "posttest",
    });
    await user.save();
    token = createToken(user.id);
    post = new Post({
      message: "Hello World!",
      userId: user._id,
    });
    await post.save();
    console.log("post._id:", post._id);
    comment = new Comment({
      message: "Hi right back at you!",
      userId: user._id,
      postId: post._id,
    });
    await comment.save();
    console.log("comment.postId:", comment.postId);
  });
  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
  });

  it("getAllCommentsFromPost", async () => {
    const response = await request(app)
      .get(`/posts/${post._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body.comments).toBeDefined();
    expect(response.body.comments).toContainEqual(
      expect.objectContaining({
        message: "Hi right back at you!",
        userId: user._id.toString(),
        postId: post._id.toString(),
      }),
    );
  });
});
