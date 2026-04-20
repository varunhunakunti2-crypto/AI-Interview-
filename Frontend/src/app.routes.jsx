// React Router se browser routing create karne ka function aur Navigate component import kar rahe hain
import { createBrowserRouter, Navigate } from "react-router-dom";
// Auth pages import kar rahe hain
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
// Protected component — sirf logged in users hi iske andar jaayenge
import Protected from "./features/auth/components/Protected";
// Interview pages import kar rahe hain
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import History from "./features/interview/pages/History";

// Poori app ka routing configuration — kaun sa URL pe kaun sa component dikhega
export const router = createBrowserRouter([
  {
    // Root URL pe aane par /dashboard pe redirect karo
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    // Login page — publicly accessible
    path: "/login",
    element: <Login />,
  },
  {
    // Register page — publicly accessible
    path: "/register",
    element: <Register />,
  },
  {
    // Dashboard page — sirf logged in users ke liye (Protected wrap hai)
    path: "/dashboard",
    element: <Protected><History /></Protected>,
  },
  {
    // Home page — naya interview generate karne ke liye (sirf logged in users)
    path: "/home",
    element: <Protected><Home /></Protected>,
  },
  {
    // Interview page — naya interview result dikhayega (sirf logged in users)
    path: "/interview",
    element: <Protected><Interview /></Protected>,
  },
  {
    // Interview ID ke saath — specific saved report open karne ke liye
    path: "/interview/:interviewId",
    element: <Protected><Interview /></Protected>,
  },
  {
    // Koi bhi unknown URL aaye toh 404 page dikhao
    path: "*",
    element: <h1 style={{ color: "white" }}>404 Page Not Found</h1>,
  },
]);
