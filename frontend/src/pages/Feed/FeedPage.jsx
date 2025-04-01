import Header from "../../components/Header";
import PostContainer from "../../components/PostContainer/PostContainer";
import NewPost from "../../components/newPost";

export function FeedPage() {
  return (
    <>
      <Header></Header>
      <h2>Posts</h2>
      <div className="NewPost"><NewPost posts={posts} setPosts={setPosts}/></div>
      <PostContainer></PostContainer>
    </>
  );
}
