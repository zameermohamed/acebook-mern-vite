import { useState } from "react";
import "../NewPost/NewPost.css";
import { createComment } from "../../services/comments";
import { useParams } from "react-router-dom";

function AddComment({ onCommentCreated }) {
    const [error, setError] = useState(false);
    const [text, setText] = useState("");
    const { id } = useParams();

    function handleCommentChange(event) {
        setError(false);
        setText(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!text) {
            setError(true);
        } else {
            // verify they're logged in to attach user id
            await createComment(token, text, id);
            setText("");
            // Call the callback to notify parent that a post was created
            if (onCommentCreated) onCommentCreated();
            setError(false);
        }
    }

    return (
        <div>
            <form className="form" onSubmit={handleSubmit}>
                {/* <div className="user-info">
                    <img src={profilePicture} />
                    <h3>{username}</h3>
                </div> */}
                <textarea
                    className="textField"
                    id="message"
                    placeholder="Comment ..."
                    type="text"
                    value={text}
                    onChange={handleCommentChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // prevent newline
                            handleSubmit(e);
                        }
                    }}
                />
                <input
                    className="submitButton"
                    role="submit-button"
                    id="submit"
                    type="submit"
                    value="Post"
                />
                {error && (
                    <div className="post-error-msg">
                        <p>Post must contain some text</p>
                    </div>
                )}
            </form>
        </div>
    );
}

export default AddComment;
