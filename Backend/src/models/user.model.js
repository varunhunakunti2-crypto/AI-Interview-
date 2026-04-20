 // MongoDB ke saath kaam karne ke liye mongoose import kar rahe hain
 const mongoose = require("mongoose")


 // User ka schema define kar rahe hain — database mein user ka structure kaise hoga
 const userSchema = new mongoose.Schema({
     // Username field — unique hona chahiye
     username: {
         type: String,
         unique: [ true, "username already taken" ],
         required: true,
     },

     // Email field — ek email ek hi account ke liye allowed hai
     email: {
         type: String,
         unique: [ true, "Account already exists with this email address" ],
         required: true,
     },

     // Password field — hashed form mein store hoga
     password: {
         type: String,
         required: true
     }
 })

 // Schema se MongoDB model banate hain — ye 'users' collection ke saath kaam karega
 const userModel = mongoose.model("users", userSchema)

 // Is model ko baaki files mein use karne ke liye export kar rahe hain
 module.exports = userModel