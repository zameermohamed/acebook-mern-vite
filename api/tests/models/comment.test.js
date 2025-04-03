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

describe("Comment message validations", () => {
    let user;
    let post;

    beforeEach(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
        await Comment.deleteMany({});

        user = await User.create({
            email: "someone@example.com",
            password: "Password123!",
            username: "someone",
        });

        post = await Post.create({
            message: "User's post",
            userId: user._id, 
        });
    })
    
    it("Message is required", async () => {
        let error;
        try {
            const comment = new Comment({
                message: "",
                userId: user._id,
                postId: post._id,   
            });
            await comment.save();
        } catch (err) {
        error = err;
        }
    
        expect(error.errors.message.message).toBe("Comment field can not be empty");
    });

    it("Message should be less than 240 characters", async () => {
        let error;
        try {
            const comment = new Comment({
                message: "a".repeat(241), // 241 characters
                userId: user._id,
                postId: post._id,   
            });
            await comment.save();
        } catch (err) {
        error = err;
        }

        expect(error.errors.message.message).toBe("Comment must be less than 240 character");
    });
    });


describe("Comment userId, postID validations", () => {
    let user;
    let post;

    beforeEach(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
        await Comment.deleteMany({});

        user = await User.create({
            email: "someone@example.com",
            password: "Password123!",
            username: "someone",
        });
        
        post = await Post.create({
            message: "User's post",
            userId: user._id, 
        });
    })

    it("userId is required", async () => {
        let error;

        try {
            const comment = new Comment({
                message: "userId check",
                userId: "" || null,
                postId: post._id,   
            });
            await comment.save();
        } catch (err) {
        error = err;
        }
    
        expect(error.errors.userId.message).toBe("You must be logged in to comment");
        });

    it("postId is required", async () => {
        let error;

        try {
            const comment = new Comment({
                message: "postId check",
                userId: user._id,
                postId: "" || null,  
            });
            await comment.save();
        } catch (err) {
        error = err;
        }
    
        expect(error.errors.postId.message).toBe("Post isn't available");
        });
    });



