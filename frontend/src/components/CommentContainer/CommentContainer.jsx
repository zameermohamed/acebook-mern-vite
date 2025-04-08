function CommentContainer(props) {
    return (
        <div className="comments-container">
            <h3>Comments</h3>
            {props.comments &&
                props.comments.length > 0 &&
                props.comments
                    .toReversed()
                    .map((comment) => (
                        <p key={comment._id}>{comment.message}</p>
                    ))}
        </div>
    );
}

export default CommentContainer;
