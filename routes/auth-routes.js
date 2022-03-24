const express = require("express");
const router = express.Router();
const passport = require("passport");
var Campground = require("../models/campground");

//auth with google
router.get("/google",passport.authenticate("google",{
	scope:["profile","openid","email"]
	}));

//callback route for google to redirect to
router.get("/google/redirect",passport.authenticate("google"),(req,res) => {
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log("error1");
		}
		else{
			// res.render("index",{campgrounds : campgrounds});
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;