import { render, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PostPage } from "../../src/pages/Post/PostPage";
import { getPost } from "../../src/services/posts";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "mockPostId" }),
}));

// Mock dependencies
vi.mock("../../src/services/posts", () => ({
  getPost: vi.fn(),
}));

vi.mock("../../src/components/Header", () => ({
  default: ({ onThemeChange }) => (
    <div data-testid="mock-header">
      <button onClick={onThemeChange}>Toggle Theme</button>
    </div>
  ),
}));

vi.mock("../../src/components/AddComment/AddComment", () => ({
  default: ({ postId, onCommentCreated }) => (
    <div data-testid="mock-add-comment">
      <button onClick={onCommentCreated}>Add Comment</button>
    </div>
  ),
}));

vi.mock("../../src/components/CommentContainer/CommentContainer", () => ({
  default: ({ comments }) => (
    <div data-testid="mock-comment-container">
      Comments count: {comments.length}
    </div>
  ),
}));

vi.mock("../../src/components/PostContainer/PostContainer", () => ({
  default: ({ postId, singlePost, comments, theme }) => (
    <div data-testid="mock-post-container">
      PostID: {postId}, Single: {String(singlePost)}, Comments:{" "}
      {comments.length}, Theme: {theme}
    </div>
  ),
}));

describe("PostPage", () => {
  const mockComments = [
    { _id: "1", message: "First comment" },
    { _id: "2", message: "Second comment" },
  ];

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key) => {
          if (key === "token") return "mock-token";
          if (key === "theme") return "light";
          return null;
        }),
        setItem: vi.fn(),
      },
      writable: true,
    });

    // Mock document methods
    document.documentElement.setAttribute = vi.fn();

    // Mock successful API response
    getPost.mockResolvedValue({
      _id: "mockPostId",
      title: "Mock Post",
      content: "This is a mock post",
      comments: mockComments,
    });
  });

  it("renders loading state initially", () => {
    const { getByText } = render(<PostPage />);
    const loadingText = getByText("Loading comments...");
    expect(loadingText).toBeTruthy();
  });

  it("fetches post data and renders components when loaded", async () => {
    const { getByTestId, queryByText } = render(<PostPage />);

    // Verify loading state is shown initially
    expect(queryByText("Loading comments...")).toBeTruthy();

    // Wait for data to load
    await waitFor(() => {
      expect(queryByText("Loading comments...")).toBeFalsy();
    });

    // Verify components are rendered with correct props
    const postContainer = getByTestId("mock-post-container");
    expect(postContainer.textContent).toContain("PostID: mockPostId");
    expect(postContainer.textContent).toContain("Single: true");
    expect(postContainer.textContent).toContain("Comments: 2");

    const commentContainer = getByTestId("mock-comment-container");
    expect(commentContainer.textContent).toBe("Comments count: 2");

    // Verify getPost was called with correct params
    expect(getPost).toHaveBeenCalledWith("mock-token", "mockPostId");
  });

  it("handles theme toggle correctly", async () => {
    const { getByTestId } = render(<PostPage />);

    // Wait for the page to load
    await waitFor(() => {
      expect(getByTestId("mock-post-container")).toBeTruthy();
    });

    // Get and click the theme toggle button
    const header = getByTestId("mock-header");
    const themeToggleBtn = header.querySelector("button");
    fireEvent.click(themeToggleBtn);

    // Verify theme was toggled in localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");

    // Verify document attribute was updated
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "dark",
    );
  });

  it("refreshes comments when new comment is added", async () => {
    const { getByTestId } = render(<PostPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(getByTestId("mock-post-container")).toBeTruthy();
    });

    // Verify initial API call
    expect(getPost).toHaveBeenCalledTimes(1);

    // Trigger comment refresh
    const addComment = getByTestId("mock-add-comment");
    const addCommentBtn = addComment.querySelector("button");
    fireEvent.click(addCommentBtn);

    // Verify API was called again
    expect(getPost).toHaveBeenCalledTimes(2);
  });

  it("handles API error gracefully", async () => {
    // Mock API error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    getPost.mockRejectedValueOnce(new Error("API Error"));

    const { queryByText } = render(<PostPage />);

    // Wait for error handling
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching post and comments:",
        expect.any(Error),
      );
    });

    // Should still render the page without comments
    expect(queryByText("Loading comments...")).toBeFalsy();

    consoleErrorSpy.mockRestore();
  });

  it("does not fetch data when user is not logged in", async () => {
    // Override localStorage to simulate logged-out state
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
      },
      writable: true,
    });

    render(<PostPage />);

    // Wait a bit to ensure any async operations have completed
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify getPost was not called
    expect(getPost).not.toHaveBeenCalled();
  });

  it("loads theme from localStorage on initial render", () => {
    // Override localStorage to return dark theme
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key) => {
          if (key === "token") return "mock-token";
          if (key === "theme") return "dark";
          return null;
        }),
        setItem: vi.fn(),
      },
      writable: true,
    });

    const { getByTestId } = render(<PostPage />);

    // Wait for the page to load
    waitFor(() => {
      const postContainer = getByTestId("mock-post-container");
      expect(postContainer.textContent).toContain("Theme: dark");
    });
  });
});
