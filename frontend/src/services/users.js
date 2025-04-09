const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUser(token) {
    try {
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await fetch(`${BACKEND_URL}/users`, requestOptions);

        if (response.status !== 200) {
            throw new Error("Unable to fetch users");
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}
export async function updateUser(data, token) {
    try {
        const response = await fetch(`${BACKEND_URL}/users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || "Failed to update user");
        }

        const updatedData = await response.json();
        return updatedData;
    } catch (err) {
        console.error("Update Error:", err.message);
        throw err;
    }
}

export async function deleteUser(token) {
    try {
        const response = await fetch(`${BACKEND_URL}/users`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || "Failed to delete user");
        }

        return await response.json();
    } catch (err) {
        console.error("Delete Error:", err.message);
        throw err;
    }
}