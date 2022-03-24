var mongoose = require("mongoose");

var campgroundSchema = {
	name : String,
	image : String,
	description : String,
	price : String,
	author : {
		id:{
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		name : String
	},
	comments : [
	{
		type : mongoose.Schema.Types.ObjectId,
		ref : "Comment"
	}
			   ],
	likes : [
				{
					type : mongoose.Schema.Types.ObjectId,
					ref : "User"
				}
			]
};

module.exports = mongoose.model("Campground",campgroundSchema);