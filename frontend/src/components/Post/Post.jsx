import "../Post/Post.css";
import { Link } from "react-router-dom";
import LikeComponent from "../LikeComponent/LikeComponent";

function Post(props) {
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
  };

  return (
    <>
      {props.post.userId && (
        <Link
          className="post-card"
          key={props.post._id}
          to={`/posts/${props.post._id}`}
          onClick={handlePostClick}
        >
          <p className="post-card-date">{formatDate(props.post.createdAt)}</p>
          <div className="post-card-user-info">
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
          <p data-testid="post-message" className="post-message">
            {props.post.message}
          </p>
          {(props.post.likesCount === 0 || props.post.likesCount) && (
            <LikeComponent
              likesCount={props.post.likesCount}
              postId={props.post._id}
              userHasLiked={props.post.userHasLiked}
            />
          )}
        </Link>
      )}
    </>
  );
}

export default Post;
