import { createPost } from "../../services/posts";
import { useState, useEffect } from "react";
import "../NewPost/NewPost.css";
import { getUser } from "../../services/users";

function NewPost({ onPostCreated }) {
    // c
    const [error, setError] = useState(false);
    const [text, setText] = useState("");
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        getUser(token).then((data) => {
            setUsername(data.username);
            setProfilePicture(data.profilePicture);
        });
    }, []);

    function handlePostChange(event) {
        setError(false);
        setText(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!text) {
            setError(true);
        } else {
            // verify they're logged in to attach user id
            await createPost(localStorage.getItem("token"), text);
            setText("");
            // Call the callback to notify parent that a post was created
            if (onPostCreated) onPostCreated();
            setError(false);
        }
    }

    return (
        <div>
            <form className="form" onSubmit={handleSubmit}>
                <div className="user-info">
                    <img src={profilePicture} />
                    <h3>{username}</h3>
                </div>
                <textarea
                    className="textField"
                    id="message"
                    placeholder="Write your post here"
                    type="text"
                    value={text}
                    onChange={handlePostChange}
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

export default NewPost;
