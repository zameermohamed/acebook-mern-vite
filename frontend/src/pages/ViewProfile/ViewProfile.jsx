import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostsByUser } from "../../services/posts"
import { getUser } from "../../services/users";
import Header from "../../components/Header";
import PostContainer from "../../components/PostContainer/PostContainer";

export function ViewProfile() {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [currentUser, setcurrentUser] = useState(null)
  const navigate = useNavigate()
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
    getUser(token)
    .then((data) => {
      setcurrentUser(data.username)
    })
    if (loggedIn) {
      getPostsByUser(token, username).then((data) => {
        if (data.foundUser.username === currentUser) {
          navigate("/profile");
        } else {
        setUser(data.foundUser);}
      });
    }
  }, [username, navigate, currentUser]);

  return (
    <>
      <div>
        <Header></Header>
      </div>
      {user && (<div className="profile-page">
        <h1 data-testid="username">{user.username}</h1>
        {user.profilePicture && (<img src={user.profilePicture}/>)}
        <p> User since: {formatDate(user.dateCreated)}</p> 
        <PostContainer username={username} userPosts={true}/>
      </div>)}
    </>
  );
}