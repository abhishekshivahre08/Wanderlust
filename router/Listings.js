const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync.js");
const Listing = require("../models/listing.js");
const mongoose = require('mongoose');
// for loggedin chek functinality
const { isLoggedIn, isOwner, validatelistings } = require("../middleware.js");

// Listing index route contoller fuctions
const ListingController = require("../controller/Listingroutecontroller.js");
// multer for image upload// cloudinary config and storage for imge upload
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });






// main route thats are Listings Index Route
router.get("/", wrapAsync(ListingController.index));


// new route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// create route
router.post("/",
    isLoggedIn,
    upload.single("Listing[images]"),
    validatelistings,
    wrapAsync(ListingController.createListing));


//  Listing Edit route  
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.editListing));

// Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single("Listing[images]"),
    validatelistings,
    wrapAsync(ListingController.updateListing));

//Delete Route 
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.DeleteListing));

// All Listings  show route 
router.get("/:id", wrapAsync(ListingController.showListing));


module.exports = router;