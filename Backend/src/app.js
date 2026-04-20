// Express framework import kar rahe hain — isse hi poori web app banegi
const express = require("express");
// CORS (Cross-Origin Resource Sharing) import — frontend ko backend se baat karne deta hai
const cors = require("cors");
// Cookies read/write karne ke liye cookie-parser import kar rahe hain
const cookieParser = require("cookie-parser");

// Express ka ek naya instance banate hain — yahi humara actual server hai
const app = express();
// Default mein in dono frontend URLs ko allow karenge
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

// Agar .env mein CORS_ORIGINS set hain toh unhe use karo, warna default origins use karo
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : defaultAllowedOrigins;

// middlewares
// JSON body ko request mein padhne ke liye
app.use(express.json());
// Cookies padhne ke liye cookieParser lagaya hai
app.use(cookieParser());
// CORS config — sirf allowed origins se requests accept karo
app.use(cors({
  origin(origin, callback) {
    // Agar origin nahi hai (same origin) ya allowed list mein hai toh allow karo
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allowed list mein nahi hai toh error do
    return callback(new Error("CORS origin not allowed"));
  },
  // Cookies ke saath request allow karne ke liye
  credentials: true
}));

// Test route — browser mein http://localhost:3000 kholo toh yahi dikhega
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// routes
// Authentication routes import kar rahe hain (login, register, logout, get-me)
const authRouter = require("./routes/auth.routes");
// Interview routes import kar rahe hain (generate, get all, get by id)
const interviewRouter = require("./routes/interview.routes");

// /api/auth ke saare requests authRouter handle karega
app.use("/api/auth", authRouter);

// 🔥 IMPORTANT: no auth middleware here
// /api/interview ke saare requests interviewRouter handle karega
app.use("/api/interview", interviewRouter);

// Is app ko baaki files mein use karne ke liye export kar rahe hain
module.exports = app;
