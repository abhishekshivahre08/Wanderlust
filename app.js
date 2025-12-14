if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
    // console.log(process.env);
};



const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utility/ExpressError.js");
const session = require("express-session");
// const MongoStore = require('connect-mongo');
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
// routes 
const ListingsRouter = require("./router/Listings.js");
const reviewsRouter = require("./router/review.js");
const UserRouter = require("./router/user.js");

// authrntication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// connection with mongodb
// const Mongourl = "mongodb://127.0.0.1:27017/wanderlust";
console.log(process.env.ATLAS_URL);

const dbUrl = process.env.ATLAS_URL;
main()
    .then(() => {
        console.log("connected to db");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("session store error");
});
const sessionOption = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};



// app.get("/", (req, res) => {
//     res.send("hi, i am root");
// })
app.get("/", (req, res) => {
    res.redirect("/listings");   // root pe jao to listings page khul jaye
});


// session setup
app.use(session(sessionOption));
app.use(flash());

// authentication code
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// flash middleware
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success")[0] || [];
//     res.locals.error = req.flash("error")[0] || [];
//     res.locals.currentUser = req.user || null;
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currentUser = req.user || null;
//     next();
// });

app.use((req, res, next) => {
    res.locals.success = req.flash("success") || [];
    res.locals.error = req.flash("error") || [];
    res.locals.currentUser = req.user || null;
    next();
});




// All listings  reviviews and User login/out  routes 
app.use("/Listings", ListingsRouter);
app.use("/Listings/:id/reviews", reviewsRouter);
app.use("/", UserRouter);

// this for unwanded routes thsts user put in 
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Eroor handler middleware 
app.use((err, req, res, next) => {


    let { statusCode = 500, message = "something went wroung!" } = err;
    console.log("Error handler triggered:", err);
    // res.status(statusCode).send(message);
    res.status(statusCode).render("Listings/error", { message });
});


app.listen(port, (req, res) => {
    console.log(`server is live on port number ${port}`);
});
