import {createPost} from "../services/posts"
import { useState } from "react";

function NewPost(props) {
  const [text, setText] = useState("")

  function handlePostChange(event) {
    setText(event.target.value)
  }

  async function handleSubmit(event) {
      event.preventDefault();
      // verify they're logged in to attach user id
      await createPost(localStorage.getItem("token"), text)
      setText("")

  }
    return (
      <div >
        <form onSubmit={handleSubmit}>
          <label >write your post here:</label>
          <input
            id="message"
            type="text"
            value={text}
            onChange={handlePostChange}
          />
          <input role="submit-button" id="submit" type="submit" value="Post" />
        </form>
      </div>
  )
}

export default NewPost;