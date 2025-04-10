import React from "react";
import "../EditProfileForm/EditProfileForm.css";

export default function EditProfileForm({
    form,
    error,
    message,
    onChange,
    onSubmit,
    onDelete,
}) {
  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {error && <p className="message error">{error}</p>}
      {message && <p className="message success">{message}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username" 
            name="username"
            value={form.username}
            onChange={onChange}
            placeholder="Username"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email" 
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
          />
        </div>

        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            placeholder="Full Name"
          />
        </div>

        <div>
          <label htmlFor="profilePicture">Profile Picture URL</label>
          <input
            type="text"
            id="profilePicture" 
            name="profilePicture"
            value={form.profilePicture}
            onChange={onChange}
            placeholder="Profile Picture URL"
          />
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio" 
            name="bio"
            value={form.bio}
            onChange={onChange}
            placeholder="Bio"
          />
        </div>

        <hr className="section-divider" />
        <h3>Change Password</h3>

        <div>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword" 
            name="currentPassword"
            value={form.currentPassword}
            onChange={onChange}
            placeholder="Current Password"
          />
        </div>

        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password" 
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="New Password"
          />
        </div>

        <div className="edit-profile-buttons">
          <button type="submit" className="save-button">
            Save Changes
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="delete-button"
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
}
