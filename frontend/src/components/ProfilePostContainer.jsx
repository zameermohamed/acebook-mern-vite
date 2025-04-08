import Post from "../components/Post/Post"

const ProfilePostContainer = (props) => {
  return (
      <div className="profile-post-container">
        {props.posts && props.posts.toReversed().map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
  );
};

export default ProfilePostContainer;