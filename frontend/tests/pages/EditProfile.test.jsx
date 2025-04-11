import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { EditProfile } from "../../src/pages/MyProfile/EditProfile";
import { getUser, updateUser, deleteUser } from "../../src/services/users";
import { useNavigate } from "react-router-dom";

const navigateMock = vi.fn();

vi.mock("react-router-dom", () => {
  const actual = vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

vi.mock("../../src/services/users", () => ({
  getUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

async function completeEditProfileForm() {
  const user = userEvent.setup();

  await user.clear(screen.getByLabelText("Username"));
  await user.type(screen.getByLabelText("Username"), "newusername");

  await user.clear(screen.getByLabelText("Email"));
  await user.type(screen.getByLabelText("Email"), "newemail@example.com");

  await user.clear(screen.getByLabelText("Full Name"));
  await user.type(screen.getByLabelText("Full Name"), "New Full Name");

  await user.clear(screen.getByLabelText("Profile Picture URL"));
  await user.type(
    screen.getByLabelText("Profile Picture URL"),
    "http://example.com/newpic.jpg",
  );

  await user.clear(screen.getByLabelText("Bio"));
  await user.type(screen.getByLabelText("Bio"), "Updated bio content.");

  await user.clear(screen.getByLabelText("Current Password"));
  await user.type(screen.getByLabelText("Current Password"), "oldpassword");

  await user.clear(screen.getByLabelText("New Password"));
  await user.type(screen.getByLabelText("New Password"), "newpassword");

  const submitButton = screen.getByRole("button", { name: /save changes/i });
  await user.click(submitButton);
}

describe("EditProfile Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem("token", "fake-token");
  });

  test("updates profile and shows success message", async () => {
    const mockUserData = {
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      profilePicture: "http://example.com/pic.jpg",
      bio: "This is a test bio.",
    };

    getUser.mockResolvedValue(mockUserData);
    updateUser.mockResolvedValue({ message: "Profile updated successfully" });

    render(<EditProfile />);
    await screen.findByDisplayValue("testuser");
    await completeEditProfileForm();

    expect(updateUser).toHaveBeenCalledWith(
      {
        username: "newusername",
        email: "newemail@example.com",
        fullName: "New Full Name",
        profilePicture: "http://example.com/newpic.jpg",
        bio: "Updated bio content.",
        currentPassword: "oldpassword",
        password: "newpassword",
      },
      "fake-token",
    );

    await waitFor(() => screen.getByText("Profile updated successfully"));
  });

  test("shows error when profile update fails", async () => {
    const mockUserData = {
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      profilePicture: "http://example.com/pic.jpg",
      bio: "This is a test bio.",
    };

    getUser.mockResolvedValue(mockUserData);
    updateUser.mockRejectedValue(new Error("Failed to update profile"));

    render(<EditProfile />);
    await screen.findByDisplayValue("testuser");
    await completeEditProfileForm();

    await waitFor(() => screen.getByText("Failed to update profile"));
  });

  test("deletes account and navigates to signup page", async () => {
    getUser.mockResolvedValue({
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      profilePicture: "http://example.com/pic.jpg",
      bio: "Test bio",
    });
    deleteUser.mockResolvedValue();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<EditProfile />);
    await screen.findByDisplayValue("testuser");

    const deleteButton = screen.getByRole("button", {
      name: /delete account/i,
    });
    await userEvent.click(deleteButton);

    expect(deleteUser).toHaveBeenCalledWith("fake-token");
    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });

  test("shows error when delete account fails", async () => {
    getUser.mockResolvedValue({
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      profilePicture: "http://example.com/pic.jpg",
      bio: "Test bio",
    });
    deleteUser.mockRejectedValue(new Error("Failed to delete account"));
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<EditProfile />);
    await screen.findByDisplayValue("testuser");

    const deleteButton = screen.getByRole("button", {
      name: /delete account/i,
    });
    await userEvent.click(deleteButton);

    await waitFor(() => screen.getByText("Failed to delete account"));
  });
});
