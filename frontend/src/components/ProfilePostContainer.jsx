import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPostsByUser } from "../services/posts"
import Post from "../components/Post/Post"

const ProfilePostContainer = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPostsByUser()
        .then((data) => {
          setPosts(data.posts);
            localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
        } else {
        navigate("/login");
      return;
    }
  }, [navigate, refreshTrigger]);

  // can probably conditionally render the new post component 
  // here if on the my profile page
  return (
      <div className="profile-post-container">
        {posts.toReversed().map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
  );
};

export default ProfilePostContainer;