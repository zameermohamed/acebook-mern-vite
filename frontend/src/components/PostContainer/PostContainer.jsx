import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../Post/Post";
import "../PostContainer/PostContainer.css";

const PostContainer = ({ refreshTrigger, singlePost, postId, comments }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  // Use postId from props or fallback to URL params
  const currentPostId = postId || params.id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
        .then((data) => {
          // Log the data from the API to see the comment counts
          console.log(
            "API response in PostContainer:",
            data.posts.map((post) => ({
              id: post._id,
              commentsCount: post.commentsCount,
            })),
          );

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

  // Filter posts based on singlePost flag
  const filteredPosts = singlePost
    ? posts.filter((post) => post._id === currentPostId)
    : posts.toReversed();

  // Log the filtered posts to see if comments data is preserved
  console.log(
    "Filtered posts in PostContainer:",
    filteredPosts.map((post) => ({
      id: post._id,
      commentsCount: post.commentsCount,
    })),
  );

  return (
    <div className="post-container">
      {filteredPosts.map((post) => (
        <Post post={post} key={post._id} comments={comments} />
      ))}
    </div>
  );
};

export default PostContainer;
