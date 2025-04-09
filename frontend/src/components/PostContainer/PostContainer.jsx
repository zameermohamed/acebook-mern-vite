import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../Post/Post";
import "../PostContainer/PostContainer.css";

const PostContainer = ({
  refreshTrigger,
  singlePost,
  postId,
  userPosts, 
  username, 
  comments,
  theme,
}) => {
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

  // Filter posts based on viewing individual profile flag
  const filteredPostsByUser = userPosts
    ? posts.filter((post) => post.userId.username === username).toReversed()
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
      {!userPosts && filteredPosts.map((post) => (
        <Post post={post} key={post._id} comments={comments} theme={theme}/>
      ))}
      {userPosts && filteredPostsByUser.map((post) => (
        <Post post={post} key={post._id} comments={comments} theme={theme} />
      ))}
    </div>
  );
};

export default PostContainer;
