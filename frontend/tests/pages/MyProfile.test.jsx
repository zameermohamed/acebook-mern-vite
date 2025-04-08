import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { getPostsByUser } from "../../src/services/posts";
import { getUser } from "../../src/services/users";
import { MemoryRouter } from "react-router-dom";
import { MyProfile } from "../../src/pages/MyProfile/MyProfile";

vi.mock("../../src/services/posts", () => {
    const getPostsByUserMock = vi.fn();
    return { getPostsByUser: getPostsByUserMock };
  });
vi.mock("../../src/services/users", () => {
    const getUserMock = vi.fn();
    return { getUser: getUserMock };
  });

describe("View my profile", () => {
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
      getUser.mockResolvedValue({
        userData: mockUser.username,
        email: mockUser.email,
        profilePicture: mockUser.profilePicture,
        dateCreated: mockUser.dateCreated,
      })
      render(
        <MemoryRouter>
          <MyProfile />
        </MemoryRouter>
      );

      const usernameEl = await screen.findByTestId("username")
      expect(document).toContain(usernameEl)
    })
})