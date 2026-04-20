import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style/interview.css";
import PageHeader from "../components/PageHeader";
import { getInterviewReportById } from "../services/interview.api";
import { buildInterviewReportText } from "../services/report.formatter";

const AnimatedCircle = ({ score }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current <= score) {
        setProgress(current);
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [score]);

  return (
    <svg className="progress-circle" viewBox="0 0 36 36">
      <path
        className="circle-bg"
        d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        className="circle-progress"
        strokeDasharray={`${progress}, 100`}
        d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text x="18" y="20.35" className="circle-text">
        {progress}%
      </text>
    </svg>
  );
};

const Interview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [activeTab, setActiveTab] = useState("roadmap");
  const [loading, setLoading] = useState(Boolean(interviewId && !state));
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const initialData = useMemo(() => {
    if (state) {
      return state;
    }

    if (interviewId) {
      return null;
    }

    const savedInterview = localStorage.getItem("interviewData");

    if (!savedInterview) {
      return null;
    }

    try {
      return JSON.parse(savedInterview);
    } catch {
      localStorage.removeItem("interviewData");
      return null;
    }
  }, [interviewId, state]);

  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (state) {
      localStorage.setItem("interviewData", JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    if (!interviewId || state) {
      return undefined;
    }

    let ignore = false;

    const loadInterview = async () => {
      setLoading(true);
      try {
        const report = await getInterviewReportById(interviewId);
        if (!ignore) {
          setData(report);
          localStorage.setItem("interviewData", JSON.stringify(report));
        }
      } catch {
        if (!ignore) {
          setFeedbackMessage("Unable to load this saved report.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadInterview();

    return () => {
      ignore = true;
    };
  }, [interviewId, state]);

  const handleCopyReport = async () => {
    if (!data) {
      return;
    }

    try {
      await navigator.clipboard.writeText(buildInterviewReportText(data));
      setFeedbackMessage("Report copied to clipboard.");
    } catch {
      setFeedbackMessage("Copy failed. Please try again.");
    }
  };

  const handleExportReport = () => {
    if (!data) {
      return;
    }

    const fileName = (data.title || "interview-report")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const blob = new Blob([buildInterviewReportText(data)], {
      type: "text/plain;charset=utf-8",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName || "interview-report"}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    setFeedbackMessage("Report exported successfully.");
  };

  if (loading) {
    return (
      <main className="interview-page interview-page--loading">
        <p className="loading">Loading interview report...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="interview-page interview-page--loading">
        <p className="loading">No interview data found</p>
      </main>
    );
  }

  const {
    technicalQuestions = [],
    behavioralQuestions = [],
    skillGaps = [],
    preparationPlan = [],
    matchScore = 88,
    title = "Interview Preparation",
  } = data;

  return (
    <main className="interview-page">
      <div className="interview-page__shell">
        <PageHeader
          title={title}
          subtitle="Review your saved interview strategy, then copy or export it whenever you need."
        >
          <button
            type="button"
            className="button toolbar-button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className="button toolbar-button toolbar-button--accent"
            onClick={() => navigate("/home")}
          >
            New Report
          </button>
        </PageHeader>

        <div className="report-actions">
          <button
            type="button"
            className="button toolbar-button"
            onClick={handleCopyReport}
          >
            Copy Report
          </button>
          <button
            type="button"
            className="button toolbar-button"
            onClick={handleExportReport}
          >
            Export Report
          </button>
          {feedbackMessage ? <span className="report-actions__feedback">{feedbackMessage}</span> : null}
        </div>

        <div className="interview">
          <aside className="sidebar">
            <h4>Sections</h4>
            <button
              className={activeTab === "technical" ? "active" : ""}
              onClick={() => setActiveTab("technical")}
            >
              Technical Questions
            </button>
            <button
              className={activeTab === "behavioral" ? "active" : ""}
              onClick={() => setActiveTab("behavioral")}
            >
              Behavioral Questions
            </button>
            <button
              className={activeTab === "roadmap" ? "active" : ""}
              onClick={() => setActiveTab("roadmap")}
            >
              Road Map
            </button>
          </aside>

          <section className="main">
            {activeTab === "roadmap" && (
              <div className="roadmap-container">
                <h3 className="title">
                  Preparation Road Map
                  <span>{preparationPlan.length}-day plan</span>
                </h3>
                <div className="timeline">
                  {preparationPlan.map((day, index) => (
                    <div key={index} className="timeline-item">
                      <div className="dot"></div>
                      <div className="content">
                        <span className="day">Day {day.day}</span>
                        <h4>{day.focus}</h4>
                        <ul>
                          {day.tasks.map((task, taskIndex) => (
                            <li key={taskIndex}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "technical" &&
              technicalQuestions.map((question, index) => (
                <div key={index} className="card">
                  <h4>{question.question}</h4>
                  <p><strong>Why:</strong> {question.intention}</p>
                  <p><strong>Answer:</strong> {question.answer}</p>
                </div>
              ))}

            {activeTab === "behavioral" &&
              behavioralQuestions.map((question, index) => (
                <div key={index} className="card">
                  <h4>{question.question}</h4>
                  <p><strong>Why:</strong> {question.intention}</p>
                  <p><strong>Answer:</strong> {question.answer}</p>
                </div>
              ))}
          </section>

          <aside className="right-panel">
            <div className="score-box">
              <p>MATCH SCORE</p>
              <AnimatedCircle score={matchScore} />
              <small>Strong match for this role</small>
            </div>

            <div className="skills-box">
              <p>SKILL GAPS</p>
              <div className="skills">
                {skillGaps.map((skill, index) => (
                  <span key={index} className={`skill ${skill.severity}`}>
                    {skill.skill}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Interview;
