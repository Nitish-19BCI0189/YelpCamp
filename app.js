var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Comment = require("./models/comment");
var Campground = require("./models/campground");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var campgrounds = require("./routes/campgrounds");
var comments = require("./routes/comments");
var index = require("./routes/index");
var authRoutes = require("./routes/auth-routes");
var passportSetup = require("./config/passport-setup");
var cookieSession = require("cookie-session");
var keys = require("./config/keys");
var methodOverride = require("method-override");
var flash = require("connect-flash");
// const ejsLint = require('ejs-lint');
mongoose.connect("mongodb://localhost/yelp_camp_2");

// var seedDB = require("./seed");

// seedDB();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(cookieSession({
	maxAge : 24*60*60*1000,
	keys : [keys.session.cookieKey]
}));

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
	secret : "My name is Harsh",
	resave : false,
	saveUninitialized : false 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(index);
app.use("/auth",authRoutes);
app.use("/campgrounds",campgrounds);
app.use("/campgrounds/:id/comments",comments);

app.listen(3000,function(){
	console.log("The YelpCamp server has started.");
});