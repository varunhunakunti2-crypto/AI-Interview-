// PDF file ko text mein convert karne ke liye pdf-parse import kar rahe hain
const pdfParse = require("pdf-parse");
// AI se interview report generate karne ke liye service import kar rahe hain
const generateInterviewReport = require("../services/ai.service");
// Interview report ko database mein save/fetch karne ke liye model import kar rahe hain
const interviewReportModel = require("../models/interviewReport.model");

// Naya interview report generate karne ka main controller
async function generateInterviewReportController(req, res) {
  try {
    // Resume text initially empty rakho
    let resumeText = "";

    // Agar user ne PDF file upload ki hai toh use text mein convert karo
    if (req.file) {
      const data = await pdfParse(req.file.buffer);
      resumeText = data.text;
    }

    // Request body se job description aur self description nikalo
    const { selfDescription, jobDescription } = req.body;

    // Job description required hai, agar nahi toh 400 error do
    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    // AI service ko call karo — resume, selfDescription aur jobDescription de do
    const aiResult = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    // AI ka result database mein save karo (user ke saath link karke)
    const interviewReport = await interviewReportModel.create({
      resume: resumeText,
      selfDescription,
      jobDescription,
      user: req.user.id,
      ...aiResult,
    });

    // Naya report response mein bhejo
    res.status(201).json(interviewReport);
  } catch (error) {
    console.error("ERROR:", error);
    // Agar kuch galat ho toh 500 error bhejo with message
    res.status(500).json({
      message: error.message,
    });
  }
}

// ID se ek specific interview report fetch karne ka controller
async function getInterviewReportByIdController(req, res) {
  // URL se interviewId nikalo
  const { interviewId } = req.params;

  // Database mein us ID aur current user ke liye report dhundho
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  // Agar report nahi mili toh 404 error do
  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  // Report mili toh response mein bhejo
  res.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
}

// Current user ke saare interview reports fetch karne ka controller
async function getAllInterviewReportsController(req, res) {
  // Current user ke saare reports dhundho, latest pehle dikhao
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 });

  // Saare reports response mein bhejo
  res.status(200).json({
    message: "Interview reports fetched successfully",
    interviewReports,
  });
}

// Teeno controllers export kar rahe hain taaki routes mein use ho sake
module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
};
