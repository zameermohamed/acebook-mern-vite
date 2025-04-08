import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostsByUser } from "../../services/posts"
import Header from "../../components/Header";
import ProfilePostContainer from "../../components/ProfilePostContainer";

export function ViewProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const { username } = useParams();
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
    if (loggedIn) {
      getPostsByUser(token, username).then((data) => {
        setUser(data.foundUser);
        setPosts(data.posts)
      });
    }
  }, [username]);

  return (
    <>
      <div>
        <Header></Header>
      </div>
      {user && (<div className="profile-page">
        <h1>{user.username}</h1>
        {user.profilePicture && (<img src={user.profilePicture}/>)}
        <p> User since: {formatDate(user.dateCreated)}</p> 
        <ProfilePostContainer posts={posts}/>
      </div>)}
    </>
  );
}