import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { getUser, updateUser, deleteUser } from "../../services/users";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css"; // Add this line to import your CSS

export function EditProfile() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    profilePicture: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser(token);
        setForm(userData);
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
    try {
      const result = await updateUser(form, token);
      setMessage(result.message);
      setError("");
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
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <input
            type="text"
            name="profilePicture"
            value={form.profilePicture}
            onChange={handleChange}
            placeholder="Profile Picture URL"
          />
            <input
            type="text"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
          />
          <div className="edit-profile-buttons">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button type="button" onClick={handleDelete} className="delete-button">
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

