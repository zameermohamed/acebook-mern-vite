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

  function handleRemoveFile(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFile("");
    const fileAttached = document.getElementById("file-upload");
    if (fileAttached) fileAttached.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!text && !file) {
      setError(true);
    } else {
      // verify they're logged in to attach user id
      await createPost(localStorage.getItem("token"), text, file);
      setText("");
      handleRemoveFile();
      // Call the callback to notify parent that a post was created
      if (onPostCreated) onPostCreated();
      setError(false);
    }
  }
  function handleFileChange(event) {
    const file = event.target.files[0];
    setFile(file);
    setError(false);
  }

  return (
    <div>
      {username && (
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // prevent newline
                handleSubmit(e);
              }
            }}
          />
          <div className="form-actions">
            <div className="file-section">
              <div className="file-input-container">
                <label className="file-input-label">
                  <input
                    type="file"
                    className="file-input"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                  Add Photo
                </label>
              </div>
              {file && (
                <span className="file-name">
                  <span className="file-name-text">{file.name}</span>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={(e) => handleRemoveFile(e)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <input
              className="submitButton"
              data-testid="submit-button"
              role="submit-button"
              id="submit"
              type="submit"
              value="Post"
            />
          </div>
          {error && (
            <div className="post-error-msg" data-testid="post-error-msg">
              <p>Post must contain some text</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default NewPost;
