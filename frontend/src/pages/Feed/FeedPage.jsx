import { useState } from "react";
import Header from "../../components/Header";
import PostContainer from "../../components/PostContainer/PostContainer";
import NewPost from "../../components/NewPost/NewPost";

export function FeedPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshPosts = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  return (
    <>
      <Header></Header>
      <h2>Posts</h2>
      <NewPost onPostCreated={refreshPosts} />
      <PostContainer refreshTrigger={refreshTrigger} />
    </>
  );
}
