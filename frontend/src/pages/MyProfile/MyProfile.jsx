import Header from "../../components/Header";
import "./MyProfile.css";
import { getUser } from "../../services/users";
import { useEffect, useState } from "react";
import NewPost from "../../components/NewPost/NewPost";
import PostContainer from "../../components/PostContainer/PostContainer";

export function MyProfile() {
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refreshPosts = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };
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
        getUser(token, userData.username).then((data) => {
          setUser(data);
        });
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
          <p data-testid="username"> Username: {user.username}</p>
          <p> Email: {user.email}</p>
          <p> User since: {formatDate(user.dateCreated)}</p>
          <NewPost onPostCreated={refreshPosts}/>
          <PostContainer refreshTrigger={refreshTrigger} username={user.username} userPosts={true}/>
        </div>
      )}
    </>
  );
}
