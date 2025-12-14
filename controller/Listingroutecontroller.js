const Listing = require("../models/listing.js");
const mongoose = require('mongoose');


module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
    //   res.render("../views/listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    // res.render("../views/Listings/create.ejs");
    res.render("Listings/create");
};





module.exports.createListing = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    newListing.image = { url: url, filename: filename };
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/Listings");
};


module.exports.editListing = async(req, res) => {
    try {
        let { id } = req.params;
        id = id.trim(); // ✅ remove accidental spaces

        // ✅ validate ObjectId format before querying
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Listing ID");
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/Listings");
        }

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        let origanalLimageUrl = listing.image.url;
        origanalLimageUrl = origanalLimageUrl.replace("/upload", "/upload/w_250");
        // res.render("Listings/edit.ejs", { listing, origanalLimageUrl });
        res.render("Listings/edit", { listing, origanalLimageUrl });
    } catch (err) {
        console.error("Error in edit route:", err);
        res.status(500).send("Server Error");
    }
};


module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.Listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url: url, filename: filename };
    }
    await listing.save();
    req.flash("success", "New Listing Updated!")
    res.redirect(`/Listings/${id}`);
};

module.exports.DeleteListing = async(req, res) => {
    let { id } = req.params;
    let deletelisting = await Listing.findByIdAndDelete(id);
    console.log(deletelisting);
    req.flash("success", "New Listing Deleted!")
    res.redirect("/Listings");
};

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/Listings");
    }
    console.log(listing);
    // console.log(listing);
    res.render("Listings/show", { listing });
    //  res.render("../views/listings/show.ejs", { listing });
};