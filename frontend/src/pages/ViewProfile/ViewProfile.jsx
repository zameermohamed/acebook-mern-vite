import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostsByUser } from "../../services/posts";
import { getUser } from "../../services/users";
import "./ViewProfile.css";
import Header from "../../components/Header";
import PostContainer from "../../components/PostContainer/PostContainer";

export function ViewProfile() {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const navigate = useNavigate();
  const [currentUser, setcurrentUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
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
    const loggedIn = token !== null;
    getUser(token).then((data) => {
      setcurrentUser(data.username);
    });
    if (loggedIn) {
      getPostsByUser(token, username).then((data) => {
        if (data.foundUser.username === currentUser) {
          navigate("/profile");
        } else {
          setUser(data.foundUser);
        }
      });
    }
  }, [username, navigate, currentUser]);
  console.log("user", user);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      <div>
        <Header onThemeChange={toggleTheme}></Header>
      </div>

      {user && (
        <div className="profile-page">
          <div className="view-profile-details">
            <h1 data-testid="username">{user.username}</h1>
            {user.profilePicture && (
              <img src={user.profilePicture} className="profile-picture" />
            )}
            <p> User since: {formatDate(user.dateCreated)}</p>
          </div>
          <div className="post-feed">
            <PostContainer username={username} userPosts={true} theme={theme} />
          </div>
        </div>
      )}
    </>
  );
}
