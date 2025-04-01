import Header from "../../components/Header";
import PostContainer from "../../components/PostContainer/PostContainer";

export function FeedPage() {
  return (
    <>
      <Header></Header>
      <h2>Posts</h2>
      <div className="NewPost">{/* <NewPost></NewPost> */}</div>
      <PostContainer></PostContainer>
    </>
  );
}
