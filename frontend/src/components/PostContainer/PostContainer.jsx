import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../Post/Post";
import "../PostContainer/PostContainer.css";

const PostContainer = ({
    refreshTrigger,
    singlePost,
    postId,
    userPosts,
    username,
    comments,
    theme,
}) => {
    const [posts, setPosts] = useState([]);
    const [refreshPage, setRefreshPage] = useState(0);
    const refreshPostContainer = () => {
        setRefreshPage(refreshPage + 1);
    };
    const navigate = useNavigate();
    const params = useParams();

    // Use postId from props or fallback to URL params
    const currentPostId = postId || params.id;
    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = token !== null;
        if (loggedIn) {
            getPosts(token)
                .then((data) => {
                    setPosts(data.posts);
                    localStorage.setItem("token", data.token);
                })
                .catch((err) => {
                    console.error(err);
                    navigate("/login");
                });
        } else {
            navigate("/login");
            return;
        }
    }, [navigate, refreshPage, refreshTrigger]);

    // Filter posts based on singlePost flag
    const filteredPosts = singlePost
        ? posts.filter((post) => post._id === currentPostId).toReversed()
        : posts.toReversed();

    const filteredPostsByUser = userPosts
        ? posts
              .filter(
                  (post) => post.userId && post.userId.username === username
              )
              .toReversed()
        : posts.toReversed();

    return (
        <div className="post-container">
            {!userPosts &&
                filteredPosts.map((post) => (
                    <Post
                        onPostDeleted={refreshPostContainer}
                        post={post}
                        key={post._id}
                        comments={comments}
                        theme={theme}
                    />
                ))}
            {userPosts &&
                filteredPostsByUser.map((post) => (
                    <Post
                        onPostDeleted={refreshPostContainer}
                        post={post}
                        key={post._id}
                        comments={comments}
                        theme={theme}
                    />
                ))}
        </div>
    );
};

export default PostContainer;
