import { render, screen } from "@testing-library/react";
import NewPost from "../../src/components/NewPost/NewPost";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

// Mock react-router-dom
vi.mock("react-router-dom", () => {
  const linkMock = vi.fn();
  const LinkMock = () => linkMock;
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock, Link: LinkMock };
});

// Mock users service
vi.mock("../../src/services/users", () => {
  return {
    getUser: vi.fn(() =>
      Promise.resolve({
        username: "testUser",
        profilePicture: "https://example.com/profile.jpg",
        token: "fake-Token",
      }),
    ),
  };
});

// Mock posts service
vi.mock("../../src/services/posts", () => {
  return {
    createPost: vi.fn(() => Promise.resolve({ message: "Post created" })),
    // Include any other functions that might be imported
    getPosts: vi.fn(() => Promise.resolve({ posts: [] })),
    getPost: vi.fn(() =>
      Promise.resolve({
        /* mock post data */
      }),
    ),
    getPostsByUser: vi.fn(() =>
      Promise.resolve({
        /* mock user posts */
      }),
    ),
  };
});

describe("New Post", () => {
  beforeEach(() => {
    // Simulate logged-in state
    localStorage.setItem("token", "fake-token");
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks(); // reset window.fetch
  });

  test("Text renders with placeholder text", async () => {
    render(<NewPost />);

    const textArea = await screen.findByPlaceholderText("Write your post here");
    expect(document.body.contains(textArea)).toBe(true);
  });

  test("displays error message when text box isn't filled in and submit button is pressed", async () => {
    render(<NewPost />);

    await screen.findByPlaceholderText("Write your post here");
    const submitButton = await screen.getByTestId("submit-button");
    const user = userEvent.setup();
    await user.click(submitButton);
    expect(await screen.getByTestId("post-error-msg").textContent).toEqual(
      "Post must contain some text",
    );
  });
});
