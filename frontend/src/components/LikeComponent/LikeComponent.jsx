import { useEffect, useState } from "react";
import thumbsUpEmpty from "../../images/thumbs-up-empty.png";
import thumbsUpFilled from "../../images/thumbs-up-filled.png";
import thumbsUpEmptyDark from "../../images/thumbs-up-empty-dark-mode.png";
import "./LikeComponent.css";

function LikeComponent({
  likesCount: initialLikesCount,
  postId,
  userHasLiked,
  theme,
}) {
  const [liked, setLiked] = useState(userHasLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {}, [theme]);

  const likePostToggle = async (e) => {
    e.preventDefault(); // Prevent event bubbling to parent Link component
    e.stopPropagation();

    if (isProcessing) return; // Prevent multiple clicks while processing

    setIsProcessing(true);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      setIsProcessing(false);
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const endpoint = liked
        ? `${baseUrl}/posts/${postId}/unlike`
        : `${baseUrl}/posts/${postId}/like`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Update UI
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        console.log(`Post ${liked ? "unliked" : "liked"} successfully`);
      } else {
        const errorData = await response.json();
        console.error("Failed to update like status:", errorData);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="like-component" onClick={(e) => e.stopPropagation()}>
      <p>Likes: {likesCount}</p>
      <button
        onClick={likePostToggle}
        disabled={isProcessing}
        className="like-button"
      >
        <img
          src={
            liked
              ? thumbsUpFilled
              : theme === "light"
                ? thumbsUpEmpty
                : thumbsUpEmptyDark
          }
          alt={liked ? "Unlike post" : "Like post"}
          className="thumbs-icon"
        />
      </button>
    </div>
  );
}

export default LikeComponent;
