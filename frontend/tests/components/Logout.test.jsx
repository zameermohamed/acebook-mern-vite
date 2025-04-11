import { describe, it, expect } from "vitest";
import LogOut from "../../src/components/Logout";

describe("LogOut", () => {
  it("should remove the token from localStorage", () => {
    // Arrange
    localStorage.setItem("token", "testToken");

    // Act
    localStorage.removeItem("token");

    // Assert
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("should have a LogOut function", () => {
    // Arrange
    localStorage.setItem("token", "testToken");

    // Act & Assert
    expect(typeof LogOut).toBe("function");
  });

  it("should clear localStorage when LogOut is called", () => {
    // Arrange
    localStorage.setItem("token", "testToken");
    expect(localStorage.getItem("token")).toBe("testToken");

    // Act
    LogOut();

    // Assert
    expect(localStorage.getItem("token")).toBeNull();
  });
});
