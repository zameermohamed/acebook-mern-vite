const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
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
        secret
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
                "Email, password and username are required"
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
                "Email, password and username are required"
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
                "Email, password and username are required"
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
            expect(response.body.message).toContain(
                "Username is already in use"
            );
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
});
