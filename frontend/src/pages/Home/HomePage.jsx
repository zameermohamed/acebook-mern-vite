import "../../components/Header";
import "./HomePage.css";
import Header from "../../components/Header";
import AboutUsContainer from "../../components/AboutUsContainer";
import { useState } from "react";
export function HomePage() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };
  return (
    <>
      <div>
        <Header onThemeChange={toggleTheme}></Header>
      </div>
      <div className="home">
        <h1>Welcome to Acebook!</h1>
        <h2>Who we are</h2>
      </div>
      <AboutUsContainer />
      <h3>Many thanks from the acebook dev team!</h3>
    </>
  );
}
