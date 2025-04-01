require("../mongodb_helper");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

describe("User model", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("has an email address", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      username:"username"
    });
    expect(user.email).toEqual("someone@example.com");
  });

  it("has a password", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      username:"username"
    });
    expect(user.password).toEqual("password");
  });

  it("has a username", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      username:"username"
    });
    expect(user.username).toEqual("username");
  });

  it("can list all users", async () => {
    const users = await User.find();
    expect(users).toEqual([]);
  });

  it("can save a user", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "Password123!",
      username: "username"
    });

    await user.save();
    const savedUser = await User.findOne({email:"someone@example.com"});
    expect(savedUser.email).toEqual("someone@example.com");
    expect(savedUser.username).toEqual("username");

    expect(savedUser.password).not.toEqual("Password123!");

    const isMatch = await bcrypt.compare("Password123!", savedUser.password);
    expect(isMatch).toBe(true);
  });

  it("Email is required", async () => {
    const user = new User({
      email: "",
      password: "Someone123!",
      username: "username"
    });
  
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error.errors.username.message).toBe("Username must be at least 3 characters");
  });
});

describe("Password validations", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("Password must be at leat 8 characters", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "12",
      username: "username"
    });
  
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error.errors.password.message).toBe("Password must be at least 8 characters");
  });

  it("Password must include at least one lower case letter", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "SOMEONE123!",
      username: "username"
    });
  
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error.errors.password.message).toBe("Password must have at least one uppercase letter, one lowercase letter, one number, and one special character");
  });

  it("Password must include at least one upper case letter", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "someone123!",
      username: "username"
    });
  
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error.errors.password.message).toBe("Password must have at least one uppercase letter, one lowercase letter, one number, and one special character");
  });

  it("Password must include at least one number", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "someone!",
      username: "username"
    });
  
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error.errors.password.message).toBe("Password must have at least one uppercase letter, one lowercase letter, one number, and one special character");
  });

  it("Password must include at least one special character", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "Someone123",
      username: "username"
    });
  
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error.errors.password.message).toBe("Password must have at least one uppercase letter, one lowercase letter, one number, and one special character");
  });
})

describe("Username validations", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("Username must be at leat 3 characters", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "Someone123!",
      username: "us"
    });
  
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error.errors.username.message).toBe("Username must be at least 3 characters");
  });

  it("Username field is required", async () => {
    const user = new User({
      email: "someone@example.com",
      password: "Someone123!",
      username: ""
    });
  
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error.errors.username.message).toBe("Username is required");
  });
})