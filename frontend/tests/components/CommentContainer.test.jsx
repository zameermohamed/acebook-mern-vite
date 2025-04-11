import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CommentContainer from "../../src/components/CommentContainer/CommentContainer";

describe("CommentContainer", () => {
  it('displays "no comments" message when comments array is empty', () => {
    const { getByText } = render(<CommentContainer comments={[]} />);
    const noCommentsMessage = getByText(
      "No comments yet. Be the first to comment!",
    );
    expect(noCommentsMessage).toBeTruthy();
  });

  it('displays "no comments" message when comments prop is undefined', () => {
    const { getByText } = render(<CommentContainer />);
    const noCommentsMessage = getByText(
      "No comments yet. Be the first to comment!",
    );
    expect(noCommentsMessage).toBeTruthy();
  });

  it("renders comments when they exist", () => {
    const mockComments = [
      {
        _id: "1",
        message: "Test comment",
        createdAt: "2023-01-01T12:00:00Z",
        userId: {
          username: "testuser",
          profilePicture: "test.jpg",
        },
      },
    ];

    const { getByText, getByRole } = render(
      <CommentContainer comments={mockComments} />,
    );

    const commentText = getByText("Test comment");
    const username = getByText("testuser");
    const img = getByRole("img");

    expect(commentText).toBeTruthy();
    expect(username).toBeTruthy();
    expect(img.getAttribute("src")).toBe("test.jpg");
  });

  it("renders multiple comments in reverse order", () => {
    const mockComments = [
      {
        _id: "1",
        message: "First comment",
        createdAt: "2023-01-01T12:00:00Z",
        userId: { username: "user1", profilePicture: "pic1.jpg" },
      },
      {
        _id: "2",
        message: "Second comment",
        createdAt: "2023-01-01T13:00:00Z",
        userId: { username: "user2", profilePicture: "pic2.jpg" },
      },
    ];

    const { getAllByText } = render(
      <CommentContainer comments={mockComments} />,
    );

    const commentElements = getAllByText(/comment/i);
    expect(commentElements.length).toBe(2);
    expect(commentElements[0].textContent).toBe("Second comment");
    expect(commentElements[1].textContent).toBe("First comment");
  });
});
