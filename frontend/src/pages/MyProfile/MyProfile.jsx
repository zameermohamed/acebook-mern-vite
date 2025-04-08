import Header from "../../components/Header";
import "./MyProfile.css";
import { getUser } from "../../services/users";
import { useEffect, useState } from "react";
import { getPostsByUser } from "../../services/posts";
import ProfilePostContainer from "../../components/ProfilePostContainer";
import NewPost from "../../components/NewPost/NewPost";

export function MyProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
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
        const userData = await getUser(token)
        getPostsByUser(token, userData.username).then((data) => {
          setUser(userData);
          setPosts(data.posts);
      })
      } catch (error) {
        console.error("failed to find user", error);
      }
    }

    fetchUser();
  }, []);
  return (
    <>
      <div>
        <Header></Header>
      </div>
      {user && (
        <div className="profile-page">
          <h1>My Profile</h1>
          {user.profilePicture && <img src={user.profilePicture} />}
          <p> Username: {user.username}</p>
          <p> Email: {user.email}</p>
          <p> User since: {formatDate(user.dateCreated)}</p>
          <NewPost />
          <ProfilePostContainer posts={posts}/>
        </div>
      )}
    </>
  );
}
