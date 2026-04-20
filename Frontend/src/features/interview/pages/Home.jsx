// React aur useState hook import kar rahe hain
import React, { useState } from "react";
// Navigation ke liye useNavigate import kar rahe hain
import { useNavigate } from "react-router-dom";
// Home page ki CSS styles import kar rahe hain
import "./style/home.css";
// Interview generate karne ki API function import kar rahe hain
import { generateInterview } from "../services/interview.api.js";
// Reusable PageHeader component import kar rahe hain
import PageHeader from "../components/PageHeader.jsx";

// Home page component — naya interview strategy generate karne ki page
const Home = () => {
  // navigate function — dusre page pe redirect karne ke liye
  const navigate = useNavigate();

  // Job description state
  const [jobDescription, setJobDescription] = useState("");
  // Self description state
  const [selfDescription, setSelfDescription] = useState("");
  // Resume file state
  const [resume, setResume] = useState(null);
  // Loading state — jab report generate ho raha ho
  const [loading, setLoading] = useState(false);

  // Submit button click hone par ye function chalega
  const handleSubmit = async () => {
    // Job description required hai — nahi diya toh alert dikhao
    if (!jobDescription.trim()) {
      alert("Job description is required");
      return;
    }

    try {
      // Loading start kar do
      setLoading(true);

      // Backend se AI interview report generate karo
      const response = await generateInterview({
        jobDescription,
        selfDescription,
        resume,
      });

      // Response ko localStorage mein save karo (reload ke baad bhi kaam aaye)
      localStorage.setItem("interviewData", JSON.stringify(response));

      // Response mein _id hai toh uske path pe jaao, warna generic path
      const interviewPath = response._id
        ? `/interview/${response._id}`
        : "/interview";

      // Interview page pe redirect karo with response data
      navigate(interviewPath, { state: response });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      // Loading band kar do
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
