var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
	password : String,
	googleId : String,
	fname    : String,
	lname    : String,
	username : String, // username is email
	isAdmin  : {type : Boolean , default : false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);