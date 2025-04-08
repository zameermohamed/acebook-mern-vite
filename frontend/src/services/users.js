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