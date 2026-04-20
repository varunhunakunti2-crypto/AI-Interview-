 // JWT token verify karne ke liye jsonwebtoken import kar rahe hain
 const jwt = require("jsonwebtoken")
 // Blacklisted tokens check karne ke liye model import kar rahe hain
 const tokenBlacklistModel = require("../models/blacklist.model")



 // Ye middleware check karta hai ki user logged in hai ya nahi
 async function authUser(req, res, next) {

     // Cookie se token nikaal rahe hain
     const token = req.cookies.token

     // Agar cookie mein token nahi hai toh 401 error do (unauthenticated)
     if (!token) {
         return res.status(401).json({
             message: "Token not provided."
         })
     }

     // Check karo ki ye token pehle se blacklist mein toh nahi hai (logout hua token)
     const isTokenBlacklisted = await tokenBlacklistModel.findOne({
         token
   })

    if (isTokenBlacklisted) {         return res.status(401).json({
             message: "token is invalid"
         })
     }

     try {
         // JWT_SECRET se token verify karo — agar valid hai toh decoded data milega
         const decoded = jwt.verify(token, process.env.JWT_SECRET)

         // Decoded user info ko req.user mein set karo taaki agle handler use kar sake
         req.user = decoded

         // Agle middleware ya route handler ko call karo
         next()

     } catch (err) {
         // Agar token invalid ya expired hai toh 401 error do
         return res.status(401).json({
             message: "Invalid token."
         })
     }

 }

 // authUser middleware ko export kar rahe hain
 module.exports = { authUser }