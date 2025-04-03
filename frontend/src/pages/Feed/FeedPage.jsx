import { useState, useEffect } from "react";
import Header from "../../components/Header";
import PostContainer from "../../components/PostContainer/PostContainer";
import NewPost from "../../components/NewPost/NewPost";
import { getUser } from "../../services/users"

export function FeedPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  

  const refreshPosts = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    getUser(token);

  }, [])

  return (
    <>
      <Header></Header>
      <h2>Posts</h2>
      <NewPost onPostCreated={refreshPosts}/>
      <PostContainer refreshTrigger={refreshTrigger} />
    </>
  );
}
