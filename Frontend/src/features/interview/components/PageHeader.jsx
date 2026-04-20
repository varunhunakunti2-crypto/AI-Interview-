// React import kar rahe hain
import React from "react";
// Navigation ke liye useNavigate import kar rahe hain
import { useNavigate } from "react-router-dom";
// useAuth hook se logout function milega
import { useAuth } from "../../auth/hooks/useAuth";

// PageHeader component — har page ke upar dikhnewala header section
// title, subtitle aur extra buttons (children) accept karta hai
const PageHeader = ({ title, subtitle, children }) => {
  // navigate function — dusre page pe jaane ke liye
  const navigate = useNavigate();
  // handleLogout function useAuth hook se
  const { handleLogout } = useAuth();

  // Logout click hone par ye function chalega
  const onLogout = async () => {
    // Backend se logout karo
    await handleLogout();
    // localStorage se interview data saaf karo
    localStorage.removeItem("interviewData");
    // Login page pe redirect karo
    navigate("/login");
  };

  return (
    // Header element — page ke top pe dikhega
    <header className="page-toolbar">
      <div className="page-toolbar__copy">
        {/* App ka naam */}
        <p className="page-toolbar__eyebrow">AI Interview Studio</p>
        {/* Page ka title */}
        <h1>{title}</h1>
        {/* Subtitle agar di gayi ho toh dikhao */}
        {subtitle ? <p className="page-toolbar__subtitle">{subtitle}</p> : null}
      </div>

      <div className="page-toolbar__actions">
        {/* Extra buttons (children) jo parent se aate hain */}
        {children}
        {/* Logout button */}
        <button
          type="button"
          className="button toolbar-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
