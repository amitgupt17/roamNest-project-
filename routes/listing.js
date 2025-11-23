const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



router
  .route("/")
  .get(wrapAsync(listingControllers.indexform))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingControllers.createListing)
  );



// New route
router.get("/new",isLoggedIn,listingControllers.newListing);


router
  .route("/:id")
  .get(wrapAsync(listingControllers.showform))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingControllers.updateform))
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingControllers.destroy)
  );



// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.editform));


module.exports = router;