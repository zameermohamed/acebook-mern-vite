const CommentsController = require("../../controllers/comments");
const Comment = require("../../models/comment");

// Mock the Comment model
jest.mock("../../models/comment");

describe("CommentsController", () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Set up request and response objects
    req = {
      params: { id: "mockPostId" },
      user_id: "mockUserId",
      body: {},
      postData: { title: "Mock Post" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getAllCommentsPerPost", () => {
    it("should return all comments for a post", async () => {
      // Arrange
      const mockComments = [
        { _id: "comment1", postId: "mockPostId", message: "First comment" },
        { _id: "comment2", postId: "mockPostId", message: "Second comment" },
      ];

      Comment.find.mockResolvedValue(mockComments);

      // Act
      await CommentsController.getAllCommentsPerPost(req, res);

      // Assert
      expect(Comment.find).toHaveBeenCalledWith({ postId: "mockPostId" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        postData: req.postData,
        comments: mockComments,
      });
    });

    it("should handle empty comment list", async () => {
      // Arrange
      Comment.find.mockResolvedValue([]);

      // Act
      await CommentsController.getAllCommentsPerPost(req, res);

      // Assert
      expect(Comment.find).toHaveBeenCalledWith({ postId: "mockPostId" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        postData: req.postData,
        comments: [],
      });
    });
  });

  describe("createComment", () => {
    beforeEach(() => {
      // Additional setup for createComment tests
      req.body.message = "Test comment message";

      // Mock the Comment constructor and its save method
      Comment.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(undefined),
      }));
    });

    it("should create a new comment successfully", async () => {
      // Act
      await CommentsController.createComment(req, res);

      // Assert
      expect(Comment).toHaveBeenCalledWith({
        postId: "mockPostId",
        userId: "mockUserId",
        message: "Test comment message",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Comment created" });
    });

    it("should handle other errors", async () => {
      // Arrange
      const generalError = new Error("Something went wrong");

      const mockComment = {
        save: jest.fn().mockRejectedValue(generalError),
      };

      Comment.mockImplementation(() => mockComment);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      // Act
      await CommentsController.createComment(req, res);

      // Assert
      expect(consoleSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Something went wrong",
      });

      // Clean up
      consoleSpy.mockRestore();
    });

    it("should handle missing message in request body", async () => {
      // Arrange
      req.body = {}; // Empty body

      // Act
      await CommentsController.createComment(req, res);

      // Assert
      // The controller doesn't specifically validate this case, but we can test
      // that it attempts to create a Comment with an undefined message
      expect(Comment).toHaveBeenCalledWith({
        postId: "mockPostId",
        userId: "mockUserId",
        message: undefined,
      });
    });
  });
});
