import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../../services/posts";
import Header from "../../components/Header";
import Post from "../../components/Post/Post";

import AddComment from "../../components/AddComment/AddComment";
import CommentContainer from "../../components/CommentContainer/CommentContainer";

export function PostPage() {
  const [postData, setPostData] = useState();
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
        setPostData(data.postData);
        setCommentsData(data.comments);
      });
    }
  }, [id, refreshTrigger]);

  return (
    <div data-testid="post-page">
      <Header />
      <div>
        <div className="post-container">
          {postData && <Post post={postData} singlePost={true} />}
        </div>
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
