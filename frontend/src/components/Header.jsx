import { Link } from "react-router-dom";
import "../index.css"; // Import the CSS file
import LogOut from "./Logout";
import acebook from "../../src/images/acebook.png";

const Header = () => {
  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          <img src={acebook}></img>
        </Link>
        <nav className="nav">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/" onClick={LogOut} className="nav-link">
            Logout
          </Link>
          <Link to="/signup" className="nav-link">
            Signup
          </Link>
          <Link to="/posts" className="nav-link">
            Posts
          </Link>
        </nav>
      </header>
      <div className="content"></div>
    </>
  );
};

export default Header;
