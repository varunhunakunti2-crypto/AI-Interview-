// MongoDB se connect karne ke liye mongoose library import kar rahe hain
const mongoose = require("mongoose");
// .env file ke variables load karne ke liye dotenv config kar rahe hain
require("dotenv").config();
// Cross-Origin requests allow karne ke liye cors import kar rahe hain
const cors = require("cors")

// Humara main Express app src/app.js se import kar rahe hain
const app = require("./src/app");

// Server ka port number define kar rahe hain — 3000 pe chalega
const PORT = 3000;

// Async function jo pehle database connect karti hai, phir server start karti hai
const startServer = async () => {
  try {
    // MongoDB se connect kar rahe hain (URI .env file se aa raha hai)
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    // Database connect hone ke baad server ko PORT pe sun-na shuru karte hain
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    // Agar koi error aaye toh console mein print karte hain aur server nahi chalega
    console.error("❌ MongoDB connection error:", error);
  }
};

// Server start karne ke liye function call kar rahe hain
startServer();