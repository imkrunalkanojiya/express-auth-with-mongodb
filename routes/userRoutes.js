const express = require("express");

// Create express router obj
const router = express.Router();

// import User Controller
const {
  userRegistration,
  userLogin,
  userChangePassword,
  userLoggedIn,
  userSendMailForResetPassword,
  userResetPassword
} = require("../controllers/userController");

// User Routes Middleware
const checkUserAuth = require("../middlewares/auth-middleware");

// PUBLIC ROUTES
router.post("/register", userRegistration);
router.post("/login", userLogin);
router.post ('/sendresetpasswordemail',userSendMailForResetPassword)
router.post ('/resetpassword/:id/:token',userResetPassword)

// PROTECTED ROUTES
router.post("/changepassword", checkUserAuth, userChangePassword);
router.get("/getuser",checkUserAuth,userLoggedIn)

// Export Router
module.exports = router;
