import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

const PageHeader = ({ title, subtitle, children }) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const onLogout = async () => {
    await handleLogout();
    localStorage.removeItem("interviewData");
    navigate("/login");
  };

  return (
    <header className="page-toolbar">
      <div className="page-toolbar__copy">
        <p className="page-toolbar__eyebrow">AI Interview Studio</p>
        <h1>{title}</h1>
        {subtitle ? <p className="page-toolbar__subtitle">{subtitle}</p> : null}
      </div>

      <div className="page-toolbar__actions">
        {children}
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
