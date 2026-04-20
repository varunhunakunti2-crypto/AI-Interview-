// React aur hooks import kar rahe hain
import React, { useEffect, useState } from "react";
// Navigation ke liye useNavigate import kar rahe hain
import { useNavigate } from "react-router-dom";
// Reusable page header component
import PageHeader from "../components/PageHeader";
// Interview history fetch karne ki API function
import { getInterviewHistory } from "../services/interview.api";
// useAuth hook se current user ka data
import { useAuth } from "../../auth/hooks/useAuth";
// History page ki CSS styles
import "./style/history.css";

// History page component — saare purane interview reports dikhata hai
const History = () => {
  // navigate function — dusre page pe jaane ke liye
  const navigate = useNavigate();
  // Current logged in user ka data
  const { user } = useAuth();
  // Reports ki list store karne ke liye state
  const [reports, setReports] = useState([]);
  // Loading state — data fetch hone tak true rahega
  const [loading, setLoading] = useState(true);

  // Component mount hone par reports fetch karte hain
  useEffect(() => {
    // ignore flag — agar component unmount ho jaaye toh state update na ho
    let ignore = false;

    const loadReports = async () => {
      try {
        // Backend se saare reports fetch karo
        const history = await getInterviewHistory();
        // Agar component abhi mounted hai toh reports set karo
        if (!ignore) {
          setReports(history);
        }
      } catch {
        // Error aaye toh empty array set karo
        if (!ignore) {
          setReports([]);
        }
      } finally {
        // Loading band karo
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadReports();

    // Cleanup function — component unmount hone par ignore true kar do
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="history-page">
      <div className="history-shell">
        <PageHeader
          title="Interview history dashboard"
          subtitle={`Welcome back${user?.username ? `, ${user.username}` : ""}. Review past reports or create a fresh strategy.`}
        >
          <button
            type="button"
            className="button toolbar-button toolbar-button--accent"
            onClick={() => navigate("/home")}
          >
            Create New Report
          </button>
        </PageHeader>

        <section className="history-summary">
          <article className="history-stat">
            <span>Total reports</span>
            <strong>{reports.length}</strong>
          </article>
          <article className="history-stat">
            <span>Best match score</span>
            <strong>
              {reports.length
                ? `${Math.max(...reports.map((report) => report.matchScore ?? 0))}%`
                : "0%"}
            </strong>
          </article>
          <article className="history-stat">
            <span>Latest report</span>
            <strong>
              {reports[0]?.createdAt
                ? new Date(reports[0].createdAt).toLocaleDateString()
                : "No reports yet"}
            </strong>
          </article>
        </section>

        <section className="history-list">
          <div className="history-list__header">
            <h2>Saved interview reports</h2>
            <p>Your past reports stay here so you can reopen them anytime.</p>
          </div>

          {loading ? (
            <div className="history-empty">Loading your reports...</div>
          ) : reports.length === 0 ? (
            <div className="history-empty">
              <h3>No interview reports yet</h3>
              <p>Create your first interview strategy to see it here.</p>
              <button
                type="button"
                className="button primary-button"
                onClick={() => navigate("/home")}
              >
                Generate First Report
              </button>
            </div>
          ) : (
            <div className="history-grid">
              {reports.map((report) => (
                <article key={report._id} className="history-card">
                  <div className="history-card__meta">
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    <strong>{report.matchScore ?? 0}% Match</strong>
                  </div>
                  <h3>{report.title}</h3>
                  <p>{report.jobDescription?.slice(0, 150) || "No job description available."}</p>
                  <div className="history-card__footer">
                    <span>{report.preparationPlan?.length || 0} day plan</span>
                    <button
                      type="button"
                      className="button primary-button"
                      onClick={() => navigate(`/interview/${report._id}`, { state: report })}
                    >
                      Open Report
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default History;
