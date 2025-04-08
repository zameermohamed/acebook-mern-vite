import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../../services/posts";
import Header from "../../components/Header";
import AddComment from "../../components/AddComment/AddComment";
import CommentContainer from "../../components/CommentContainer/CommentContainer";
import PostContainer from "../../components/PostContainer/PostContainer";

export function PostPage() {
  const [commentsData, setCommentsData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshComments = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPost(token, id).then((data) => {
        setCommentsData(data.comments);
      });
    }
  }, [id, refreshTrigger]);

  return (
    <div data-testid="post-page">
      <Header />
      <div>
        <PostContainer
          singlePost={true}
          postId={id}
          refreshTrigger={refreshTrigger}
        />
        <div>
          <CommentContainer
            refreshTrigger={refreshTrigger}
            comments={commentsData}
          />
        </div>
        <AddComment onCommentCreated={refreshComments} />
      </div>
    </div>
  );
}
