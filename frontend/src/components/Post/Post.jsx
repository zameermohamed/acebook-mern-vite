import "../Post/Post.css";

function Post(props) {
    return (
        <div className="post-card-container">
            <article className="post-card" key={props.post._id}>
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
        </div>
    );
}
export default Post;
