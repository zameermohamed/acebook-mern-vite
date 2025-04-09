import "./CommentContainer.css";

function CommentContainer(props) {
  console.log("props.comments:", props.comments);
  return (
    <div className="comments-container">
      {(!props.comments || props.comments.length === 0) && (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      )}

      {props.comments && props.comments.length > 0 && (
        <div className="comments-list">
          {props.comments.toReversed().map((comment) => (
            <div key={comment._id} className="comment-item">
              <p className="comment-text">{comment.message}</p>
              <p className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
              <div className="comment-card-user-info">
                <img
                  className="comment-card-user-picture"
                  src={comment.userId.profilePicture}
                />

                <div className="comment-author">{comment.userId.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentContainer;
