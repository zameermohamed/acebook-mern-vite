import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { updateUser, deleteUser } from "../../services/users"; // 
import UserForm from "../../components/User/UserForm"; // Import the form component

export function EditUser() {
    const { id } = useParams(); 
    const [user, setUser] = useState(null);

    useEffect(() => {
 
        fetchUserData(id);
    }, [id]);

    const fetchUserData = async (userId) => {
        const userData = await getUserById(userId);
        setUser(userData);
    };

    const handleUpdate = async (userData) => {
        await updateUser(userData); // Call the update user service
        // Redirect or show a success message
    };

    return (
        <div>
            <h1>Edit User</h1>
            {user && <UserForm user={user} onSubmit={handleUpdate} />}
        </div>
    );
}
