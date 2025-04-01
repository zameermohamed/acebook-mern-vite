import { Link } from "react-router-dom";

import "../index.css"; // Import the CSS file
import LogOut from "./Logout";
import acebook from "../../src/images/acebook.png";

const Header = () => {
  const token = localStorage.getItem("token");
  const loggedIn = token !== null;
  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          <img src={acebook}></img>
        </Link>
        <nav className="nav">
          {!loggedIn && (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
          {!loggedIn && (
            <Link to="/signup" className="nav-link">
              Signup
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
        </nav>
      </header>
      <div className="content"></div>
    </>
  );
};

export default Header;
