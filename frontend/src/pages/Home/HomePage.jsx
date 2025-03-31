import { Link } from "react-router-dom";
import "../../components/Header";
import "./HomePage.css";
import Header from "../../components/Header";

export function HomePage() {
  return (
    <div className="home">
      <Header></Header>
      <h1>Welcome to Acebook!</h1>
      <Link to="/signup">Sign Up</Link>
      <Link to="/login">Log In</Link>
    </div>
  );
}
