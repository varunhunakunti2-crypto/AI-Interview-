 // MongoDB ke saath kaam karne ke liye mongoose import kar rahe hain
 const mongoose = require('mongoose')


 // Blacklist token ka schema — logout hue tokens yahan store honge
 const blacklistTokenSchema = new mongoose.Schema({
     // Token field — jo JWT token blacklist karna hai wo yahan store hoga
     token: {
         type: String,
         required: [ true, "token is required to be added in blacklist" ]
     }
 }, {
     // createdAt aur updatedAt fields automatically add hongi
     timestamps: true
 })

 // Schema se MongoDB model banate hain — ye 'blacklistTokens' collection use karega
 const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)


 // Is model ko baaki files mein use karne ke liye export kar rahe hain
 module.exports = tokenBlacklistModel