// useAuth hook import kar rahe hain — user aur loading state milegi
import { useAuth } from "../hooks/useAuth";
// Redirect karne ke liye Navigate import kar rahe hain
import { Navigate } from "react-router-dom";
import React from "react";

// Protected component — sirf logged in users ke liye access deta hai
const Protected = ({ children }) => {
  // useAuth se current user aur loading state lete hain
  const { loading, user } = useAuth();

  // Agar data fetch ho raha hai toh loading screen dikhao
  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  // Agar user logged in nahi hai toh /login pe redirect karo
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children; // ✅ correct
};

export default Protected;