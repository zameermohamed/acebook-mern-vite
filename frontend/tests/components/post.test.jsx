import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Post from "../../src/components/Post/Post";

describe("Post", () => {
  test("displays the message as an article", () => {
    const testPost = { userId: { _id: "123" }, message: "test message" };

    render(
      <MemoryRouter>
        <Post post={testPost} />
      </MemoryRouter>,
    );

    const article = screen.getByTestId("post-message");
    expect(article.textContent).toBe("test message");
  });
});
