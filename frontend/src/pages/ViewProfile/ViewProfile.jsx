import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOtherUser } from "../../services/users";
import Header from "../../components/Header";

export function ViewProfile() {
    const [user, setUser] = useState(null);
    const { username } = useParams();
    const formatDate = (date) => {
        let dateFormat = new Date(date);

        // Options for formatting
        let options = {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };
        let formattedDate = dateFormat.toLocaleString("en-US", options);
        return formattedDate;
    };
    useEffect(() => {
        const token = localStorage.getItem("token");

        async function fetchUser() {
            try {
            const userData = await getOtherUser(token, username);
            setUser(userData)
            console.log(userData)
            } catch (error) {
                console.error("failed to find user", error)
            } 
        }

        fetchUser();
        }, [username]);

    return (
        <Header />
    )
}