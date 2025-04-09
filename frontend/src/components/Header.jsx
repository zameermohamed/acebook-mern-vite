import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css"; // Import the global CSS file
import "./Header.css"; // Make sure to import the CSS file
import LogOut from "./Logout";
import acebookLight from "../images/acebook.png"; // Import the light version
import acebookDark from "../images/acebook-dark-mode.png"; // Import the dark version

const Header = ({ onThemeChange }) => {
  const token = localStorage.getItem("token");
  const loggedIn = token !== null;

  // Check if a theme is saved in localStorage, default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Apply the theme when it changes
  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("theme", theme);

    // Apply theme to document body
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    if (onThemeChange) onThemeChange(); // Call the parent function to notify about theme change
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          {/* Conditionally render the logo based on current theme */}
          <img
            src={theme === "light" ? acebookLight : acebookDark}
            alt="Acebook logo"
          />
        </Link>
        <nav className="nav">
          {!loggedIn && (
            <Link to="/signup" className="nav-link">
              Signup
            </Link>
          )}
          {!loggedIn && (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
          {loggedIn && (
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          )}
          {loggedIn && (
            <Link to="/posts" className="nav-link">
              Posts
            </Link>
          )}
          {loggedIn && (
            <Link to="/" onClick={LogOut} className="nav-link">
              Logout
            </Link>
          )}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </nav>
      </header>
      <div className="content"></div>
    </>
  );
};

export default Header;
