const request = require("supertest");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");

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
    secret,
  );
}

let token;
let user;
describe("/posts", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});

    user = new User({
      email: "post-test@test.com",
      password: "Post1234!",
      username: "posttest",
    });
    await user.save();
    token = createToken(user.id);
  });

  describe("POST, when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });
      expect(response.status).toEqual(201);
    });

    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!!" });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("Hello World!!");
    });

    test("returns a new token", async () => {
      const testApp = request(app);
      const response = await testApp
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world" });

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.status).toEqual(401);
    });

    test("a post is not created", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      const posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("the response code is 200", async () => {
      const post1 = new Post({
        message: "I love all my children equally",
        userId: user.id,
      });
      const post2 = new Post({
        message: "I've never cared for GOB",
        userId: user.id,
      });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("returns every post in the collection", async () => {
      const post1 = new Post({ message: "howdy!", userId: user.id });
      const post2 = new Post({ message: "hola!", userId: user.id });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;
      const firstPost = posts[0];
      const secondPost = posts[1];

      expect(firstPost.message).toEqual("howdy!");
      expect(secondPost.message).toEqual("hola!");
    });

    test("returns a new token", async () => {
      const post1 = new Post({ message: "First Post!", userId: user.id });
      const post2 = new Post({ message: "Second Post!", userId: user.id });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("GET, when token is missing", () => {
    test("the response code is 401", async () => {
      const post1 = new Post({ message: "howdy!", userId: user.id });
      const post2 = new Post({ message: "hola!", userId: user.id });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.status).toEqual(401);
    });

    test("returns no posts", async () => {
      const post1 = new Post({ message: "howdy!", userId: user.id });
      const post2 = new Post({ message: "hola!", userId: user.id });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      const post1 = new Post({ message: "howdy!", userId: user.id });
      const post2 = new Post({ message: "hola!", userId: user.id });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("DELETE, when a valid token is present", () => {
    test("responds with a 200 when given valid post id", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });
      const post_id = (await Post.find())[0]._id.toString();
      const response = await request(app)
        .delete(`/posts/${post_id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body.message).toBe("Post deleted successfully");
    });
    test("responds with a 404 when given invalid post id", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });
      const invalidId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/posts/${invalidId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(404);
      expect(response.body.message).toBe("Post not found");
    });

    test("responds with a 403 when trying to delete anothers users post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });
      const post_id = (await Post.find())[0]._id.toString();

      const user_2 = new User({
        email: "post-test-2@test.com",
        password: "Post4321!",
        username: "posttest_2",
      });
      await user_2.save();
      const token_2 = createToken(user_2.id);

      const response = await request(app)
        .delete(`/posts/${post_id}`)
        .set("Authorization", `Bearer ${token_2}`);
      expect(response.status).toEqual(403);
      expect(response.body.message).toBe(
        "Unable to delete - User id not matching post",
      );
    });
    test("responds with a 400 for other errors", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });
      const response = await request(app)
        .delete(`/posts/1111`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(400);
      expect(response.body.message).toBe("Error deleting post");
    });
  });
  describe("GET /posts/:id", () => {
    test("sets req.postData and calls next for a valid post ID", async () => {
      const post = new Post({ message: "Test Post", userId: user.id });
      await post.save();
      const post_id = post._id.toString();
      const response = await request(app)
        .get(`/posts/${post_id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(200);
    });

    test("responds with a 400 when given an invalid post ID format", async () => {
      const response = await request(app)
        .get("/posts/invalidId")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(400);
      expect(response.body.message).toBe("Invalid post ID format");
    });
  });
});
