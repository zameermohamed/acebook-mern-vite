import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../Post";
import "../PostContainer/PostContainer.css";

const PostContainer = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
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
  }, [navigate]);

  return (
    <>
      <div className="post-container">
        {posts.toReversed().map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
    </>
  );
};

export default PostContainer;
