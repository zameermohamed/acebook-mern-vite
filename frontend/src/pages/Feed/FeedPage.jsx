import { useState } from "react";
import Header from "../../components/Header";
import PostContainer from "../../components/PostContainer/PostContainer";
import NewPost from "../../components/NewPost/NewPost";

export function FeedPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const refreshPosts = () => {
    console.log("MIKAL TEST.");
    setRefreshTrigger(refreshTrigger + 1);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      <Header onThemeChange={toggleTheme}></Header>
      <h2>Posts</h2>
      <NewPost onPostCreated={refreshPosts} />
      <PostContainer
        onPostDeleted={refreshPosts}
        refreshTrigger={refreshTrigger}
        singlePost={false}
        theme={theme}
      />
    </>
  );
}
