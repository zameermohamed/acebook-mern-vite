import { Link } from "react-router-dom";
import "../index.css"; // Import the CSS file

const Header = () => {
  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          Acebook
        </Link>
        <nav className="nav">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/logout" className="nav-link">
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
      <div className="content">{/* Your page content goes here */}</div>
    </>
  );
};

export default Header;
