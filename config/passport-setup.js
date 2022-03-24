const passport = require("passport");
const GoogleStrategey = require("passport-google-oauth20");
const keys = require("./keys");
const mongoose = require("mongoose");
const User = require("../models/user");

passport.serializeUser((user,done)=>{
	done(null,user.id);
});

passport.deserializeUser((id,done)=>{
	User.findById(id).then((user)=>{
		done(null,user);
	});
});

passport.use(
	new GoogleStrategey({
	//options for google strat
		callbackURL : "/auth/google/redirect",
		clientID : keys.google.clientID,
		clientSecret : keys.google.clientSecret
}, (accessToken,refreshToken,profile,done) => {
		//passport callback function
		User.findOne({googleId : profile.id }).then((foundUser)=>{
			if(foundUser)
				{
					done(null,foundUser);
				}
			else{
				new User({
					fname    : profile._json.given_name,
					lname    : profile._json.family_name,
					username : profile._json.email,
					googleId : profile.id
				}).save().then((newUser)=>{
					done(null,newUser);
				});
				
			}
		});
	})

);