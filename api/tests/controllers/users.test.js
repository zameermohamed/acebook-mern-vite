const request = require("supertest");

const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email, password and username are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "poppy@email.com", password: "Poppy1234!", username: "Poppy"});

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({ email: "scarconstt@email.com", password: "Scarconstt1234!", username: "scarconstt" });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com", username: "Sky"});

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("Email, password and username are required")
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "Email1234!", username:"username" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("Email, password and username are required")
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when username is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email:"username@example.com", password: "Username1234!",  });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("Email, password and username are required")
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email:"username@example.com", password: "Username1234!",  });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email isn't unique", () => {
    test("response code is 400", async () => {
      await request(app).post("/users").send({ email: "poppy@email.com", password: "Poppy1234!", username: "Poppy"});
      
      const response = await request(app)
        .post("/users")
        .send({ email: "poppy@email.com", password: "Poppy1234!", username: "Poppy1"});

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("Email is already in use")
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "poppy@email.com", password: "Poppy1234!", username: "Poppy"});
      await request(app).post("/users").send({ email: "poppy@email.com", password: "Poppy1234!", username: "Poppy1"});
      const users = await User.find();
      expect(users.length).toEqual(1);
    });
  });

  describe("POST, when username isn't unique", () => {
    test("response code is 400", async () => {
      await request(app).post("/users").send({ email: "poppy@email.com", password: "Poppy1234!", username: "Poppy"});
      
      const response = await request(app)
        .post("/users")
        .send({ email: "poppy1@email.com", password: "Poppy1234!", username: "Poppy"});

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("Username is already in use")
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "poppy@email.com", password: "Poppy1234!", username: "Poppy"});
      await request(app).post("/users").send({ email: "poppy1@email.com", password: "Poppy1234!", username: "Poppy"});
      const users = await User.find();
      expect(users.length).toEqual(1);
    });
  });
});
