var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/",function(req,res){
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log("error1");
		}
		else{
			res.render("index",{campgrounds : campgrounds});
		}
	});
});

router.post("/",middleware.isLoggedIn,function(req,res){
	var author = {
				id : req.user._id,
				name : req.user.fname + " " + req.user.lname
			};
	Campground.create({name: req.body.name , image: req.body.image, description : req.body.description , author : author, price:req.body.price},function(err,campground){
		if(err){
			req.flash("error","Something went wrong");
		}
		else{
			req.flash("success","Campground successfully created")
			res.redirect("/campgrounds");
		}
	});
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("new");
});

router.get("/:id",function(req,res){
	var id = req.params.id;
	Campground.findById(req.params.id).populate("comments likes").exec(function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","No campground found");
			res.redirect("back");
			console.log(err);
		}
		else{
			res.render("show",{campground : foundCampground , id:id});
		}
	});
});

//EDIT THIS CAMPGROUND
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","No campground found");
			res.redirect("/campgrounds");
			console.log(err);
		}
		else{
			res.render("edit-campground",{campground : foundCampground});
		}
	});
});

//UPDATE THIS CAMPGROUND
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err || !updatedCampground){
			req.flash("error","Something went wrong");
			res.redirect("/campgrounds");
		}
		else{
			req.flash("success","Campground updated successfully");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE CAMPGROUND
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){

	Campground.findByIdAndRemove(req.params.id,function(err,campground){
		if(err || !campground){
			req.flash("error","Something went wrong");
			res.redirect("/campgrounds");
		}
		else{
			//a
		     Comment.remove({_id : {$in : campground.comments}},function(err){
				 if(err){
					 console.log(err);
				 }
				}); 
			//b
			req.flash("success","Campground deleted successfully");
			res.redirect("/campgrounds");
		}
	});
});

//LIKE THIS CAMPGROUND
router.post("/:id/like",middleware.isLoggedIn,function(req,res){
	//find the campground in database
	//check if the user has already liked the post or not
		//if liked, delike it by removing user from like array 
		//else add to like array
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			return res.redirect("back");
		}
		var foundCampgroundLiked = foundCampground.likes.some(function(like){
			return like.equals(req.user._id);
		});
		
		if(foundCampgroundLiked){
			foundCampground.likes.pull(req.user._id);
		}
		else{
			foundCampground.likes.push(req.user._id);
		}
		foundCampground.save(function(err){
			if(err){
				req.flash("error","CSomething went wrong");
			return res.redirect("back");
			} var obj = {campground : foundCampground};
			Campground.findById(req.params.id).populate("likes").exec(function(err,foundCampground){
				if(err){
					req.flash("error","Something went wrong");
					res.redirect("/campgrounds");
				}
				else{
					
					obj.likedBy = req.user.fname + " " + req.user.lname;
					obj.uid = req.user.id;
					res.json(obj);
				}
				
			})
			
			
			// res.redirect("/campgrounds/"+ req.params.id);
		});
		
	});
});

module.exports = router;

