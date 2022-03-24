var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
	res.render("landingPage");
});

//Auth
router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username, fname : req.body.fname , lname : req.body.lname});
	User.register(newUser , req.body.password, function(err,user){
		if(err){
			req.flash("error",err.message);
			res.redirect("/register");
		}
		else{
				passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to YelpCamp " + user.fname + " " + user.lname);	
				res.redirect("/campgrounds");
			});
		}
	});
	
});

router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local", {
	// successRedirect : "/campgrounds",
	failureFlash : true ,
	failureRedirect : "/login"
}),function(req,res){
	
	if(req.user.username === "nitish@gmail.com"){
	User.findByIdAndUpdate(req.user.id,{isAdmin: true},function(err,user){
		if (err){
			console.log(err);
		}
		else{
			console.log(req.user);
		}
	});
} else{
	User.findByIdAndUpdate(req.user.id,{isAdmin: false},function(err,user){
		if (err){
			console.log(err);
		}
		else{
			console.log(req.user);
		}
	});
	console.log("failed");
}
	req.flash("success","You are now logged in");
	res.redirect("/campgrounds");
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You Logged Out Successfully");
	res.redirect("/campgrounds");
});

module.exports = router;