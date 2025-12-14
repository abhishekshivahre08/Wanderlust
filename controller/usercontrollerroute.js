const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.Signup = async(req, res) => {

    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            console.log(registerUser);
            req.flash("success", "Welcome to Wanderlust");
            return res.redirect("/Listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.Login = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust! ");
    let redirectUrl = res.locals.redirectUrl || "/Listings";
    return res.redirect(redirectUrl);
};

module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/Listings");
    });
};