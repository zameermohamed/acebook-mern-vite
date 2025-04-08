const request = require("supertest");
const app = require("../../app");
const JWT = require("jsonwebtoken");

const Like = require("../../models/like");
const User = require("../../models/user");
const Post = require("../../models/post");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;
function createToken(userId) {
  return JWT.sign(
    {
      user_id: userId,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
}

describe("Likes Controller", () => {
  let testUser, testPost, token;

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

    token = createToken(testUser._id);

    jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore the original console.error implementation
  });

  test("allows a user to like a post", async () => {
    const response = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .send({ userId: testUser._id })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
  });

  test("prevents a user from liking the same post twice", async () => {
    const firstResponse = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .send({ userId: testUser._id })
      .set("Authorization", `Bearer ${token}`);

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .send({ userId: testUser._id })
      .set("Authorization", `Bearer ${token}`);

    expect(secondResponse.status).toBe(400);
    expect(secondResponse.body.error).toBe("You have already liked this post");
  });

  test("lets a user unlike a previously liked post", async () => {
    const likeResponse = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .send({ userId: testUser._id })
      .set("Authorization", `Bearer ${token}`);

    expect(likeResponse.status).toBe(201);

    const unlikeResponse = await request(app)
      .post(`/posts/${testPost._id}/unlike`)
      .send({ userId: testUser._id })
      .set("Authorization", `Bearer ${token}`);

    expect(unlikeResponse.status).toBe(200);
    expect(unlikeResponse.body.message).toBe("Post unliked!");
  });

  test("prevents a user from unliking a post they haven't liked", async () => {
    const response = await request(app)
      .post(`/posts/${testPost._id}/unlike`)
      .send({ userId: testUser._id })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Can't unlike - you have not liked this post yet"
    );
  });

  test("allows multiple users to like the same post", async () => {
    const userOneResponse = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .send({ userId: testUser._id })
      .set("Authorization", `Bearer ${token}`);

    expect(userOneResponse.status).toBe(201);

    // Creating second user
    const testUser2 = await User.create({
      email: "someoneelse@example.com",
      password: "Password123!",
      username: "someoneelse",
    });

    const tokenUser2 = createToken(testUser2._id);

    // Second user likes the same post
    const userTwoResponse = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .send({ userId: testUser2._id })
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(userTwoResponse.status).toBe(201);

    // Checking both likes have been added successfully
    const post = await Post.findById(testPost._id);
    expect(post.likesCount).toBe(2);
  });

  // Simulating database errors for liking and unliking posts

  test("handles errors during liking a post", async () => {
    // Mock database call to simulate an error when creating a like
    jest.spyOn(Like, "create").mockRejectedValue(new Error("Database Error"));

    const likeResponse = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .send({ userId: testUser._id })
      .set("Authorization", `Bearer ${token}`);

    expect(likeResponse.status).toBe(400);
    expect(likeResponse.body.error).toBe(
      "Something went wrong whilst liking this post"
    );
  });

  test("handles errors during unliking a post", async () => {
    // Mock database call to simulate an error when deleting a like
    jest
      .spyOn(Like, "findOneAndDelete")
      .mockRejectedValue(new Error("Database Error"));

    const likeResponse = await request(app)
      .post(`/posts/${testPost._id}/like`)
      .send({ userId: testUser._id })
      .set("Authorization", `Bearer ${token}`);

    expect(likeResponse.status).toBe(201);

    const unlikeResponse = await request(app)
      .post(`/posts/${testPost._id}/unlike`)
      .send({ userId: testUser._id })
      .set("Authorization", `Bearer ${token}`);

    expect(unlikeResponse.status).toBe(400);
    expect(unlikeResponse.body.error).toBe(
      "Something went wrong whilst unliking this post"
    );
  });
});
