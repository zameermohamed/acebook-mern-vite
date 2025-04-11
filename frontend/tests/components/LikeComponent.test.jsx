import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LikeComponent from "../../src/components/LikeComponent/LikeComponent";

describe("LikeComponent", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Mock fetch for Vitest
    global.fetch = vi.fn();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn().mockReturnValue("mock-token"),
      },
      writable: true,
    });

    // Setup import.meta.env
    import.meta.env = {
      VITE_BACKEND_URL: "https://api.example.com",
    };
  });

  it("renders with the correct initial like count", () => {
    const { getByText } = render(
      <LikeComponent
        likesCount={10}
        postId="123"
        userHasLiked={false}
        theme="light"
      />,
    );

    const likesText = getByText("Likes: 10");
    expect(likesText).toBeTruthy();
  });

  it("prevents action when no token is available", async () => {
    // Override localStorage mock to return null for token
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn().mockReturnValue(null),
      },
      writable: true,
    });

    // Mock console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { getByAltText } = render(
      <LikeComponent
        likesCount={5}
        postId="123"
        userHasLiked={false}
        theme="light"
      />,
    );

    // Click the like button
    const likeButton = getByAltText("Like post").closest("button");
    fireEvent.click(likeButton);

    // Verify fetch was not called
    expect(global.fetch).not.toHaveBeenCalled();

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith("No token found");

    consoleErrorSpy.mockRestore();
  });

  it("handles API error gracefully", async () => {
    // Mock failed response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to like post" }),
    });

    // Mock console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { getByAltText, getByText } = render(
      <LikeComponent
        likesCount={5}
        postId="123"
        userHasLiked={false}
        theme="light"
      />,
    );

    // Initial state
    expect(getByText("Likes: 5")).toBeTruthy();

    // Click the like button
    const likeButton = getByAltText("Like post").closest("button");
    fireEvent.click(likeButton);

    // Wait for error handling
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to update like status:",
        { error: "Failed to like post" },
      );

      // Like count should remain unchanged
      expect(getByText("Likes: 5")).toBeTruthy();
    });

    consoleErrorSpy.mockRestore();
  });

  it("prevents multiple clicks while processing", async () => {
    // Mock a delayed response
    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({}),
            });
          }, 100);
        }),
    );

    const { getByAltText } = render(
      <LikeComponent
        likesCount={5}
        postId="123"
        userHasLiked={false}
        theme="light"
      />,
    );

    // Click the like button twice in quick succession
    const likeButton = getByAltText("Like post").closest("button");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    // Verify fetch was called only once
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Wait for the response to complete
    await waitFor(() => {
      expect(likeButton.disabled).toBe(false);
    });
  });
});
