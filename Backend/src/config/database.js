// MongoDB connection ke liye mongoose library import kar rahe hain
const mongoose = require("mongoose")

// Async function jo MongoDB se connect karta hai
async function connectToDB() {
    try {
        console.log("Connecting to DB...")   // 👈 debug
        // .env file mein MONGO_URI store hai, usi se connect kar rahe hain
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database ✅")
    } catch (error) {
        // Agar connection fail ho jaaye toh error message print karo
        console.log("Database Error ❌")
        console.log(error.message)
    }
}

// Is function ko dusri files mein use karne ke liye export kar rahe hain
module.exports = connectToDB