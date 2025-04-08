const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { jwtDecode } from "jwt-decode"; // MICHAL - import jwt decode

export async function createComment(token, text, post_id) {
  const decodedToken = jwtDecode(token);
  const payload = {
    message: text,
    userId: decodedToken.user_id,
  };
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(
    `${BACKEND_URL}/posts/${post_id}`,
    requestOptions
  );

  if (response.status !== 201) {
    throw new Error("Unable to add comment");
  }
  const data = await response.json();
  return data;
}
