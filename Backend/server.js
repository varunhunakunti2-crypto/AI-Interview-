const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors")

const app = require("./src/app");

const PORT = 3000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

startServer();