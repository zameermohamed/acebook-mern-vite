import { describe, it, expect } from "vitest";

describe("LogOut", () => {
  it("should remove the token from localStorage", () => {
    // Arrange
    localStorage.setItem("token", "testToken");

    // Act
    localStorage.removeItem("token");

    // Assert
    expect(localStorage.getItem("token")).toBeNull();
  });
});
