
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditProfileForm from "../../src/components/EditProfileForm/EditProfileForm";
import '@testing-library/jest-dom';

describe("EditProfileForm", () => {
    const mockForm = {
      username: "testUser",
      email: "test@example.com",
      fullName: "Test User",
      profilePicture: "https://example.com/profile.jpg",
      bio: "This is my bio",
      currentPassword: "",
      password: "",
    };

    const setup = (overrides = {}) => {
      const props = {
        form: mockForm,
        error: "",
        message: "",
        onChange: vi.fn(),
        onSubmit: vi.fn((e) => e.preventDefault()),
        onDelete: vi.fn(),
        ...overrides,
      };

      render(<EditProfileForm {...props} />);
      return props;
    };

    test("renders form fields with initial values", () => {
      setup();

      expect(screen.getByDisplayValue("testUser")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
      expect(screen.getByDisplayValue("https://example.com/profile.jpg")).toBeInTheDocument();
      expect(screen.getByDisplayValue("This is my bio")).toBeInTheDocument();
    });

    test("calls onChange when input changes", async () => {
      const user = userEvent.setup();
      const { onChange } = setup();

      const usernameInput = screen.getByPlaceholderText("Username");
      await user.type(usernameInput, "123");

      expect(onChange).toHaveBeenCalled();
    });

    test("calls onSubmit when form is submitted", async () => {
      const user = userEvent.setup();
      const { onSubmit } = setup();

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      await user.click(saveButton);

      expect(onSubmit).toHaveBeenCalled();
    });

    test("calls onDelete when delete button is clicked", async () => {
      const user = userEvent.setup();
      const { onDelete } = setup();

      const deleteButton = screen.getByRole("button", { name: /delete account/i });
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalled();
    });

    test("displays error and success messages", () => {
      setup({ error: "Something went wrong", message: "Profile updated!" });

      expect(screen.getByText("Something went wrong")).toHaveClass("error");
      expect(screen.getByText("Profile updated!")).toHaveClass("success");
    });
});
