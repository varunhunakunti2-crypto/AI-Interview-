// Axios library import kar rahe hain — HTTP requests bhejne ke liye
import axios from "axios";

// Axios ka pre-configured instance — baseURL aur credentials set hai
// Locally: http://localhost:3000 | Production: Render ka URL (env se aayega)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// generateInterview function — naya interview report generate karne ke liye POST request
export const generateInterview = async ({
  jobDescription,
  selfDescription,
  resume,
}) => {
  // FormData se multipart request banate hain (PDF file aur text data ek saath)
  const formData = new FormData();

  // Required fields FormData mein add karo
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);

  // Resume file sirf tab add karo jab upload ki gayi ho
  if (resume) {
    formData.append("resume", resume);
  }

  // Backend ko POST request bhejo aur response return karo
  const response = await api.post("/api/interview", formData);
  return response.data;
};

// getInterviewHistory function — current user ke saare reports fetch karta hai
export const getInterviewHistory = async () => {
  const response = await api.get("/api/interview");
  // interviewReports array return karo
  return response.data.interviewReports;
};

// getInterviewReportById function — ek specific report ID se fetch karta hai
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  // Specific report object return karo
  return response.data.interviewReport;
};
