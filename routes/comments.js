var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req,res){
	var id = req.params.id;
	res.render("newComment",{id:id});
});
router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err || !campground){
			req.flash("error","Something went wrong");
			res.redirect("/campgrounds");
		}
		else{
			var author = {
				id : req.user.id,
				name : req.user.fname + " " + req.user.lname
			}
			Comment.create({author : author, text: req.body.text},function(err,comment){
				if(err){
					console.log("comment error");
				}
				else{
					campground.comments.push(comment);
					campground.save();
					// req.flash("success","Added comment sucessfully");
					res.json({comment : comment, user : req.user, campground:campground});
					// res.redirect("/campgrounds/"+req.params.id);
				}
			});
			
			}
			});
	
});

//EDIT COMMENT
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err || !campground){
			req.flash("error","Campground not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id,function(err,comment){
		if(err || !comment){
			req.flash("error","Something went wrong");
			res.redirect("back");
		}
		else{
			res.render("edit-comment",{id:req.params.id,comment:comment});
		}
	});
	});
	
});

//UPDATE COMMENT
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,{text : req.body.text},{new : true},function(err,comment){
		if(err || !comment){
			req.flash("error","Something went wrong");
			res.redirect("back");
		}
		else{
			res.json(comment);
			// req.flash("success","Your comment updated successfully");
			// res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//DELETE COMMENT
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id).then(function(comment){
		console.log("removed comment ",comment);
		// if(err || !comment){
		// 	req.flash("error","Something went wrong");
		// 	res.redirect("back");
		// }
		// else{
			
			Campground.findById(req.params.id).then((campground)=>{
					campground.comments.pull(comment._id);
				    Campground.findByIdAndUpdate(req.params.id,{comments : campground.comments},{new : true}).then(updatedCampground => {
						console.log("this ",campground);
					var obj ={comment : comment,
								campground : updatedCampground							 
							 };
					res.json(obj);
					});
			});
			
			// req.flash("success","Your comment was deleted succesfully");
			// res.redirect("/campgrounds/"+ req.params.id);
		// }
	});
});

module.exports = router;
