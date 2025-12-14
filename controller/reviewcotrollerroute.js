const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



module.exports.CreateReview = async(req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!")
    res.redirect(`/Listings/${listing._id}`);

};

module.exports.DeleteReview = async(req, res) => {
    let { id, reviewid } = req.params;
    let deletearray = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    console.log(deletearray);
    let deletereview = await Review.findByIdAndDelete(reviewid);
    console.log(deletereview);
    req.flash("success", "New Review Deleted!")
    res.redirect(`/Listings/${id}`);
};