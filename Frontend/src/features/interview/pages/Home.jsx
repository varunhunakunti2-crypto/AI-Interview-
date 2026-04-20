import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/home.css";
import { generateInterview } from "../services/interview.api.js";
import PageHeader from "../components/PageHeader.jsx";

const Home = () => {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      alert("Job description is required");
      return;
    }

    try {
      setLoading(true);

      const response = await generateInterview({
        jobDescription,
        selfDescription,
        resume,
      });

      localStorage.setItem("interviewData", JSON.stringify(response));

      const interviewPath = response._id
        ? `/interview/${response._id}`
        : "/interview";

      navigate(interviewPath, { state: response });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home">
      <PageHeader
        title="Create your custom interview plan"
        subtitle="Generate a new interview strategy, then reopen any saved report from your dashboard whenever you need it."
      >
        <button
          type="button"
          className="button toolbar-button"
          onClick={() => navigate("/dashboard")}
        >
          View History
        </button>
      </PageHeader>

      <div className="header">
        <h1>
          Create Your Custom <span>Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </div>

      <div className="card">
        <div className="left">
          <div className="section-header">
            <span>JD</span>
            <h3>Target Job Description</h3>
            <small className="required">Required</small>
          </div>

          <textarea
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          />
        </div>

        <div className="right">
          <div className="section">
            <h3>Your Profile</h3>

            <p className="label">
              Upload Resume <span>(PDF Required)</span>
            </p>

            <label className="upload-box" htmlFor="resume">
              <div>
                <p>{resume ? resume.name : "Click to upload or drag and drop"}</p>
                <small>PDF up to 4MB</small>
              </div>
            </label>

            <input
              hidden
              type="file"
              id="resume"
              accept=".pdf"
              onChange={(event) => setResume(event.target.files?.[0] ?? null)}
            />
          </div>

          <div className="section">
            <label>Quick Self-Description</label>
            <textarea
              placeholder="Briefly describe your experience..."
              value={selfDescription}
              onChange={(event) => setSelfDescription(event.target.value)}
            />
          </div>

          <button
            className="button primary-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate My Interview Strategy"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
