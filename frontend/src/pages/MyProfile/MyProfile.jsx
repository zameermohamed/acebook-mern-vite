import Header from "../../components/Header";
import "./MyProfile.css"
import { getUser } from "../../services/users";
import { useEffect, useState } from "react";

export function MyProfile() {
    const [user, setUser] = useState(null);
    const formatDate = (date) => {
        let dateFormat = new Date(date);

        // Options for formatting
        let options = {
            month: "long",
            day: "numeric",
            year: "numeric",
        };
        let formattedDate = dateFormat.toLocaleString("en-US", options);
        return formattedDate;
    };
    useEffect(() => {
        const token = localStorage.getItem("token");

        async function fetchUser() {
            try {
            const userData = await getUser(token);
            setUser(userData)
            console.log(userData)
            } catch (error) {
                console.error("failed to find user", error)
            } 
        }

        fetchUser();
        }, []);

    return (
        <>
          <div>
            <Header></Header>
          </div>
          {user && (<div className="profile-page">
            <h1>My Profile</h1>
            {user.profilePicture && (<img src={user.profilePicture}/>)}
            <p> Username: {user.username}</p>
            <p> Email: {user.email}</p>
            <p> User since: {formatDate(user.dateCreated)}</p>
          </div>)}
        </>
      );
    }