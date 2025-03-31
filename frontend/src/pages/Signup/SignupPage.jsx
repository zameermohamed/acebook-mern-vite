import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../../services/authentication";
import Header from "../../components/Header";

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
      if (err.response) {
        console.log("Full error response:", err.response);
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message); // Store actual error message
        } else {
          setError("An unexpected error occurred"); // Fallback error message
        }
      } else {
        setError("An unexpected error occurred");
      }
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
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          placeholder="password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <label htmlFor="username">Username:</label>
        <input
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
