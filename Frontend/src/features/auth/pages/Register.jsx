// React aur useState hook import kar rahe hain
import React, { useState } from "react";
// Navigation aur Link component import kar rahe hain
import { useNavigate, Link } from "react-router-dom";
// useAuth hook se register function milega
import { useAuth } from "../hooks/useAuth";
// Register page ke liye CSS styles import kar rahe hain
import "../auth.form.css";

// Register page component — naya account banane ke liye
const Register = () => {
  // navigate function — dusre page pe jaane ke liye
  const navigate = useNavigate();
  // Username, email aur password ke liye local state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loading state aur handleRegister function useAuth hook se
  const { loading, handleRegister } = useAuth();

  // Form submit hone par ye function chalega
  const handleSubmit = async (event) => {
    // Default form submission rok rahe hain
    event.preventDefault();
    // Register ki koshish kar rahe hain
    const success = await handleRegister({ username, email, password });

    // Agar register successful raha toh dashboard pe jaao
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
        <h1>Register</h1>

        {/* Register form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            {/* Username input */}
            <input
              onChange={(event) => setUsername(event.target.value)}
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            {/* Email input */}
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
            {/* Password input */}
            <input
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
            />
          </div>

          {/* Register submit button */}
          <button className="button primary-button">Register</button>
        </form>

        {/* Login page ka link */}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
