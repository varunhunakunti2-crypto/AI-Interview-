 // User ka data MongoDB se lene ke liye userModel import kar rahe hain
 const userModel = require("../models/user.model.js")
 // Password ko hash karne aur verify karne ke liye bcrypt import kar rahe hain
 const bcrypt = require("bcryptjs")
 // JWT token banane aur verify karne ke liye jsonwebtoken import kar rahe hain
 const jwt = require("jsonwebtoken")
 // Logged-out tokens ko blacklist mein track karne ke liye model import kar rahe hain
 const tokenBlacklistModel = require("../models/blacklist.model.js")

 /**
  * @name registerUserController
  * @description register a new user, expects username, email and password in the request body
  * @access Public
  */
 async function registerUserController(req, res) {

     // Request body se username, email aur password nikal rahe hain
     const { username, email, password } = req.body

     // Agar koi bhi field missing ho toh 400 error return karo
     if (!username || !email || !password) {
         return res.status(400).json({
             message: "Please provide username, email and password"
         })
     }

     // Check kar rahe hain ki same username ya email se pehle se account toh nahi hai
     const isUserAlreadyExists = await userModel.findOne({
         $or: [ { username }, { email } ]
     })

     // Agar user already exist karta hai toh error bhejo
     if (isUserAlreadyExists) {
         return res.status(400).json({
             message: "Account already exists with this email address or username"
         })
     }

     // Password ko bcrypt se hash kar rahe hain (10 rounds of salt)
     const hash = await bcrypt.hash(password, 10)

     // Naya user database mein create kar rahe hain — password hashed form mein store hoga
     const user = await userModel.create({
         username,
         email,
         password: hash
     })

     // JWT token generate kar rahe hain (1 din ke liye valid rahega)
     const token = jwt.sign(
         { id: user._id, username: user.username },
         process.env.JWT_SECRET,
         { expiresIn: "1d" }
     )

    // Token ko cookie mein set kar rahe hain taaki user logged in rahe
    res.cookie("token", token, {
    httpOnly: true,
    secure: false,       // keep false for localhost
    sameSite: "lax"
})


     // User ko success response bhej rahe hain with basic info
     res.status(201).json({
         message: "User registered successfully",
         user: {
             id: user._id,
             username: user.username,
             email: user.email
         }
     })

 }


 /**
  * @name loginUserController
  * @description login a user, expects email and password in the request body
  * @access Public
 */
 async function loginUserController(req, res) {

     // Request se email aur password nikalta hai
     const { email, password } = req.body

     // Database mein email se user dhundh raha hai
     const user = await userModel.findOne({ email })

     // Agar user nahi mila toh invalid credentials error do
     if (!user) {
         return res.status(400).json({
             message: "Invalid email or password"
         })
     }

     // Entered password ko DB ke hashed password se compare kar rahe hain
     const isPasswordValid = await bcrypt.compare(password, user.password)

     // Agar password match nahi kiya toh error bhejo
     if (!isPasswordValid) {
         return res.status(400).json({
             message: "Invalid email or password"
         })
     }

     // Login successful — JWT token generate kar rahe hain
     const token = jwt.sign(
         { id: user._id, username: user.username },
         process.env.JWT_SECRET,
         { expiresIn: "1d" }
     )

     // Token ko cookie mein set karo aur user details response mein bhejo
     res.cookie("token", token)
     res.status(200).json({
         message: "User loggedIn successfully.",
         user: {
             id: user._id,
             username: user.username,
             email: user.email
         }
     })
 }


 /**
  * @name logoutUserController
  * @description clear token from user cookie and add the token in blacklist
  * @access public
  */
 async function logoutUserController(req, res) {
     // Cookie se current token nikaal rahe hain
     const token = req.cookies.token

     // Agar token hai toh use blacklist mein daal do (invalidate kar do)
     if (token) {
         await tokenBlacklistModel.create({ token })
     }

     // Cookie ko browser se clear kar rahe hain
     res.clearCookie("token")

     res.status(200).json({
        message: "User logged out successfully"
     })
 }

 /**
  * @name getMeController
  * @description get the current logged in user details.
  * @access private
  */
 async function getMeController(req, res) {

     // req.user mein JWT se decode hua user data hota hai (authMiddleware ne set kiya tha)
     const user = await userModel.findById(req.user.id)



     // User ki basic details response mein bhej rahe hain
     res.status(200).json({
         message: "User details fetched successfully",
         user: {
             id: user._id,
             username: user.username,
             email: user.email
         }
     })

 }



 // Saare controllers ko export kar rahe hain taaki routes mein use ho sake
 module.exports = {
    registerUserController,
     loginUserController,
     logoutUserController,
     getMeController
 }