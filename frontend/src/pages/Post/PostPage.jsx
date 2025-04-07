import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../../services/posts";
import Header from "../../components/Header";
import Post from "../../components/Post/Post";

export function PostPage() {
    const [postData, setPostData] = useState();

    const { id } = useParams();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = token !== null;
        if (loggedIn) {
            getPost(token, id).then((data) => {
                console.log("from posts page =>", data.postData);
                setPostData(data);
            });
        }
    }, [id]);

    return (
        <>
            <Header />
            <div className="post-container">
                {postData && (
                    <Post post={postData.postData} singlePost={true} />
                )}
            </div>
            {/* && <h1>{.message}</h1>}</>; */}
        </>
    );
}
