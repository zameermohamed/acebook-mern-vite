import "./CommentContainer.css";

function CommentContainer(props) {
  return (
    <div className="comments-container">
      <h3>Comments ({props.comments?.length || 0})</h3>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentContainer;
