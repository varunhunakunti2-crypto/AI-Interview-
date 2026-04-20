// React ka useContext hook import kar rahe hain — context se data access karne ke liye
import { useContext } from "react";
// AuthContext import kar rahe hain
import { AuthContext } from "../auth.context.js";
// Backend API functions import kar rahe hain (login, logout, register)
import { login, logout, register } from "../services/auth.api";

// Custom hook — koi bhi component yahan se auth related functions aur state use kar sakta hai
export const useAuth = () => {
  // AuthContext se user, setUser, loading, setLoading le rahe hain
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context || {};

  // Login function — email aur password se user ko login karta hai
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      // API call karke login karo
      const data = await login({ email, password });
      // User state update karo
      setUser(data.user || data);
      // Success hone par true return karo
      return true;
    } catch {
      // Fail hone par false return karo
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function — naya user register karta hai
  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      // API call karke register karo
      const data = await register({ username, email, password });
      // User state update karo
      setUser(data.user || data);
      // Success hone par true return karo
      return true;
    } catch {
      // Fail hone par false return karo
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function — user ko logout karta hai aur state null kar deta hai
  const handleLogout = async () => {
    setLoading(true);
    try {
      // Backend ko logout request bhejo
      await logout();
      // User state null kar do
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // In saari values aur functions ko return kar rahe hain taaki components use kar sake
  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
