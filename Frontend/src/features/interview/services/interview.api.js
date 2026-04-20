import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const generateInterview = async ({
  jobDescription,
  selfDescription,
  resume,
}) => {
  const formData = new FormData();

  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);

  if (resume) {
    formData.append("resume", resume);
  }

  const response = await api.post("/api/interview", formData);
  return response.data;
};

export const getInterviewHistory = async () => {
  const response = await api.get("/api/interview");
  return response.data.interviewReports;
};

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data.interviewReport;
};
