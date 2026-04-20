const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : defaultAllowedOrigins;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true
}));

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// routes
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);

// 🔥 IMPORTANT: no auth middleware here
app.use("/api/interview", interviewRouter);

module.exports = app;
