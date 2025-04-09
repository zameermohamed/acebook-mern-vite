import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { getUser, updateUser, deleteUser } from "../../services/users";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

export function EditProfile() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    profilePicture: "",
    bio: "",
    currentPassword: "",
    password: "", // new password
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser(token);
        setForm((prev) => ({
          ...prev,
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          profilePicture: userData.profilePicture,
          bio: userData.bio,
          password: "",
          currentPassword: "",
        }));
      } catch (err) {
        setError("Could not load user data.");
      }
    }

    fetchUser();
  }, [token]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Prepare the payload
    const payload = { ...form };
  
    // Check if the password fields are being changed
    const isChangingPassword =
      Boolean(payload.currentPassword?.trim()) && Boolean(payload.password?.trim());
  
    // If not changing password, remove those fields from the payload
    if (!isChangingPassword) {
      delete payload.currentPassword;
      delete payload.password;
    }
    console.log("Payload:", payload);
    try {
      // Make the API request to update the user
      const result = await updateUser(payload, token);
      setMessage(result.message);
      setError("");
  
      // Reset the password fields
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        password: "",
      }));
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteUser(token);
        localStorage.removeItem("token");
        navigate("/signup");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        {error && <p className="message error">{error}</p>}
        {message && <p className="message success">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
          />

          <label>Profile Picture URL</label>
          <input
            type="text"
            name="profilePicture"
            value={form.profilePicture}
            onChange={handleChange}
            placeholder="Profile Picture URL"
          />

          <label>Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
          />

          <hr className="section-divider" />
          <h3>Change Password</h3>

          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Current Password"
          />

          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password"
          />

          <div className="edit-profile-buttons">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="delete-button"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
