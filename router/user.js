const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utility/wrapAsync.js");
const passport = require("passport");
const { saveRdirectUrl } = require("../middleware.js");
// signup contoller route
const userController = require("../controller/usercontrollerroute.js");

// signup page route
router.get("/signup", userController.renderSignupForm);
// signup post route
router.post("/signup", wrapAsync(userController.Signup));

// login route
router.get("/Login", userController.renderLoginForm);

router.post("/Login", saveRdirectUrl, passport.authenticate('local', {
        failureRedirect: "/Login",
        failureFlash: true,
    }),
    userController.Login);

// logout route
router.get("/logout", userController.Logout);



module.exports = router;