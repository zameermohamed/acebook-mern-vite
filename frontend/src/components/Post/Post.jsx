import "../Post/Post.css";
import { Link, useNavigate } from "react-router-dom";
import LikeComponent from "../LikeComponent/LikeComponent";
import { useEffect, useState } from "react";
import { getUser } from "../../services/users";
import { deletePost } from "../../services/posts";
import bin from "../../images/bin.png";
import binDarkMode from "../../images/bin-dark-mode.png";

function Post(props) {
  const [userId, setUserId] = useState();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    getUser(token).then((data) => {
      if (data && data.userId) {
        setUserId(data.userId);
      } else {
        console.warn("User data missing or malformed:", data);
      }
    });
  }, [token]);

  const formatDate = (date) => {
    let dateFormat = new Date(date);

    // Options for formatting
    let options = {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    let formattedDate = dateFormat.toLocaleString("en-US", options);
    return formattedDate;
  };

  const handlePostClick = (e) => {
    // Don't navigate if the click was on the like component
    if (e.target.closest(".like-component")) {
      e.preventDefault();
    }
    if (e.target.closest(".bin-container")) {
      e.preventDefault();
    }
  };

  const handlePostDelete = async () => {
    await deletePost(token, props.post._id);
    if (props.onPostDeleted) props.onPostDeleted();
    navigate("/posts");
  };

  // Get the comment count from props.comments (when in single post view)
  // or from post.commentsCount (when in feed view)
  const commentCount = props.comments?.length || props.post.commentsCount || 0;

  return (
    <>
      {props.post.userId && (
        <Link
          className="post-card"
          key={props.post._id}
          to={`/posts/${props.post._id}`}
          onClick={handlePostClick}
        >
          <div className="post-card-user-info">
            <div className="user-details">
              <Link to={`/users/${props.post.userId.username}`}>
                <img
                  className="post-card-user-picture"
                  src={props.post.userId.profilePicture}
                  alt="User profile"
                />
              </Link>
              <div className="post-card-user-name">
                <Link to={`/users/${props.post.userId.username}`}>
                  {props.post.userId.username}
                </Link>
              </div>
            </div>
            <p className="post-card-date">{formatDate(props.post.createdAt)}</p>
          </div>

          <p data-testid="post-message" className="post-message">
            {props.post.message}
          </p>

          <div className="post-card-bottom">
            <div className="post-card-bottom-items">
              {(props.post.likesCount === 0 || props.post.likesCount) && (
                <LikeComponent
                  likesCount={props.post.likesCount}
                  postId={props.post._id}
                  userHasLiked={props.post.userHasLiked}
                  theme={props.theme}
                />
              )}

              {userId === props.post.userId._id && (
                <div className="bin-container" onClick={handlePostDelete}>
                  <img
                    className="bin-icon"
                    src={props.theme === "light" ? bin : binDarkMode}
                    alt="Delete"
                  />
                </div>
              )}

              <p className="post-comments-count">
                {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
              </p>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}

export default Post;
