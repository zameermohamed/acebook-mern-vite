import { render, screen } from "@testing-library/react";
import AddComment from "../../src/components/AddComment/AddComment";
import { describe } from "vitest";
import userEvent from "@testing-library/user-event";

describe("AddComment", () => {
  test("renders the AddComment component", () => {
    render(<AddComment />);
    const textArea = screen.getByPlaceholderText("Comment ...");
    const submitButton = screen.getByRole("submit-button");
    expect(document).toContain(textArea);
    expect(document).toContain(submitButton);
  });

  test("displays error message when comment is empty", async () => {
    render(<AddComment />);
    const submitButton = screen.getByRole("submit-button");
    await submitButton.click();
    expect(screen.getByTestId("error-string").textContent).toEqual(
      "Post must contain some text",
    );
  });
  test("displays error message when comment is empty and enter is pressed", async () => {
    render(<AddComment />);
    const textArea = screen.getByPlaceholderText("Comment ...");
    await userEvent.type(textArea, "{enter}"); // Simulate typing an empty comment
    expect(screen.getByTestId("error-string").textContent).toEqual(
      "Post must contain some text",
    );
  });
  test("updates text state on input change", async () => {
    render(<AddComment />);
    const textArea = screen.getByPlaceholderText("Comment ...");
    await userEvent.type(textArea, "This is a test comment");
    expect(textArea.value).toBe("This is a test comment");
  });
});
