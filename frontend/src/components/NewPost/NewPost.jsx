import { createPost } from "../../services/posts";
import { useState } from "react";
import "../NewPost/NewPost.css";

function NewPost({ onPostCreated }) {
  const [error, setError] = useState(false);
  const [text, setText] = useState("");

  function handlePostChange(event) {
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
    setError(false)
    }
  }

  return (
    <div>
      <form className="form"onSubmit={handleSubmit}>
        <img className="profilePic"
          src="https://tse3.mm.bing.net/th?id=OIP.dCpgPQ0i-xX2gZ-yonm54gHaHa&pid=Api"
        />
        <p className="username"> 
          
        </p>
        <textarea className="textField"
          id="message"
          placeholder="Write your post here"
          type="text"
          value={text}
          onChange={handlePostChange}
        />
        <input className="submitButton"
        role="submit-button" 
        id="submit" 
        type="submit" 
        value="Post" />
      </form>
      {error && (
        <div className="post-error-msg">
          <p>Post must contain some text</p>
        </div>
      )}
    </div>
  );
}

export default NewPost;
