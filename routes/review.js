const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");


const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");


const reviewControllers = require("../controllers/reviews.js");


// Post 
// review route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview));


//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewControllers.destroyReview));
module.exports=router;
