import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";
import { signup } from "../../src/services/authentication";
import { SignupPage } from "../../src/pages/Signup/SignupPage";

vi.mock("react-router-dom", () => {
  const linkMock = vi.fn();
  const LinkMock = () => linkMock;
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock, Link: LinkMock };
});

vi.mock("../../src/services/authentication", () => {
  const signupMock = vi.fn();
  return { signup: signupMock };
});

async function completeSignupForm(email, password, confirmPassword, username) {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email");
  const passwordInputEl = screen.getByLabelText("Password");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password");
  const usernameInputEl = screen.getByLabelText("Username");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, email);
  await user.type(passwordInputEl, password);
  await user.type(confirmPasswordInputEl, confirmPassword);
  await user.type(usernameInputEl, username);
  await user.click(submitButtonEl);
}

describe("Signup Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("shows error when passwords do not match", async () => {
    render(<SignupPage />);
  
    await completeSignupForm("test@email.com", "password123", "password124", "testuser");
  
    expect(screen.getByText("Passwords do not match.")).toBeDefined();
  });

  test("navigates to /login on successful signup", async () => {
    render(<SignupPage />);

    signup.mockResolvedValueOnce();

    const navigateMock = useNavigate();

    await completeSignupForm("test@email.com", "password123", "password123", "testuser");

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("navigates to /signup on unsuccessful signup", async () => {
    render(<SignupPage />);

    signup.mockRejectedValueOnce(new Error("Error signing up"));

    const navigateMock = useNavigate();

    await completeSignupForm("test@email.com", "password123", "password123", "testuser");

    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });
});
