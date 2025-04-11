import { ViewProfile } from "../../src/pages/ViewProfile/ViewProfile";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { getUser } from "../../src/services/users";
import { getPostsByUser } from "../../src/services/posts";
import { getPosts } from "../../src/services/posts";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

vi.mock("../../src/services/users", () => {
  const getUserMock = vi.fn();
  return { getUser: getUserMock };
});

vi.mock("../../src/services/posts", () => {
  const getPostsByUserMock = vi.fn();
  const getPostsMock = vi.fn();
  return { getPostsByUser: getPostsByUserMock, getPosts: getPostsMock };
});

describe("View another user's profile", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });

  test.skip("user's profile picture, username, and date of creation render if no posts", async () => {
    window.localStorage.setItem("token", "testToken");
    const mockUser = {
      username: "testUser",
      dateCreated: "2025-04-07T14:10:05.266+00:00",
      profilePicture:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      email: "testEmail",
      password: "1!Acebook",
    };

    const mockUser2 = {
      username: "testUser2",
      dateCreated: "2025-04-07T14:10:05.266+00:00",
      profilePicture:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
      email: "testEmail2",
      password: "2!Acebook",
    };

    getUser.mockResolvedValue(mockUser);

    getPostsByUser.mockResolvedValue({
      foundUser: mockUser2,
    });

    getPosts.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ViewProfile />
      </MemoryRouter>,
    );

    const usernameEl = await screen.findByTestId("username");
    expect(usernameEl).toBeInTheDocument();
    expect(usernameEl).toHaveTextContent("testUser2");
  });
});
