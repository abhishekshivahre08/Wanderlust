const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utility/ExpressError.js");
const { ListingSchema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/Login");
    };
    next();
};

module.exports.saveRdirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};


module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/Listings/${id}`);
    };
    next();
};

module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if (!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/Listings/${id}`);
    };
    next();
};

// for server side error handling function for listings
module.exports.validatelistings = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        let errMesg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMesg);
    } else {
        next();
    }
};

// for server side error handling function for listings review
module.exports.validateReview = (req, res, next) => {
    let { error, value } = reviewSchema.validate(req.body);
    console.log(value);

    if (error) {
        let errMesg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMesg);
    } else {
        next();
    }
}