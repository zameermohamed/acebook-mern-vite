function Post(props) {
    console.log(props.post);
    return <article key={props.post._id}>{props.post.message}</article>;
}

export default Post;
