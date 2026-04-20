import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { getInterviewHistory } from "../services/interview.api";
import { useAuth } from "../../auth/hooks/useAuth";
import "./style/history.css";

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadReports = async () => {
      try {
        const history = await getInterviewHistory();
        if (!ignore) {
          setReports(history);
        }
      } catch {
        if (!ignore) {
          setReports([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadReports();

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
