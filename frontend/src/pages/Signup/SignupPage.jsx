import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../../services/authentication";
import Header from "../../components/Header";
import "../AuthPages.css";
export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await signup(email, password, username);
      navigate("/login");
    } catch (err) {
      console.error("Error response from server:", err);
      setError(err.message || "An unexpected error occurred");
      navigate("/signup");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  function handleUserNameChange(event) {
    setUserName(event.target.value);
  }

  return (
    <>
      <Header></Header>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input
          className="textField"
          placeholder="Email"
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          className="textField"
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <label htmlFor="username">Username:</label>
        <input
          className="textField"
          placeholder="Username"
          id="username"
          type="text"
          value={username}
          onChange={handleUserNameChange}
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
      {error && (
        <div className="auth-error-msg">
          <p>{error}</p>
        </div>
      )}
      <div>
        <p>
          Already have an account?
          <a href="/login"> Login</a>
        </p>
      </div>
    </>
  );
}
