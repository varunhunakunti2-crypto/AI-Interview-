import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import History from "./features/interview/pages/History";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Protected><History /></Protected>,
  },
  {
    path: "/home",
    element: <Protected><Home /></Protected>,
  },
  {
    path: "/interview",
    element: <Protected><Interview /></Protected>,
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Interview /></Protected>,
  },
  {
    path: "*",
    element: <h1 style={{ color: "white" }}>404 Page Not Found</h1>,
  },
]);
