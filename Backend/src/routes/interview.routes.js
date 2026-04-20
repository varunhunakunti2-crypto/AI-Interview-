// Express framework import kar rahe hain
const express = require("express");
// Auth middleware — sirf logged in users hi interview routes access kar sakte hain
const authMiddleware = require("../middlewares/auth.middleware");
// Interview controllers import kar rahe hain
const interviewController = require("../controllers/interview.controller");
// File upload middleware (multer) import kar rahe hain
const upload = require("../middlewares/file.middleware");

// Interview router ka instance bana rahe hain
const interviewRouter = express.Router();

// POST /api/interview — naya interview report generate karo
// authUser check karega user logged in hai ya nahi
// upload.single("resume") ek PDF file accept karega
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterviewReportController
);

// GET /api/interview/report/:interviewId — ek specific report ID se fetch karo
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController
);

// GET /api/interview — current user ke saare interview reports fetch karo
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController
);

// Router ko export kar rahe hain taaki app.js mein use ho sake
module.exports = interviewRouter;
