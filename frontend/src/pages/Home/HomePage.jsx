import { Link } from "react-router-dom";
import "../../components/Header";
import "./HomePage.css";
import Header from "../../components/Header";

export function HomePage() {
  return (
    <div className="home">
      <Header></Header>
      <h1>Welcome to Acebook!</h1>
    </div>
  );
}
