import "../../components/Header";
import "./HomePage.css";
import Header from "../../components/Header";
import AboutUsContainer from "../../components/AboutUsContainer";
export function HomePage() {
  return (
    <>
      <div>
        <Header></Header>
      </div>
      <div className="home">
        <h1>Welcome to Acebook!</h1>
      </div>
      <AboutUsContainer />
    </>
  );
}
