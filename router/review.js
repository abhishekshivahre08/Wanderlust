const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utility/wrapAsync.js");
const ExpressError = require("../utility/ExpressError.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
// Revies contoller route import
const reviewController = require("../controller/reviewcotrollerroute.js");



// Reviews route starting here 
// Reviews POST route
router.post("/", isLoggedIn,
    validateReview, wrapAsync(reviewController.CreateReview));

// Delete Review Route
router.delete("/:reviewid", isLoggedIn, isReviewAuthor,
    wrapAsync(reviewController.DeleteReview));


module.exports = router;