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
  const [isLoading, setIsLoading] = useState(true);

  const refreshComments = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;

    if (loggedIn) {
      setIsLoading(true);
      getPost(token, id)
        .then((data) => {
          setCommentsData(data.comments || []);
        })
        .catch((error) => {
          console.error("Error fetching post and comments:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, refreshTrigger]);

  return (
    <div data-testid="post-page">
      <Header />
      <div className="post-page-content">
        <PostContainer
          singlePost={true}
          postId={id}
          refreshTrigger={refreshTrigger}
        />

        {isLoading ? (
          <p>Loading comments...</p>
        ) : (
          <>
            <CommentContainer
              refreshTrigger={refreshTrigger}
              comments={commentsData}
            />
            <AddComment postId={id} onCommentCreated={refreshComments} />
          </>
        )}
      </div>
    </div>
  );
}
