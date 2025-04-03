require("../mongodb_helper");
const mongoose = require("mongoose");
const Post = require("../../models/post");
const User = require("../../models/user");
const Comment = require("../../models/comment");

describe("Comment model", () => {
    let user1, user2;
    let post1Id, post2Id;
    let comment;

    beforeEach(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
        await Comment.deleteMany({});

        // Create users
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

        // Create posts
        const postUser1 = await Post.create({
            message: "User1's post",
            userId: user1._id, 
        });

        const postUser2 = await Post.create({
            message: "User2's post",
            userId: user2._id, 
        });

        user1Id = user1._id;
        user2Id = user2._id;
        post1Id = postUser1._id;
        post2Id = postUser2._id;

        // Create a comment
        comment = await Comment.create({
            message: "User1 commenting on User2's post",
            userId: user1Id,
            postId: post2Id,   
        });
    });

    it("when saved, a comment has a message", async () => {
        expect(comment.message).toEqual("User1 commenting on User2's post");
    });

    it("has a comment attached to a valid post", async () => {
        expect(mongoose.Types.ObjectId.isValid(comment.postId)).toBe(true);
    });

    it("has an associated post", async () => {
        expect(comment.postId).toEqual(post2Id);
    });

    it("has a userId attached to comment", async () => {
        expect(mongoose.Types.ObjectId.isValid(comment.userId)).toBe(true);
    });

    it("has an associated user", async () => {
        expect(comment.userId).toEqual(user1Id);
    });

    // dateTime - verified with mongoose timestamps
    it("has a created date", async () => {
        expect(comment.createdAt).toBeInstanceOf(Date);
    });

});
