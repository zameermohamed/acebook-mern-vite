const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

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

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email, password and username are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app).post("/users").send({
        email: "poppy@email.com",
        password: "Poppy1234!",
        username: "Poppy",
      });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app).post("/users").send({
        email: "scarconstt@email.com",
        password: "Scarconstt1234!",
        username: "scarconstt",
      });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com", username: "Sky" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain(
        "Email, password and username are required",
      );
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
        .send({ password: "Email1234!", username: "username" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain(
        "Email, password and username are required",
      );
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when username is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app).post("/users").send({
        email: "username@example.com",
        password: "Username1234!",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain(
        "Email, password and username are required",
      );
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({
        email: "username@example.com",
        password: "Username1234!",
      });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email isn't unique", () => {
    test("response code is 400", async () => {
      await request(app).post("/users").send({
        email: "poppy@email.com",
        password: "Poppy1234!",
        username: "Poppy",
      });

      const response = await request(app).post("/users").send({
        email: "poppy@email.com",
        password: "Poppy1234!",
        username: "Poppy1",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("Email is already in use");
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({
        email: "poppy@email.com",
        password: "Poppy1234!",
        username: "Poppy",
      });
      await request(app).post("/users").send({
        email: "poppy@email.com",
        password: "Poppy1234!",
        username: "Poppy1",
      });
      const users = await User.find();
      expect(users.length).toEqual(1);
    });
  });

  describe("POST, when username isn't unique", () => {
    test("response code is 400", async () => {
      await request(app).post("/users").send({
        email: "poppy@email.com",
        password: "Poppy1234!",
        username: "Poppy",
      });

      const response = await request(app).post("/users").send({
        email: "poppy1@email.com",
        password: "Poppy1234!",
        username: "Poppy",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("Username is already in use");
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({
        email: "poppy@email.com",
        password: "Poppy1234!",
        username: "Poppy",
      });
      await request(app).post("/users").send({
        email: "poppy1@email.com",
        password: "Poppy1234!",
        username: "Poppy",
      });
      const users = await User.find();
      expect(users.length).toEqual(1);
    });
  });

  describe("GET, when user is logged in", () => {
    test("the response code is 200", async () => {
      const user1 = new User({
        username: "testUsername",
        email: "test@email.com",
        password: "TestPassword123!",
        profilePicture: "profilePicturePath",
      });
      await user1.save();
      token = createToken(user1.id);

      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body.username).toEqual("testUsername");
      expect(response.body.profilePicture).toEqual("profilePicturePath");
    });
  });

  describe("GET, when wrong token return error", () => {
    test("the response code is 400", async () => {
      token = createToken("wrongInfo");

      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("User not found");
    });
  });

  describe("PUT, update user details", () => {
    test("successfully updates all user details", async () => {
      const user = new User({
        email: "test@user.com",
        password: "InitialPassword123!",
        username: "initialUser2",
        fullName: "Initial Name",
        bio: "Hello world!",
      });
      await user.save();
      const token = createToken(user._id);
      const response = await request(app)
        .put("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "updatedUser",
          email: "updatedEmail@example.com",
          fullName: "Updated Name",
          profilePicture: "updatedProfilePicturePath",
          bio: "Updated bio!",
          currentPassword: "InitialPassword123!",
          password: "NewValidPassword123!",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User updated successfully");
      expect(response.body.user.username).toBe("updatedUser");
      expect(response.body.user.email).toBe("updatedEmail@example.com");
      expect(response.body.user.fullName).toBe("Updated Name");
      expect(response.body.user.profilePicture).toBe(
        "updatedProfilePicturePath",
      );
      expect(response.body.user.bio).toBe("Updated bio!");

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.username).toBe("updatedUser");
      expect(updatedUser.email).toBe("updatedEmail@example.com");
      expect(updatedUser.fullName).toBe("Updated Name");
      expect(updatedUser.profilePicture).toBe("updatedProfilePicturePath");
      expect(updatedUser.bio).toBe("Updated bio!");
    });

    test("when username is in use throws an error", async () => {
      const user1 = new User({
        email: "test@user.com",
        password: "InitialPassword123!",
        username: "initialUser1",
        fullName: "Initial Name",
        bio: "Hello world!",
      });
      await user1.save();

      const user2 = new User({
        email: "test2@user.com",
        password: "InitialPassword123!",
        username: "initialUser2",
        fullName: "Initial Namee",
        bio: "Hello world!!",
      });
      await user2.save();

      const token1 = createToken(user1._id);
      const token2 = createToken(user2._id);

      const response = await request(app)
        .put("/users")
        .set("Authorization", `Bearer ${token1}`)
        .send({
          username: "initialUser2",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Username is already in use");
    });

    test("when email is in use throws an error", async () => {
      const user1 = new User({
        email: "test@user.com",
        password: "InitialPassword123!",
        username: "initialUser1",
        fullName: "Initial Name",
        bio: "Hello world!",
      });
      await user1.save();

      const user2 = new User({
        email: "test2@user.com",
        password: "InitialPassword123!",
        username: "initialUser2",
        fullName: "Initial Namee",
        bio: "Hello world!!",
      });
      await user2.save();

      const token1 = createToken(user1._id);
      const token2 = createToken(user2._id);

      const response = await request(app)
        .put("/users")
        .set("Authorization", `Bearer ${token1}`)
        .send({
          email: "test2@user.com",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is already in use");
    });

    test("successfully updates password", async () => {
      const user = new User({
        email: "test@user.com",
        password: "InitialPassword123!",
        username: "initialUser1",
        fullName: "Initial Name",
        bio: "Hello world!",
      });
      await user.save();
      const token = createToken(user._id);
      const response = await request(app)
        .put("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          password: "NewPassword123!",
          currentPassword: "InitialPassword123!",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User updated successfully");
    });

    test("throws an error when current password is wrong", async () => {
      const user = new User({
        email: "test@user.com",
        password: "InitialPassword123!",
        username: "initialUser1",
        fullName: "Initial Name",
        bio: "Hello world!",
      });
      await user.save();
      const token = createToken(user._id);
      const response = await request(app)
        .put("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          password: "NewPassword123!",
          currentPassword: "InitialPassword13!",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Current password is incorrect");
    });

    test("returns 400 if an error occurs during updateUser", async () => {
      const user = new User({
        email: "catchblock@test.com",
        password: "Password123!",
        username: "catchUser",
        fullName: "Catch Block Test",
      });
      await user.save();

      const token = createToken(user._id);

      jest.spyOn(User, "findById").mockImplementationOnce(() => {
        throw new Error("Simulated DB failure");
      });

      const response = await request(app)
        .put("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "newUsername",
          fullName: "Updated Name",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Simulated DB failure");

      User.findById.mockRestore();
    });

    test("returns 404 if user not found", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const token = createToken(fakeUserId);

      const response = await request(app)
        .put("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "Username",
          email: "newemail@example.com",
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("DELETE /users", () => {
    test("successfully deletes a user", async () => {
      const user = new User({
        email: "deleteuser@example.com",
        password: "Password123!",
        username: "deleteUser",
        fullName: "Delete Me",
        bio: "Temporary user",
      });
      await user.save();

      const token = createToken(user._id);

      const response = await request(app)
        .delete("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User deleted successfully");

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    test("returns 404 if user not found", async () => {
      const fakeUserId = "643e47a4b4d8f6a8b96e25c1";
      const token = createToken(fakeUserId);

      const response = await request(app)
        .delete("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });

    test("returns 400 if an error occurs during deletion", async () => {
      const user = new User({
        email: "erroruser@example.com",
        password: "Password123!",
        username: "errorUser",
        fullName: "Error Test",
      });
      await user.save();

      const token = createToken(user._id);

      jest.spyOn(User, "findByIdAndDelete").mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const response = await request(app)
        .delete("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Database error");

      User.findByIdAndDelete.mockRestore();
    });
  });
});
