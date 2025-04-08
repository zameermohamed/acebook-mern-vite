import { useState } from 'react';
import { updateUser } from '../../services/userService';
import './User.css';

function UserForm({ user, token }) {
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        password: '',
        bio: user.bio,
        profilePicture: user.profilePicture,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateUser(token, formData);
            alert('Profile updated!');
        } catch (err) {
            alert('Something went wrong');
        }
    };

    return (
        <div className="user">
            <h2>Edit your profile</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Email:
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Password:
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Bio:
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Profile Picture URL:
                    <input
                        name="profilePicture"
                        value={formData.profilePicture}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}

export default UserForm;
