// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { jwtDecode } from "jwt-decode"; // MICHAL - import jwt decode

export async function getPosts(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}
export async function getPost(token, post_id) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/posts/${post_id}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch post");
  }

  const data = await response.json();
  return data; // This should now include both postData and comments
}

export async function getPostsByUser(token, username) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/users/${username}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}

export async function createPost(token, text) {
  const decodedToken = jwtDecode(token); // MICHAL - get decoded token
  const payload = { message: text, userId: decodedToken.user_id }; // MICHAL - add userID here, to save it in the database
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to add post");
  }
  const data = await response.json();
  return data;
}

export async function deletePost(token, postId) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/posts/${postId}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw new Error("Unable to DELETE post");
  }
  const data = await response.json();
  return data;
}
