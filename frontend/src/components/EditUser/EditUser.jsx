import { useState } from 'react';
import { updateUser, deleteUser } from '../../services/users';
import './User.css';

function UpdateUser({ user, token }) {
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        password: '',
        bio: user.bio,
        profilePicture: user.profilePicture,
    });

    const handleUserChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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
                        onChange={handleUserChange}
                    />
                </label>
                <label>
                    Email:
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleUserChange}
                    />
                </label>
                <label>
                    Password:
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleUserChange}
                    />
                </label>
                <label>
                    Bio:
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleUserChange}
                    />
                </label>
                <label>
                    Profile Picture URL:
                    <input
                        name="profilePicture"
                        value={formData.profilePicture}
                        onChange={handleUserChange}
                    />
                </label>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}

export default UpdateUser;