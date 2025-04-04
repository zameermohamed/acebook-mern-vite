import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../../services/posts";
import Header from "../../components/Header";

export function PostPage() {
    const [postData, setPostData] = useState();

    const { id } = useParams();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const loggedIn = token !== null;
        if (loggedIn) {
            getPost(token, id).then((data) => {
                console.log(data.postData.message);
                setPostData(data);
            });
        }
    }, [id]);

    return <>
    <Header />
    {postData && <h1>{postData.postData.message}</h1>}</>;
}
