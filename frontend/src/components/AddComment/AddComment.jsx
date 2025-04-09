import { useState } from "react";
import "../NewPost/NewPost.css";
import { createComment } from "../../services/comments";
import { useParams } from "react-router-dom";

function AddComment({ onCommentCreated }) {
  const [error, setError] = useState(false);
  const [text, setText] = useState("");
  const { id } = useParams(); // This correctly gets the post ID from the URL

  function handleCommentChange(event) {
    setError(false);
    setText(event.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if text is empty and show error if it is
    if (!text.trim()) {
      setError(true);
      return;
    }

    try {
      await createComment(
        localStorage.getItem("token"),
        text, // Use 'text' instead of 'commentText'
        id, // Use 'id' from useParams instead of 'props.postId'
      );

      setText(""); // Clear the input after successful submission
      onCommentCreated(); // Call the callback to refresh comments
    } catch (error) {
      console.error("Error creating comment:", error);
      setError(true);
    }
  };

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
          <div data-testid="error-string" className="post-error-msg">
            <p>Post must contain some text</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default AddComment;
