import { render, screen } from "@testing-library/react";

import Post from "../../src/components/Post/Post";

describe("Post", () => {
  test("displays the message as an article", () => {
    const testPost = { userId: {_id: "123"}, message: "test message" };
    render(<Post post={testPost} />);

    const article = screen.getByTestId("post-message");
    expect(article.textContent).toBe("test message");
  });
});
