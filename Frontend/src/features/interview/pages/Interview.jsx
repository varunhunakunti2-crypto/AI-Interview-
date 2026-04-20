// React aur required hooks import kar rahe hain
import React, { useEffect, useMemo, useState } from "react";
// URL params, navigation aur location hooks import kar rahe hain
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Interview page ki CSS styles
import "./style/interview.css";
// Reusable header component
import PageHeader from "../components/PageHeader";
// Specific report fetch karne ki API function
import { getInterviewReportById } from "../services/interview.api";
// Report text format karne ki utility function
import { buildInterviewReportText } from "../services/report.formatter";

// AnimatedCircle component — match score ko animated circle mein dikhata hai
const AnimatedCircle = ({ score }) => {
  // Progress state — animation ke liye 0 se score tak jaayega
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    // Har 20ms mein progress 1 se badheyga jab tak score na pahunch jaaye
    const interval = setInterval(() => {
      current += 1;
      if (current <= score) {
        setProgress(current);
      } else {
        // Score pe pahunch gaye toh interval band karo
        clearInterval(interval);
      }
    }, 20);

    // Cleanup — component unmount hone par interval saaf karo
    return () => clearInterval(interval);
  }, [score]);

  return (
    // SVG circle jo progress dikhata hai
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

// Main Interview page component — interview report dikhata hai
const Interview = () => {
  // URL state (navigate ke saath bheja gaya data)
  const { state } = useLocation();
  // navigate function
  const navigate = useNavigate();
  // URL se interviewId nikalo
  const { interviewId } = useParams();
  // Active tab state — 'roadmap', 'technical', ya 'behavioral'
  const [activeTab, setActiveTab] = useState("roadmap");
  // Loading state — agar interviewId hai aur state nahi hai toh loading true hoga
  const [loading, setLoading] = useState(Boolean(interviewId && !state));
  // Feedback message dikhane ke liye state (copy/export ke baad)
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Initial data nikalne ka logic — state > localStorage order mein check karta hai
  const initialData = useMemo(() => {
    // Agar state se data aaya toh use kar lo
    if (state) {
      return state;
    }

    // Agar interviewId hai toh API se fetch karenge (baad mein)
    if (interviewId) {
      return null;
    }

    // LocalStorage mein saved data check karo
    const savedInterview = localStorage.getItem("interviewData");

    if (!savedInterview) {
      return null;
    }

    try {
      return JSON.parse(savedInterview);
    } catch {
      // Parse fail hua toh localStorage saaf karo
      localStorage.removeItem("interviewData");
      return null;
    }
  }, [interviewId, state]);

  // data state — interview report ka actual data
  const [data, setData] = useState(initialData);

  // Jab state aaye toh localStorage mein save karo (page refresh pe bhi kaam aaye)
  useEffect(() => {
    if (state) {
      localStorage.setItem("interviewData", JSON.stringify(state));
    }
  }, [state]);

  // Agar interviewId hai aur state nahi hai toh API se report fetch karo
  useEffect(() => {
    if (!interviewId || state) {
      return undefined;
    }

    let ignore = false;

    const loadInterview = async () => {
      setLoading(true);
      try {
        // API se specific interview report fetch karo
        const report = await getInterviewReportById(interviewId);
        if (!ignore) {
          setData(report);
          // localStorage mein bhi save kar lo
          localStorage.setItem("interviewData", JSON.stringify(report));
        }
      } catch {
        // Error aaye toh message set karo
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

    // Cleanup — component unmount hone par ignore true kar do
    return () => {
      ignore = true;
    };
  }, [interviewId, state]);

  // Report ko clipboard mein copy karne ka function
  const handleCopyReport = async () => {
    if (!data) {
      return;
    }

    try {
      // Report text banao aur clipboard mein copy karo
      await navigator.clipboard.writeText(buildInterviewReportText(data));
      setFeedbackMessage("Report copied to clipboard.");
    } catch {
      setFeedbackMessage("Copy failed. Please try again.");
    }
  };

  // Report ko text file ke roop mein download karne ka function
  const handleExportReport = () => {
    if (!data) {
      return;
    }

    // File ka naam report title se banao (lowercase aur hyphens ke saath)
    const fileName = (data.title || "interview-report")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Text content se Blob banao (file create karne ke liye)
    const blob = new Blob([buildInterviewReportText(data)], {
      type: "text/plain;charset=utf-8",
    });

    // Temporary URL banao aur download trigger karo
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName || "interview-report"}.txt`;
    link.click();
    // URL memory se free karo
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
