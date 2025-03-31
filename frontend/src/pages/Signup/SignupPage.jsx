import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../../services/authentication";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await signup(email, password);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(true);
      navigate("/signup");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <>
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
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
      {error && (
        <div className="auth-error-msg">
          <p>Email already exists</p>
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
