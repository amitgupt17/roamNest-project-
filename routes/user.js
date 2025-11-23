const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userControllers = require("../controllers/user.js");

router
    .route("/signup")
    .get(userControllers.signupform)
    .post(wrapAsync(userControllers.userSignupform));

router
    .route("/login")
    .get(userControllers.loginform)
    .post(
        saveRedirectUrl,
        passport.authenticate('local', { 
            failureRedirect: '/login' , 
            failureFlash:true
    }),
    userControllers.userLoginform
    );




//logout user route

router.get("/logout",userControllers.logoutForm);


module.exports=router;