import { ViewProfile } from "../../src/pages/ViewProfile/ViewProfile";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { getPostsByUser } from "../../src/services/posts";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../src/services/posts", () => {
    const getPostsByUserMock = vi.fn();
    return { getPostsByUser: getPostsByUserMock };
  });

describe("View another user's profile", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token")
  });

  test("user's profile picture, username, and date of creation render if no posts", async () => {
    window.localStorage.setItem("token", "testToken");
    const mockUser = [
      { username: "testUser", dateCreated: "2025-04-07T14:10:05.266+00:00", profilePicture: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg", email: "testEmail", password: "1!Acebook" },
      ];
        
      getPostsByUser.mockResolvedValue({
        foundUser: mockUser,
        token: "testToken"
      })
      render(
        <MemoryRouter>
          <ViewProfile />
        </MemoryRouter>
      );

      const usernameEl = await screen.findByTestId("username")
      expect(document).toContain(usernameEl)
    })
})