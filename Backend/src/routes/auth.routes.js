 // Express ka Router use kar rahe hain — alag-alag routes define karne ke liye
 const { Router } = require('express')
 // Auth controller import kar rahe hain jisme register, login, logout, getMe functions hain
 const authController = require("../controllers/auth.controller")
 // Auth middleware import kar rahe hain — protected routes ke liye
 const authMiddleware = require("../middlewares/auth.middleware")
// Router ka instance bana rahe hain
const authRouter = Router()


 /**
  * @route POST /api/auth/register
  * @description Register a new user
  * @access Public
  * Naya user register karne ka route — publicly accessible hai
  */
 authRouter.post("/register", authController.registerUserController)


 /**
  * @route POST /api/auth/login
  * @description login user with email and password
  * @access Public
  * User login karne ka route — email aur password chahiye
  */
 authRouter.post("/login", authController.loginUserController)


 /**
  * @route GET /api/auth/logout
  * @description clear token from user cookie and add the token in blacklist
  * @access public
  * Logout karne ka route — token blacklist mein daalta hai aur cookie clear karta hai
  */
 authRouter.get("/logout", authController.logoutUserController)


 /**
  * @route GET /api/auth/get-me
  * @description get the current logged in user details
  * @access private
  * Abhi logged in user ki details fetch karne ka route — authUser middleware se protect hai
  */
 authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)
 // authRouter ko baaki files mein use karne ke liye export kar rahe hain
 module.exports = authRouter

