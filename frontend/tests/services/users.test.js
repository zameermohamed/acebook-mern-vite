import { vi, expect, test, beforeEach } from "vitest";
import { getUser, updateUser, deleteUser } from "../../src/services/users";

const mockFetch = vi.fn();

global.fetch = mockFetch;

const token = "fake-token";

beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getUser successfully fetches user data", async () => {
    const mockResponse = { username: "testuser", email: "test@example.com" };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await getUser(token);

    expect(mockFetch).toHaveBeenCalledWith(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  test("getUser handles fetch error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Internal Server Error" }),
    });

    const result = await getUser(token);

    expect(mockFetch).toHaveBeenCalledWith(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(result).toBeUndefined();
  });

  test("updateUser successfully updates user", async () => {
    const mockResponse = { message: "User updated successfully" };
    const mockData = { username: "updateduser" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await updateUser(mockData, token);

    expect(mockFetch).toHaveBeenCalledWith(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mockData),
    });
    expect(result).toEqual(mockResponse);
  });

  test("updateUser handles update error", async () => {
    const mockError = { message: "Failed to update user" };
    const mockData = { username: "updateduser" };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => mockError,
    });

    await expect(updateUser(mockData, token)).rejects.toThrow("Failed to update user");
  });

  test("deleteUser successfully deletes user", async () => {
    const mockResponse = { message: "User deleted successfully" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await deleteUser(token);

    expect(mockFetch).toHaveBeenCalledWith(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  test("deleteUser handles delete error", async () => {
    const mockError = { message: "Failed to delete user" };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => mockError,
    });

    await expect(deleteUser(token)).rejects.toThrow("Failed to delete user");
  });
