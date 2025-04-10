import { createPost } from "../../services/posts";
import { useState, useEffect } from "react";
import "../NewPost/NewPost.css";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/users";

function NewPost({ onPostCreated }) {
    const [error, setError] = useState(false);
    const [text, setText] = useState("");
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [file, setFile] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = token !== null;
        if (loggedIn) {
            getUser(token).then((data) => {
                if (!data) {
                    console.error("getUser returned undefined");
                    return;
                }
                setUsername(data.username);
                setProfilePicture(data.profilePicture);
            });
        } else {
            navigate("/login");
            return;
        }
    }, [navigate]);

    function handlePostChange(event) {
        setError(false);
        setText(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!text && !file) {
            setError(true);
        } else {
            // verify they're logged in to attach user id
            await createPost(localStorage.getItem("token"), text, file);
            setText("");
            // Call the callback to notify parent that a post was created
            if (onPostCreated) onPostCreated();
            setError(false);
        }
    }
    function handleFileChange(event) {
        const file = event.target.files[0];
        setFile(file);
        setError(false);
        console.log(file);
    }

    return (
        <div>
            {username && (
                <form className="form" onSubmit={handleSubmit}>
                    <div className="user-info">
                        <img src={profilePicture} />
                        <h3>{username}</h3>
                    </div>
                    <input type="file" onChange={handleFileChange} />
                    <textarea
                        className="textField"
                        id="message"
                        placeholder="Write your post here"
                        type="text"
                        value={text}
                        onChange={handlePostChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // prevent newline
                                handleSubmit(e);
                            }
                        }}
                    />
                    <input
                        className="submitButton"
                        data-testid="submit-button"
                        role="submit-button"
                        id="submit"
                        type="submit"
                        value="Post"
                    />
                    {error && (
                        <div
                            className="post-error-msg"
                            data-testid="post-error-msg"
                        >
                            <p>Post must contain some text</p>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}

export default NewPost;
