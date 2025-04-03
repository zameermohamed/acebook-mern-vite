import "../Post/Post.css";

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
    return (
        <article className="post-card" key={props.post._id}>
            <p className="post-card-date">
                {" "}
                {formatDate(props.post.createdAt)}
            </p>
            <div className="post-card-user-info">
                <img
                    className="post-card-user-picture"
                    src={props.post.profile_picture}
                />
                <div className="post-card-user-name">
                    {props.post.user_name}
                </div>
            </div>

            {props.post.message}
        </article>
    );
}
export default Post;
