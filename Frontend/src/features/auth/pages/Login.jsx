// React aur useState hook import kar rahe hain
import React, { useState } from "react";
// Navigation aur Link component import kar rahe hain
import { useNavigate, Link } from "react-router-dom";
// Login page ke liye CSS styles import kar rahe hain
import "../auth.form.css";
// Auth hook se login function milega
import { useAuth } from "../hooks/useAuth";

// Login page component
const Login = () => {
  // Loading state aur handleLogin function useAuth hook se le rahe hain
  const { loading, handleLogin } = useAuth();
  // navigate function — dusre page pe jaane ke liye
  const navigate = useNavigate();

  // Email aur password ke liye local state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form submit hone par ye function chalega
  const handleSubmit = async (event) => {
    // Default form submission rok rahe hain (page reload nahi hoga)
    event.preventDefault();

    // Login ki koshish kar rahe hain
    const success = await handleLogin({ email, password });

    // Agar login successful raha toh dashboard pe jaao
    if (success) {
      navigate("/dashboard");
    }
  };

  // Agar data load ho raha hai toh loading screen dikhao
  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        {/* Login form — submit par handleSubmit function call hoga */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            {/* Email input — user type kare toh email state update hoga */}
            <input
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            {/* Password input — user type kare toh password state update hoga */}
            <input
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="button primary-button">
            Login
          </button>
        </form>

        {/* Register page ka link */}
        <p>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
