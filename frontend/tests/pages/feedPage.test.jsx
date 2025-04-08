import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getPosts } from "../../src/services/posts";

// Mocks
const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigateMock, // returns the mock function
  };
});

vi.mock("../../src/services/posts", () => {
  const getPostsMock = vi.fn();
  return { getPosts: getPostsMock };
});

describe("Feed Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
    navigateMock.mockClear(); // reset between tests
  });

  test("It displays posts from the backend", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockPosts = [{ userId: { _id: "1234" }, message: "Test Post 1" }];
    const mockUser = [
      { username: "testUser", email: "testEmail", password: "1!Acebook" },
    ];

    getPosts.mockResolvedValue({
      user: mockUser,
      posts: mockPosts,
      token: "newToken",
    });

    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    const post = await screen.findByTestId("post-message");
    expect(post.textContent).toEqual("Test Post 1");
  });

  test("It navigates to login if no token is present", async () => {
    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
