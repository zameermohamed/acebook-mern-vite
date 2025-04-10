import Header from "../../components/Header";

import { getUser } from "../../services/users";
import { useEffect, useState } from "react";
import NewPost from "../../components/NewPost/NewPost";
import PostContainer from "../../components/PostContainer/PostContainer";
import "./MyProfile.css";
export function MyProfile() {
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const refreshPosts = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
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

  console.log("user from my profile", user);
  return (
    <>
      <div>
        <Header onThemeChange={toggleTheme}></Header>
      </div>
      {user && (
        <div className="profile-page">
          <div className="profile-details">
            <h1>My Profile</h1>
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                className="profile-picture"
                alt={`${user.username}'s profile`}
              />
            )}
            <p data-testid="username"> Username: {user.username}</p>
            <p> Email: {user.email}</p>
            <p> User since: {formatDate(user.dateCreated)}</p>
          </div>
          <div className="post-feed">
            <NewPost onPostCreated={refreshPosts} />
            <PostContainer
              refreshTrigger={refreshTrigger}
              username={user.username}
              userPosts={true}
              theme={theme}
            />
          </div>
        </div>
      )}
    </>
  );
}
